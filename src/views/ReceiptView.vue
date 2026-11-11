<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Check, Clock } from '@lucide/vue'
import api from '@/services/api'
import OrderStatus from '@/components/common/OrderStatus.vue'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const error = ref(null)
const paying = ref(false)
const payError = ref(null)

const card = reactive({ card_number: '', card_holder: '', expiry: '', cvv: '' })

async function load(silent = false) {
  if (!silent) loading.value = true
  try {
    order.value = (await api.get(`/orders/${route.params.id}`)).data
    error.value = null
  } catch (e) {
    error.value = e.status === 404 ? 'Sargyt tapylmady' : e.message
  } finally {
    loading.value = false
  }
}

// While the staff has not issued the receipt yet, ask the server every 8 seconds
let timer
onMounted(async () => {
  await load()
  timer = setInterval(() => {
    if (order.value?.status === 'pending') load(true)
  }, 8000)
})
onUnmounted(() => clearInterval(timer))

// step line: 1 order -> 2 receipt -> 3 payment
const step = computed(() => ({ pending: 1, receipt_issued: 2, paid: 3 }[order.value?.status] ?? 0))
const steps = ['Sargyt döredildi', 'Işgär çek çykardy', 'Töleg edildi']

// small helpers for the card form
const formatCard = () => {
  card.card_number = card.card_number.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
const formatExpiry = () => {
  const d = card.expiry.replace(/\D/g, '').slice(0, 4)
  card.expiry = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

async function pay() {
  payError.value = null
  paying.value = true
  try {
    order.value = (await api.post(`/orders/${order.value.id}/pay`, { ...card })).data
    Object.assign(card, { card_number: '', card_holder: '', expiry: '', cvv: '' }) // never keep card data
  } catch (e) {
    payError.value = e.firstError ? 'Kart maglumatlary nädogry' : e.message
  } finally {
    paying.value = false
  }
}

async function cancel() {
  if (!confirm('Sargyt ýatyrylsynmy?')) return
  try {
    order.value = (await api.post(`/orders/${order.value.id}/cancel`)).data
  } catch (e) {
    error.value = e.message
  }
}

const fmtDate = (d) => new Date(d).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
// live preview of the card the customer is typing (the CVV is never shown)
const previewNumber = computed(() => card.card_number.replace(/\s/g, '').padEnd(16, '•').match(/.{4}/g).join(' '))

const input = 'mt-1.5 block w-full rounded-2xl border-0 bg-paper px-4 py-3 text-base ring-1 ring-ink/10 outline-none transition focus:ring-2 focus:ring-cobalt dark:bg-night dark:ring-white/15'
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 pb-12 pt-10">
    <router-link to="/orders" class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-ink/5 dark:hover:bg-white/10">
      <ArrowLeft :size="16" /> Sargytlarym
    </router-link>

    <div v-if="loading" class="mt-6 h-64 animate-pulse rounded-[2rem] bg-white/70 dark:bg-night-2"></div>
    <p v-else-if="error && !order" role="alert" class="mt-6 rounded-[2rem] bg-red-500/10 p-8 text-center text-red-700 dark:text-red-300">{{ error }}</p>

    <template v-else-if="order">
      <div class="mb-8 mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 class="font-display text-4xl font-bold tracking-tight sm:text-5xl">Sargyt #{{ order.id }}</h1>
        <OrderStatus :order="order" />
      </div>

      <!-- progress: order -> receipt -> payment -->
      <ol v-if="order.status !== 'cancelled'" class="mb-8 flex text-center text-xs font-semibold sm:text-sm">
        <li v-for="(label, i) in steps" :key="label" class="relative flex-1">
          <span v-if="i > 0" class="absolute -left-1/2 top-4 h-1 w-full rounded-full" :class="step > i ? 'bg-cobalt' : 'bg-ink/10 dark:bg-white/10'" aria-hidden="true"></span>
          <span
            class="relative mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full font-display font-bold"
            :class="step > i ? 'bg-cobalt text-white' : 'bg-white text-ink/40 ring-1 ring-ink/10 dark:bg-night-2 dark:text-white/40 dark:ring-white/10'"
          >
            <Check v-if="step > i" :size="18" :stroke-width="3" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span :class="step > i ? '' : 'text-ink/50 dark:text-white/40'">{{ label }}</span>
        </li>
      </ol>

      <!-- waiting -->
      <div v-if="order.status === 'pending'" class="mb-6 flex items-start gap-3 rounded-[1.75rem] bg-sun/25 p-5 text-amber-900 dark:bg-sun/10 dark:text-sun">
        <Clock :size="20" class="mt-0.5 shrink-0" aria-hidden="true" />
        <p>Işgär sargydyňyzy barlaýar we ammary tassyklaýar. Çek çykanda bu sahypa özi täzelener.</p>
      </div>
      <div v-if="order.status === 'cancelled'" class="mb-6 rounded-[1.75rem] bg-ink/5 p-5 text-ink/70 dark:bg-white/10 dark:text-white/70">Bu sargyt ýatyryldy.</div>

      <!-- the receipt (çek): ticket with side notches -->
      <section class="mb-6 rounded-[2rem] bg-white p-6 ring-1 ring-ink/5 sm:p-8 dark:bg-night-2 dark:ring-white/10">
        <template v-if="order.check">
          <div class="font-mono">
            <div class="text-sm text-ink/50 dark:text-white/50">Çek</div>
            <div class="text-2xl font-bold">{{ order.check.receipt_number }}</div>
            <div class="mt-1 text-sm text-ink/60 dark:text-white/60">{{ fmtDate(order.check.issued_at) }}, işgär: {{ order.check.staff_name }}</div>
          </div>
          <div class="relative -mx-6 my-6 border-t-2 border-dashed border-ink/15 sm:-mx-8 dark:border-white/15" aria-hidden="true">
            <span class="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-paper dark:bg-night"></span>
            <span class="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-paper dark:bg-night"></span>
          </div>
        </template>

        <ul class="space-y-2 font-mono text-sm sm:text-base">
          <li v-for="item in order.items" :key="item.id" class="flex justify-between gap-4">
            <span>{{ item.title }} <span class="text-ink/50 dark:text-white/50">× {{ item.quantity }} ({{ item.unit_price.toFixed(2) }})</span></span>
            <span class="font-bold">{{ item.subtotal.toFixed(2) }}</span>
          </li>
        </ul>

        <div class="mt-5 flex items-baseline justify-between border-t-2 border-dashed border-ink/15 pt-5 dark:border-white/15">
          <span class="font-display text-lg font-semibold">Jemi</span>
          <span class="font-display text-4xl font-bold tracking-tight">{{ order.total_amount.toFixed(2) }} <span class="text-lg font-medium text-ink/50 dark:text-white/50">TMT</span></span>
        </div>
      </section>

      <!-- step 3: pay by card (only after the receipt) -->
      <form v-if="order.status === 'receipt_issued'" @submit.prevent="pay" class="rounded-[2rem] bg-white p-6 ring-1 ring-ink/5 sm:p-8 dark:bg-night-2 dark:ring-white/10">
        <h2 class="font-display text-2xl font-bold">Bank kart arkaly töleg</h2>

        <div class="relative mt-5 overflow-hidden rounded-3xl bg-cobalt p-6 text-white" aria-hidden="true">
          <span class="absolute -right-10 -top-6 flex h-16 w-44 rotate-[-30deg] overflow-hidden rounded-full opacity-90"><span class="w-1/2 bg-mint"></span><span class="w-1/2 bg-white"></span></span>
          <div class="relative mt-10 font-mono text-xl tracking-wider sm:text-2xl">{{ previewNumber }}</div>
          <div class="relative mt-6 flex items-end justify-between gap-4 font-mono text-sm">
            <span class="truncate uppercase">{{ card.card_holder || 'AD FAMILIÝA' }}</span>
            <span>{{ card.expiry || 'AA/ÝÝ' }}</span>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <label class="block text-sm font-semibold">Kart belgisi
            <input v-model="card.card_number" @input="formatCard" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" required :class="input" />
          </label>
          <label class="block text-sm font-semibold">Kart eýesi
            <input v-model="card.card_holder" autocomplete="cc-name" placeholder="AD FAMILIÝA" required :class="input" />
          </label>
          <div class="grid grid-cols-2 gap-4">
            <label class="block text-sm font-semibold">Möhleti (AA/ÝÝ)
              <input v-model="card.expiry" @input="formatExpiry" autocomplete="cc-exp" placeholder="MM/YY" required :class="input" />
            </label>
            <label class="block text-sm font-semibold">CVV
              <input v-model="card.cvv" type="password" inputmode="numeric" maxlength="4" autocomplete="cc-csc" required :class="input" />
            </label>
          </div>
        </div>

        <p v-if="payError" role="alert" class="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">{{ payError }}</p>
        <button :disabled="paying" class="mt-6 w-full rounded-full bg-cobalt py-4 font-bold text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
          {{ paying ? 'Işlenýär...' : `Töle ${order.total_amount.toFixed(2)} TMT` }}
        </button>
        <p class="mt-3 text-center text-xs text-ink/50 dark:text-white/40">Demo: kart maglumatlary diňe barlanýar, saklanmaýar.</p>
      </form>

      <div v-if="order.status === 'paid'" class="flex items-center gap-4 rounded-[2rem] bg-mint/30 p-6 text-emerald-900 dark:bg-mint/10 dark:text-mint">
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mint text-ink"><Check :size="24" :stroke-width="3" /></span>
        <p class="font-display text-xl font-semibold">Töleg üstünlikli geçdi. Sag boluň!</p>
      </div>

      <button v-if="['pending', 'receipt_issued'].includes(order.status)" @click="cancel" class="mt-6 rounded-full px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400">
        Sargydy ýatyr
      </button>
    </template>
  </main>
</template>
