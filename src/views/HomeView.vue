<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMedicineStore } from '@/stores/medicineStore'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import MedicineCard from '@/components/medicine/MedicineCard.vue'
import MedicineModal from '@/components/medicine/MedicineModal.vue'
import FilterBar from '@/components/medicine/FilterBar.vue'
import { ArrowLeft, ArrowRight, Check, Pill } from '@lucide/vue'

const store = useMedicineStore()
const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const route = useRoute()

const selected = ref(null) // medicine opened in the modal
const toast = ref('')
let toastTimer

function showToast(text) {
  toast.value = text
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2200)
}

function addToCart(medicine) {
  // Guest cannot add to the cart -> login page (and come back after login)
  if (!auth.isAuth) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (cart.add(medicine)) showToast(`«${medicine.title}» sebede goşuldy`)
  else showToast('Ammarda ýeterlik derman ýok')
}

function addFromModal(medicine) {
  addToCart(medicine)
  if (auth.isAuth) selected.value = null
}

// decoration for the hero: four capsules, two-tone like the real thing
const capsules = [
  { pos: 'right-4 top-2 -rotate-[28deg]', a: 'bg-cobalt', b: 'bg-white' },
  { pos: 'right-44 top-24 rotate-[18deg]', a: 'bg-mint', b: 'bg-white' },
  { pos: 'right-2 top-40 rotate-[52deg]', a: 'bg-sun', b: 'bg-cobalt' },
  { pos: 'right-52 -top-2 rotate-[70deg]', a: 'bg-blush', b: 'bg-white' },
]

onMounted(() => {
  store.loadFilterOptions()
  store.fetch(1)
})
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 pb-12">
    <!-- hero -->
    <section class="relative pb-8 pt-12 sm:pt-16">
      <div class="pointer-events-none absolute inset-x-0 top-0 hidden h-72 lg:block" aria-hidden="true">
        <span
          v-for="(c, i) in capsules"
          :key="i"
          class="absolute flex h-20 w-52 overflow-hidden rounded-full shadow-xl shadow-ink/10 dark:shadow-none"
          :class="c.pos"
        >
          <span class="w-1/2" :class="c.a"></span>
          <span class="w-1/2" :class="c.b"></span>
        </span>
      </div>

      <div class="relative max-w-2xl">
        <h1 class="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">Derman gözleýärsiňiz?</h1>
        <p class="mt-5 max-w-md text-lg text-ink/70 dark:text-white/60">
          Dermanyň üstüne basyň: näme üçin ulanylýandygyny we nähili kömek edýändigini görüň.
        </p>
      </div>

      <div class="relative mt-10">
        <FilterBar @change="store.fetch(1)" />
      </div>
    </section>

    <!-- results -->
    <section aria-live="polite">
      <p v-if="!store.loading && !store.error && store.items.length" class="mb-4 text-sm font-semibold text-ink/60 dark:text-white/50">
        {{ store.meta.total }} derman tapyldy
      </p>

      <div v-if="store.loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="n in 8" :key="n" class="h-[26rem] animate-pulse rounded-[2rem] bg-white/70 dark:bg-night-2"></div>
      </div>

      <div v-else-if="store.error" class="rounded-[2rem] bg-white p-10 text-center dark:bg-night-2">
        <p class="font-display text-2xl font-semibold">Katalog ýüklenmedi</p>
        <p class="mt-2 text-ink/60 dark:text-white/60">{{ store.error }}</p>
        <button @click="store.fetch(1)" class="mt-5 rounded-full bg-cobalt px-6 py-3 font-semibold text-white transition hover:brightness-110 active:scale-95">Täzeden synanyş</button>
      </div>

      <div v-else-if="store.items.length === 0" class="relative overflow-hidden rounded-[2rem] bg-white px-6 py-16 text-center dark:bg-night-2">
        <span class="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[12rem] font-bold leading-none text-ink/5 dark:text-white/5" aria-hidden="true">404</span>
        <div class="relative">
          <Pill :size="40" class="mx-auto -rotate-45 text-cobalt" aria-hidden="true" />
          <p class="mt-4 font-display text-3xl font-semibold">Derman tapylmady</p>
          <p class="mx-auto mt-2 max-w-sm text-ink/60 dark:text-white/60">Başga at ýazyp görüň ýa-da süzgüçleri arassalaň.</p>
          <button @click="store.resetFilters()" class="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-white transition hover:bg-cobalt active:scale-95 dark:bg-white dark:text-ink">Süzgüçleri arassala</button>
        </div>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <MedicineCard
          v-for="m in store.items"
          :key="m.id"
          :medicine="m"
          @open="selected = $event"
          @add="addToCart"
        />
      </div>

      <!-- pagination -->
      <nav v-if="store.meta.last_page > 1" class="mt-10 flex items-center justify-center gap-2" aria-label="Sahypalar">
        <button
          :disabled="store.meta.current_page <= 1"
          @click="store.fetch(store.meta.current_page - 1)"
          aria-label="Öňki sahypa"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-ink/10 transition hover:bg-ink hover:text-white active:scale-90 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-inherit dark:bg-night-2 dark:ring-white/10"
        ><ArrowLeft :size="18" /></button>
        <span class="min-w-20 text-center font-display text-lg font-semibold">{{ store.meta.current_page }} / {{ store.meta.last_page }}</span>
        <button
          :disabled="store.meta.current_page >= store.meta.last_page"
          @click="store.fetch(store.meta.current_page + 1)"
          aria-label="Indiki sahypa"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-ink/10 transition hover:bg-ink hover:text-white active:scale-90 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-inherit dark:bg-night-2 dark:ring-white/10"
        ><ArrowRight :size="18" /></button>
      </nav>
    </section>

    <MedicineModal v-if="selected" :medicine="selected" @close="selected = null" @add="addFromModal" />

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="toast" role="status" class="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink py-2.5 pl-2.5 pr-6 text-sm font-semibold text-white shadow-2xl dark:bg-white dark:text-ink">
        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-mint text-ink"><Check :size="16" :stroke-width="3" /></span>
        {{ toast }}
      </div>
    </Transition>
  </main>
</template>
