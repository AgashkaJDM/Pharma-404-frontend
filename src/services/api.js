// All requests to the Laravel REST API go through this file.
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

const TOKEN_KEY = 'pharma_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || 'Ýalňyşlyk ýüze çykdy')
    this.status = status
    this.errors = body?.errors || {}
  }
  /** first validation message, if any */
  get firstError() {
    const first = Object.values(this.errors)[0]
    return Array.isArray(first) ? first[0] : null
  }
}

// Called when the server answers 401 (token expired / wrong). Set by the auth store.
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

async function request(method, path, { body, params } = {}) {
  const url = new URL(API_URL + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) url.searchParams.set(k, v)
    })
  }

  const headers = { Accept: 'application/json' }
  if (body) headers['Content-Type'] = 'application/json'
  const token = tokenStorage.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError(0, { message: 'Serwere baglanyp bolmady. Backend işleýärmi?' })
  }

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized()
    throw new ApiError(response.status, json)
  }
  return json // { success, message, data, meta? }
}

export default {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body: body ?? {} }),
}
