<script setup>
import { computed } from 'vue'
import { Pill, Plus } from '@lucide/vue'

const props = defineProps({ medicine: { type: Object, required: true } })
defineEmits(['open', 'add'])

// every card gets one of four soft tones, so the grid feels like a blister pack
const tones = [
  'bg-cobalt/10 text-cobalt dark:bg-cobalt/25 dark:text-blue-200',
  'bg-mint/30 text-emerald-800 dark:bg-mint/15 dark:text-mint',
  'bg-sun/35 text-amber-800 dark:bg-sun/15 dark:text-sun',
  'bg-blush/25 text-rose-700 dark:bg-blush/15 dark:text-blush',
]
const tone = computed(() => tones[Math.abs(Number(props.medicine.id) || 0) % tones.length])
const lowStock = computed(() => props.medicine.in_stock && props.medicine.stock_quantity <= 5)
</script>

<template>
  <article
    tabindex="0"
    role="button"
    :aria-label="medicine.title"
    class="group flex cursor-pointer flex-col rounded-[2rem] bg-white p-3 ring-1 ring-ink/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-cobalt/10 dark:bg-night-2 dark:ring-white/10 dark:hover:shadow-none"
    @click="$emit('open', medicine)"
    @keydown.enter.self="$emit('open', medicine)"
  >
    <!-- arch-shaped photo window -->
    <div class="relative flex h-44 items-center justify-center overflow-hidden rounded-t-[6rem] rounded-b-3xl" :class="tone">
      <img
        v-if="medicine.image_url"
        :src="medicine.image_url"
        :alt="medicine.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        :class="medicine.in_stock ? '' : 'opacity-40 grayscale'"
      />
      <Pill v-else :size="64" :stroke-width="1.5" class="-rotate-45 transition duration-300 group-hover:rotate-0" aria-hidden="true" />
      <span v-if="!medicine.in_stock" class="absolute bottom-3 rounded-full bg-ink px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-ink">Tükendi</span>
    </div>

    <div class="flex flex-1 flex-col px-3 pb-2 pt-4">
      <div class="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span v-if="medicine.category?.name" class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="tone">{{ medicine.category.name }}</span>
        <span class="text-xs text-ink/60 dark:text-white/50">{{ medicine.country }}</span>
      </div>

      <h3 class="line-clamp-2 min-h-[3rem] font-display text-xl font-semibold leading-tight">{{ medicine.title }}</h3>
      <p v-if="medicine.purpose" class="mt-1.5 line-clamp-2 text-sm text-ink/60 dark:text-white/55">{{ medicine.purpose }}</p>

      <p v-if="lowStock" class="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-sun">
        <span class="h-2 w-2 rounded-full bg-sun" aria-hidden="true"></span> Diňe {{ medicine.stock_quantity }} sany galdy
      </p>

      <div class="mt-auto flex items-center justify-between gap-2 pt-4">
        <div class="font-display">
          <span class="text-2xl font-bold">{{ medicine.price.toFixed(2) }}</span>
          <span class="ml-1 text-sm font-medium text-ink/50 dark:text-white/50">TMT</span>
        </div>
        <!-- stop: click on the button must not open the modal -->
        <button
          :disabled="!medicine.in_stock"
          @click.stop="$emit('add', medicine)"
          @keydown.enter.stop
          class="flex items-center gap-1.5 rounded-full bg-ink py-2.5 pl-3.5 pr-4 text-sm font-semibold text-white transition hover:bg-cobalt active:scale-95 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 dark:bg-white dark:text-ink dark:hover:bg-mint dark:disabled:bg-white/10 dark:disabled:text-white/30"
        >
          <Plus :size="16" :stroke-width="2.5" />
          {{ medicine.in_stock ? 'Sebede goş' : 'Tükendi' }}
        </button>
      </div>
    </div>
  </article>
</template>
