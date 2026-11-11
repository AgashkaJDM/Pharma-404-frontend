import { defineStore } from 'pinia'
import api from '@/services/api'

export const useMedicineStore = defineStore('medicines', {
  state: () => ({
    items: [],
    categories: [],
    countries: [],
    meta: { current_page: 1, last_page: 1, total: 0 },
    loading: false,
    error: null,
    filters: { search: '', category_id: '', country: '', min_price: '', max_price: '' },
  }),

  actions: {
    async loadFilterOptions() {
      const [cats, countries] = await Promise.all([api.get('/categories'), api.get('/countries')])
      this.categories = cats.data
      this.countries = countries.data
    },

    async fetch(page = 1) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/medicines', { ...this.filters, page })
        this.items = res.data
        this.meta = res.meta
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    resetFilters() {
      this.filters = { search: '', category_id: '', country: '', min_price: '', max_price: '' }
      return this.fetch(1)
    },
  },
})
