<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Pill, Plus, ShieldCheck, X } from '@lucide/vue'

const props = defineProps({ medicine: { type: Object, required: true } })
const emit = defineEmits(['close', 'add'])

const onKey = (e) => e.key === 'Escape' && emit('close')
onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.classList.add('overflow-hidden')
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <Teleport to="body">
    <Transition
      appear
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 [&>div]:translate-y-8 sm:[&>div]:scale-95"
    >
      <div
        class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4"
        @click.self="emit('close')"
      >
        <div
          role="dialog"
          aria-modal="true"
          :aria-label="medicine.title"
          class="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] bg-white p-5 text-ink shadow-2xl transition duration-200 ease-out sm:rounded-[2rem] sm:p-6 dark:bg-night-2 dark:text-white"
        >
          <div class="grid gap-6 sm:grid-cols-5">
            <div class="flex h-56 items-center justify-center overflow-hidden rounded-t-[8rem] rounded-b-3xl bg-cobalt/10 text-cobalt sm:col-span-2 sm:h-auto sm:min-h-72 dark:bg-cobalt/25 dark:text-blue-200">
              <img v-if="medicine.image_url" :src="medicine.image_url" :alt="medicine.title" class="h-full w-full object-cover" />
              <Pill v-else :size="88" :stroke-width="1.25" class="-rotate-45" aria-hidden="true" />
            </div>

            <div class="flex flex-col sm:col-span-3">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <span v-if="medicine.category?.name" class="rounded-full bg-cobalt/10 px-3 py-1 text-xs font-semibold text-cobalt dark:bg-cobalt/25 dark:text-blue-200">{{ medicine.category.name }}</span>
                  <h2 class="mt-2 font-display text-3xl font-bold leading-tight">{{ medicine.title }}</h2>
                </div>
                <button aria-label="Ýapmak" @click="emit('close')" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 transition hover:bg-ink/10 active:scale-90 dark:bg-white/10 dark:hover:bg-white/20">
                  <X :size="18" />
                </button>
              </div>

              <div class="mt-5 space-y-4">
                <div>
                  <h3 class="text-sm font-semibold text-ink/50 dark:text-white/50">Näme üçin ulanylýar</h3>
                  <p class="mt-1">{{ medicine.purpose || 'Maglumat girizilmedi.' }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-ink/50 dark:text-white/50">Nähili kömek edýär</h3>
                  <p class="mt-1">{{ medicine.description || 'Maglumat girizilmedi.' }}</p>
                </div>
                <dl class="grid grid-cols-2 gap-3 text-sm">
                  <div class="rounded-2xl bg-paper p-3 dark:bg-night">
                    <dt class="text-ink/50 dark:text-white/50">Öndürilen ýurdy</dt>
                    <dd class="font-semibold">{{ medicine.country }}</dd>
                  </div>
                  <div class="rounded-2xl bg-paper p-3 dark:bg-night">
                    <dt class="text-ink/50 dark:text-white/50">Ammarda</dt>
                    <dd class="font-semibold" :class="medicine.in_stock ? '' : 'text-red-600 dark:text-red-400'">
                      {{ medicine.in_stock ? medicine.stock_quantity + ' sany' : 'Tükendi' }}
                    </dd>
                  </div>
                </dl>
              </div>

              <p class="mt-5 flex gap-3 rounded-2xl bg-sun/25 p-3 text-xs text-amber-900 dark:bg-sun/10 dark:text-sun">
                <ShieldCheck :size="18" class="mt-0.5 shrink-0" aria-hidden="true" />
                Bu maglumat gysgaça tanyşlyk üçindir. Ulanmazdan öň görkezmäni okaň we lukman ýa-da derman satyjy bilen maslahatlaşyň.
              </p>

              <div class="mt-auto flex items-center justify-between gap-3 pt-5">
                <div class="font-display text-3xl font-bold">{{ medicine.price.toFixed(2) }} <span class="text-base font-medium text-ink/50 dark:text-white/50">TMT</span></div>
                <button
                  :disabled="!medicine.in_stock"
                  @click="emit('add', medicine)"
                  class="flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 dark:disabled:bg-white/10 dark:disabled:text-white/30"
                >
                  <Plus :size="18" :stroke-width="2.5" />
                  {{ medicine.in_stock ? 'Sebede goş' : 'Tükendi' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
