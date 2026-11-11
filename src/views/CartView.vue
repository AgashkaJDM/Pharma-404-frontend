<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Minus, Pill, Plus, ShoppingBag, Trash2 } from '@lucide/vue'
import api from '@/services/api'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)

const tones = [
  'bg-cobalt/10 text-cobalt dark:bg-cobalt/25 dark:text-blue-200',
  'bg-mint/30 text-emerald-800 dark:bg-mint/15 dark:text-mint',
  'bg-sun/35 text-amber-800 dark:bg-sun/15 dark:text-sun',
  'bg-blush/25 text-rose-700 dark:bg-blush/15 dark:text-blush',
]
const toneOf = (id) => tones[Math.abs(Number(id) || 0) % tones.length]

async function checkout() {
  error.value = null
  loading.value = true
  try {
    // Only ids and quantities go to the server. The price is taken from the database there.
    const { data } = await api.post('/orders', {
      items: cart.items.map((i) => ({ medicine_id: i.id, quantity: i.quantity })),
    })
    cart.clear()
    router.push({ name: 'order', params: { id: data.id } })
  } catch (e) {
    error.value = e.firstError || e.message
  } finally {
    loading.value = false
  }
}

const step = 'flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-ink/5 active:scale-90 disabled:opacity-30 dark:hover:bg-white/10'
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 pb-12 pt-10">
    <h1 class="mb-8 font-display text-4xl font-bold tracking-tight sm:text-5xl">Siziň sebediňiz</h1>

    <div v-if="cart.items.length === 0" class="rounded-[2rem] bg-white px-6 py-16 text-center dark:bg-night-2">
      <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cobalt/10 text-cobalt dark:bg-cobalt/25 dark:text-blue-200"><ShoppingBag :size="28" /></span>
      <p class="mt-4 font-display text-2xl font-semibold">Sebet häzir boş</p>
      <p class="mt-1 text-ink/60 dark:text-white/60">Katalogdan derman saýlap, sebede goşuň.</p>
      <router-link to="/" class="mt-6 inline-block rounded-full bg-cobalt px-6 py-3 font-semibold text-white transition hover:brightness-110 active:scale-95">Kataloga gaýtmak</router-link>
    </div>

    <div v-else class="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <ul class="space-y-3">
        <li v-for="item in cart.items" :key="item.id" class="flex flex-wrap items-center gap-4 rounded-[1.75rem] bg-white p-3 pr-5 ring-1 ring-ink/5 dark:bg-night-2 dark:ring-white/10">
          <span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-t-[2rem] rounded-b-2xl" :class="toneOf(item.id)"><Pill :size="26" class="-rotate-45" aria-hidden="true" /></span>

          <div class="min-w-0 flex-1 basis-40">
            <h3 class="truncate font-display text-lg font-semibold">{{ item.title }}</h3>
            <p class="text-sm text-ink/60 dark:text-white/55">{{ item.price.toFixed(2) }} TMT, ammarda {{ item.stock }} sany</p>
          </div>

          <div class="flex items-center rounded-full bg-paper p-1 dark:bg-night">
            <button :class="step" :disabled="item.quantity <= 1" aria-label="Azalt" @click="cart.setQuantity(item.id, item.quantity - 1)"><Minus :size="16" /></button>
            <span class="w-8 text-center font-semibold" aria-live="polite">{{ item.quantity }}</span>
            <button :class="step" :disabled="item.quantity >= item.stock" aria-label="Köpelt" @click="cart.setQuantity(item.id, item.quantity + 1)"><Plus :size="16" /></button>
          </div>

          <span class="w-28 text-right font-display text-lg font-bold">{{ (item.price * item.quantity).toFixed(2) }} TMT</span>
          <button @click="cart.remove(item.id)" aria-label="Aýyr" title="Aýyr" class="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition hover:bg-red-500/10 active:scale-90">
            <Trash2 :size="18" />
          </button>
        </li>
      </ul>

      <aside class="rounded-[2rem] bg-ink p-6 text-white lg:sticky lg:top-24 dark:bg-night-2 dark:ring-1 dark:ring-white/10">
        <p class="text-white/60">Jemi baha</p>
        <p class="mt-1 font-display text-5xl font-bold tracking-tight">{{ cart.totalAmount.toFixed(2) }}<span class="ml-2 text-xl font-medium text-white/60">TMT</span></p>
        <p class="mt-1 text-sm text-white/60">{{ cart.totalCount }} sany derman</p>

        <button @click="checkout" :disabled="loading" class="mt-6 w-full rounded-full bg-mint py-3.5 font-bold text-ink transition hover:brightness-105 active:scale-[0.98] disabled:opacity-50">
          {{ loading ? 'Işlenýär...' : 'Sargyt bermek' }}
        </button>
        <p v-if="error" role="alert" class="mt-3 rounded-2xl bg-red-500/20 px-4 py-3 text-sm text-red-200">{{ error }}</p>
        <p class="mt-4 text-sm text-white/60">Sargytdan soň işgär ammary barlap çek çykarýar, çek çykandan soň kart bilen töläp bilersiňiz.</p>
      </aside>
    </div>
  </main>
</template>
