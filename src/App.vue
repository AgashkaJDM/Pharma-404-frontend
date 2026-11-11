<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import { useCartStore } from '@/stores/cartStore'
import { installAuthGuard } from '@/stores/authStore'

const router = useRouter()
installAuthGuard(router)
onMounted(() => useCartStore().load())
</script>

<template>
  <div class="min-h-screen bg-paper font-sans text-ink antialiased transition-colors dark:bg-night dark:text-white">
    <Navbar />
    <router-view />
    <footer class="mx-auto max-w-7xl px-4 pb-10 pt-4 text-center text-sm text-ink/50 dark:text-white/40">
      Pharma 404 dermanhanasy. Ulanmazdan öň lukman ýa-da derman satyjy bilen maslahatlaşyň.
    </footer>
  </div>
</template>
