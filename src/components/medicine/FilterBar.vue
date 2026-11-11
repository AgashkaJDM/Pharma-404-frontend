<script setup>
import { computed, watch } from 'vue'
import { Search, X } from '@lucide/vue'
import { useMedicineStore } from '@/stores/medicineStore'

const store = useMedicineStore()
const emit = defineEmits(['change'])

// Typing in the search box waits 400 ms, so we do not send a request on every letter
let timer
watch(
  () => store.filters.search,
  () => {
    clearTimeout(timer)
    timer = setTimeout(() => emit('change'), 400)
  },
)

function searchNow() {
  clearTimeout(timer)
  emit('change')
}

function pickCategory(id) {
  store.filters.category_id = id
  emit('change')
}

const hasFilters = computed(() => Object.values(store.filters).some((v) => v !== '' && v !== null))

const pill = 'flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-2 text-sm ring-1 ring-ink/10 transition focus-within:ring-2 focus-within:ring-cobalt dark:bg-night-2 dark:ring-white/10'
const field = 'bg-white font-semibold outline-none dark:bg-night-2'
</script>

<template>
  <div class="space-y-4">
    <!-- the search capsule: left half is the field, right half is the button -->
    <form
      @submit.prevent="searchNow"
      class="flex items-center rounded-full bg-white p-2 pl-6 shadow-xl shadow-cobalt/10 ring-1 ring-ink/5 transition focus-within:ring-2 focus-within:ring-cobalt dark:bg-night-2 dark:shadow-none dark:ring-white/10"
    >
      <Search :size="22" class="shrink-0 text-ink/40 dark:text-white/40" aria-hidden="true" />
      <input
        v-model="store.filters.search"
        type="search"
        aria-label="Dermanyň ady"
        placeholder="Dermanyň adyny ýazyň"
        class="min-w-0 flex-1 bg-transparent px-4 py-3 text-lg outline-none placeholder:text-ink/40 dark:placeholder:text-white/40"
      />
      <button class="rounded-full bg-cobalt px-7 py-3.5 font-semibold text-white transition hover:brightness-110 active:scale-95">
        Gözle
      </button>
    </form>

    <!-- categories -->
    <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label="Kategoriýalar">
      <button
        @click="pickCategory('')"
        :aria-pressed="store.filters.category_id === ''"
        class="shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition active:scale-95"
        :class="store.filters.category_id === '' ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-white ring-1 ring-ink/10 hover:bg-ink/5 dark:bg-night-2 dark:ring-white/10 dark:hover:bg-white/10'"
      >Hemmesi</button>
      <button
        v-for="c in store.categories"
        :key="c.id"
        @click="pickCategory(c.id)"
        :aria-pressed="store.filters.category_id === c.id"
        class="shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition active:scale-95"
        :class="store.filters.category_id === c.id ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-white ring-1 ring-ink/10 hover:bg-ink/5 dark:bg-night-2 dark:ring-white/10 dark:hover:bg-white/10'"
      >{{ c.name }}</button>
    </div>

    <!-- country + price -->
    <div class="flex flex-wrap items-center gap-2">
      <label :class="pill">
        <span class="text-ink/60 dark:text-white/50">Öndürilen ýurdy</span>
        <select v-model="store.filters.country" @change="emit('change')" :class="field + ' rounded-full py-1 pr-1'">
          <option value="">Hemmesi</option>
          <option v-for="c in store.countries" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <div :class="pill + ' pr-4'">
        <span class="text-ink/60 dark:text-white/50">Baha (TMT)</span>
        <input v-model="store.filters.min_price" @change="emit('change')" type="number" min="0" placeholder="Min" aria-label="Iň pes baha" class="w-16 bg-transparent font-semibold outline-none placeholder:font-normal" />
        <span aria-hidden="true">–</span>
        <input v-model="store.filters.max_price" @change="emit('change')" type="number" min="0" placeholder="Max" aria-label="Iň ýokary baha" class="w-16 bg-transparent font-semibold outline-none placeholder:font-normal" />
      </div>

      <button
        v-if="hasFilters"
        @click="store.resetFilters()"
        class="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-cobalt transition hover:bg-cobalt/10 dark:text-blue-300"
      >
        <X :size="16" /> Arassala
      </button>
    </div>
  </div>
</template>
