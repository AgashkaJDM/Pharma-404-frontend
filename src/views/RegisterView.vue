<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import AuthLayout from '@/components/common/AuthLayout.vue'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const error = ref(null)
const loading = ref(false)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await auth.register(form)
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
  <AuthLayout title="Hasaba durmak">
    <form @submit.prevent="submit" class="space-y-5">
      <label class="block text-sm font-semibold">F.I.Ş.
        <input v-model="form.name" required autocomplete="name" :class="input" />
      </label>
      <label class="block text-sm font-semibold">Email
        <input v-model="form.email" type="email" required autocomplete="email" :class="input" />
      </label>
      <label class="block text-sm font-semibold">Açarsöz (iň az 8 simwol)
        <input v-model="form.password" type="password" minlength="8" required autocomplete="new-password" :class="input" />
      </label>
      <label class="block text-sm font-semibold">Açarsözi gaýtalaň
        <input v-model="form.password_confirmation" type="password" required autocomplete="new-password" :class="input" />
      </label>

      <p v-if="error" role="alert" class="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">{{ error }}</p>

      <button :disabled="loading" class="w-full rounded-full bg-cobalt py-3.5 font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
        {{ loading ? 'Garaşyň...' : 'Hasaba dur' }}
      </button>
      <p class="text-center text-sm text-ink/60 dark:text-white/60">
        Hasabyňyz barmy?
        <router-link :to="{ name: 'login', query: route.query }" class="font-semibold text-cobalt hover:underline dark:text-blue-300">Girmek</router-link>
      </p>
    </form>
  </AuthLayout>
</template>
