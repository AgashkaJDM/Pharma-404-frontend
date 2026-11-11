<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, ShoppingBag } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import ToggleDarkMode from '@/components/common/ToggleDarkMode.vue'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const initial = computed(() => (auth.user?.name || '?').trim().charAt(0).toUpperCase())

async function logout() {
  await auth.logout()
  cart.load() // guest -> empty cart in memory
  router.push({ name: 'home' })
}

const link = 'rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-ink/5 dark:hover:bg-white/10'
const linkActive = 'bg-ink! text-white! dark:bg-white! dark:text-ink!'
</script>

<template>
  <header class="sticky top-0 z-40 px-3 pt-3">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 rounded-full bg-white/80 pl-4 pr-2 shadow-lg shadow-ink/5 ring-1 ring-ink/5 backdrop-blur-xl dark:bg-night-2/80 dark:shadow-none dark:ring-white/10">
      <router-link to="/" class="flex items-center gap-2.5" aria-label="Pharma 404 — baş sahypa">
        <span class="flex h-5 w-9 -rotate-45 overflow-hidden rounded-full" aria-hidden="true">
          <span class="w-1/2 bg-cobalt"></span>
          <span class="w-1/2 bg-mint"></span>
        </span>
        <span class="font-display text-xl font-bold tracking-tight">
          Pharma
          <span class="ml-1 rounded-full bg-ink px-2 py-0.5 text-sm text-white dark:bg-white dark:text-ink">404</span>
        </span>
      </router-link>

      <nav class="flex items-center gap-1">
        <router-link to="/" :class="link" exact-active-class="bg-ink! text-white! dark:bg-white! dark:text-ink!" class="hidden sm:block">
          Katalog
        </router-link>
        <router-link v-if="auth.isAuth" to="/orders" :class="link" :active-class="linkActive">
          Sargytlarym
        </router-link>

        <router-link
          to="/cart"
          aria-label="Sebet"
          class="ml-1 flex h-10 items-center gap-2 rounded-full bg-cobalt px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95"
        >
          <ShoppingBag :size="18" />
          <span class="hidden sm:inline">Sebet</span>
          <span v-if="cart.totalCount > 0" class="flex h-5 min-w-5 items-center justify-center rounded-full bg-mint px-1.5 text-xs font-bold text-ink">
            {{ cart.totalCount }}
          </span>
        </router-link>

        <template v-if="auth.isAuth">
          <div class="ml-1 hidden items-center gap-2 md:flex">
            <span class="flex h-10 w-10 items-center justify-center rounded-full bg-sun font-display font-bold text-ink">{{ initial }}</span>
            <span class="leading-tight">
              <span class="block text-sm font-semibold">{{ auth.user?.name }}</span>
              <span class="block text-xs text-ink/60 dark:text-white/50">{{ auth.roleLabel }}</span>
            </span>
          </div>
          <button
            @click="logout"
            aria-label="Çykmak"
            title="Çykmak"
            class="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-ink/5 active:scale-90 dark:hover:bg-white/10"
          >
            <LogOut :size="18" />
          </button>
        </template>

        <template v-else>
          <router-link to="/login" :class="link">Girmek</router-link>
          <router-link to="/register" class="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:brightness-125 sm:block dark:bg-white dark:text-ink">
            Hasaba dur
          </router-link>
        </template>

        <ToggleDarkMode />
      </nav>
    </div>
  </header>
</template>
