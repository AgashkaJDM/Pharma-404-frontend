import { defineStore } from 'pinia'
import api, { tokenStorage, setUnauthorizedHandler } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: tokenStorage.get(),
    user: JSON.parse(localStorage.getItem('pharma_user') || 'null'),
  }),

  getters: {
    isAuth: (s) => !!s.token,
    roleLabel: (s) => ({ customer: 'Müşderi', staff: 'Işgär', admin: 'Administrator' }[s.user?.role] || ''),
  },

  actions: {
    _save(token, user) {
      this.token = token
      this.user = user
      tokenStorage.set(token)
      localStorage.setItem('pharma_user', JSON.stringify(user))
    },

    clear() {
      this.token = null
      this.user = null
      tokenStorage.clear()
      localStorage.removeItem('pharma_user')
    },

    /**
     * Customer -> token saved, stays in the Vue app.
     * Admin / staff -> no token; the API says where their Blade panel is, the browser goes there.
     * Returns 'customer' or 'employee'.
     */
    async login(email, password) {
      const { data } = await api.post('/login', { email, password })

      if (data.role === 'admin' || data.role === 'staff') {
        window.location.href = data.redirect_url
        return 'employee'
      }
      this._save(data.token, data.user)
      return 'customer'
    },

    async register(form) {
      const { data } = await api.post('/register', form)
      this._save(data.token, data.user)
    },

    async logout() {
      try { await api.post('/logout') } catch { /* token may be already invalid */ }
      this.clear()
    },
  },
})

// 401 from any request -> forget the token and go to the login page
export function installAuthGuard(router) {
  setUnauthorizedHandler(() => {
    useAuthStore().clear()
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  })
}
