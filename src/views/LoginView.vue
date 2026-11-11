<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import AuthLayout from '@/components/common/AuthLayout.vue'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

async function submit() {
  error.value = null
  loading.value = true
  try {
    const kind = await auth.login(email.value, password.value)
    if (kind === 'employee') return // browser is going to the Blade panel
    cart.load()
    router.push(route.query.redirect || '/')
  } catch (e) {
    error.value = e.firstError || e.message
  } finally {
    loading.value = false
  }
}

const input = 'mt-1.5 block w-full rounded-2xl border-0 bg-white px-4 py-3 text-base ring-1 ring-ink/10 outline-none transition focus:ring-2 focus:ring-cobalt dark:bg-night-2 dark:ring-white/15'
</script>

<template>
  <AuthLayout title="Ulgama girmek">
    <form @submit.prevent="submit" class="space-y-5">
      <label class="block text-sm font-semibold">Email
        <input v-model="email" type="email" required autocomplete="email" :class="input" />
      </label>
      <label class="block text-sm font-semibold">Açarsöz
        <input v-model="password" type="password" required autocomplete="current-password" :class="input" />
      </label>

      <p v-if="error" role="alert" class="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">{{ error }}</p>

      <button :disabled="loading" class="w-full rounded-full bg-cobalt py-3.5 font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
        {{ loading ? 'Garaşyň...' : 'Girmek' }}
      </button>

      <p class="text-center text-sm text-ink/60 dark:text-white/60">
        Hasabyňyz ýokmy?
        <router-link :to="{ name: 'register', query: route.query }" class="font-semibold text-cobalt hover:underline dark:text-blue-300">Hasaba dur</router-link>
      </p>
      <p class="text-center text-xs text-ink/50 dark:text-white/40">Işgärler we administrator girenden soň öz paneline geçirilýär.</p>
    </form>
  </AuthLayout>
</template>
