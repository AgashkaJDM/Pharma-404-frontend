import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guest: true } },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { guest: true } },
    { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue'), meta: { auth: true } },
    { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue'), meta: { auth: true } },
    { path: '/orders/:id', name: 'order', component: () => import('@/views/ReceiptView.vue'), meta: { auth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Auth protection: a guest cannot open the cart / orders -> login page
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isAuth) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guest && auth.isAuth) {
    return { name: 'home' }
  }
})

export default router
