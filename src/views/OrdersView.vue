<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRight } from '@lucide/vue'
import api from '@/services/api'
import OrderStatus from '@/components/common/OrderStatus.vue'

const orders = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    orders.value = (await api.get('/orders')).data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const fmtDate = (d) => new Date(d).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 pb-12 pt-10">
    <h1 class="mb-8 font-display text-4xl font-bold tracking-tight sm:text-5xl">Meniň sargytlarym</h1>

    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="h-24 animate-pulse rounded-[1.75rem] bg-white/70 dark:bg-night-2"></div>
    </div>
    <p v-else-if="error" role="alert" class="rounded-[2rem] bg-red-500/10 p-8 text-center text-red-700 dark:text-red-300">{{ error }}</p>
    <div v-else-if="orders.length === 0" class="rounded-[2rem] bg-white px-6 py-16 text-center dark:bg-night-2">
      <p class="font-display text-2xl font-semibold">Heniz sargyt ýok</p>
      <router-link to="/" class="mt-6 inline-block rounded-full bg-cobalt px-6 py-3 font-semibold text-white transition hover:brightness-110 active:scale-95">Kataloga geç</router-link>
    </div>

    <ul v-else class="space-y-3">
      <li v-for="o in orders" :key="o.id">
        <router-link
          :to="{ name: 'order', params: { id: o.id } }"
          class="group flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[1.75rem] bg-white p-5 ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cobalt/10 dark:bg-night-2 dark:ring-white/10 dark:hover:shadow-none"
        >
          <div class="flex-1 basis-40">
            <div class="font-display text-2xl font-bold">Sargyt #{{ o.id }}</div>
            <div class="text-sm text-ink/60 dark:text-white/55">{{ fmtDate(o.created_at) }}, {{ o.items.length }} görnüş</div>
          </div>
          <span class="font-display text-xl font-bold">{{ o.total_amount.toFixed(2) }} TMT</span>
          <OrderStatus :order="o" />
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-paper transition group-hover:bg-cobalt group-hover:text-white dark:bg-night" aria-hidden="true"><ArrowRight :size="18" /></span>
        </router-link>
      </li>
    </ul>
  </main>
</template>
