import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

// The cart belongs to the logged-in customer and lives in localStorage (key per user id)
const keyFor = (user) => (user ? `pharma_cart_${user.id}` : null)

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),

  getters: {
    totalCount: (s) => s.items.reduce((n, i) => n + i.quantity, 0),
    totalAmount: (s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  },

  actions: {
    load() {
      const key = keyFor(useAuthStore().user)
      this.items = key ? JSON.parse(localStorage.getItem(key) || '[]') : []
    },

    _persist() {
      const key = keyFor(useAuthStore().user)
      if (key) localStorage.setItem(key, JSON.stringify(this.items))
    },

    /** @returns {boolean} false when there is not enough stock */
    add(medicine) {
      const line = this.items.find((i) => i.id === medicine.id)
      const wanted = (line?.quantity ?? 0) + 1
      if (wanted > medicine.stock_quantity) return false

      if (line) {
        line.quantity = wanted
        line.stock = medicine.stock_quantity
      } else {
        this.items.push({
          id: medicine.id,
          title: medicine.title,
          price: medicine.price,
          stock: medicine.stock_quantity,
          quantity: 1,
        })
      }
      this._persist()
      return true
    },

    setQuantity(id, quantity) {
      const line = this.items.find((i) => i.id === id)
      if (!line) return
      line.quantity = Math.max(1, Math.min(quantity, line.stock))
      this._persist()
    },

    remove(id) {
      this.items = this.items.filter((i) => i.id !== id)
      this._persist()
    },

    clear() {
      this.items = []
      this._persist()
    },
  },
})
