<script setup>
import { ref, onMounted } from 'vue'
import { Moon, Sun } from '@lucide/vue'

const isDark = ref(false)

function apply(value) {
  isDark.value = value
  document.documentElement.classList.toggle('dark', value)
}

function toggle() {
  apply(!isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  apply(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)
})
</script>

<template>
  <button
    @click="toggle"
    :aria-label="isDark ? 'Açyk tema' : 'Gara tema'"
    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-ink/5 active:scale-90 dark:text-white dark:hover:bg-white/10"
  >
    <Sun v-if="isDark" :size="18" />
    <Moon v-else :size="18" />
  </button>
</template>
