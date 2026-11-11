<script setup>
defineProps({ title: { type: String, required: true } })

// the real order flow, so the sign-up page also explains how the shop works
const steps = ['Dermanlary saýlap, sargyt beriň', 'Işgär ammary barlap, çek çykarýar', 'Çek çykandan soň kart bilen töleýärsiňiz']
</script>

<template>
  <main class="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-6 px-4 py-8 lg:grid-cols-2">
    <!-- brand panel -->
    <section class="relative hidden h-full min-h-[34rem] flex-col justify-between overflow-hidden rounded-[2.5rem] bg-cobalt p-10 text-white lg:flex">
      <div class="pointer-events-none absolute -right-16 top-10 flex h-24 w-64 rotate-[-35deg] overflow-hidden rounded-full" aria-hidden="true">
        <span class="w-1/2 bg-mint"></span><span class="w-1/2 bg-white"></span>
      </div>
      <div class="pointer-events-none absolute -bottom-6 -right-10 flex h-24 w-64 rotate-[25deg] overflow-hidden rounded-full" aria-hidden="true">
        <span class="w-1/2 bg-sun"></span><span class="w-1/2 bg-ink"></span>
      </div>

      <div class="font-display text-3xl font-bold tracking-tight">Pharma 404</div>

      <div class="relative">
        <h2 class="max-w-xs font-display text-4xl font-bold leading-tight">Derman sargydy, üç ädimde.</h2>
        <ol class="mt-8 max-w-xs space-y-4">
          <li v-for="(s, i) in steps" :key="s" class="flex items-start gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-display font-bold text-cobalt">{{ i + 1 }}</span>
            <span class="pt-1 text-white/90">{{ s }}</span>
          </li>
        </ol>
      </div>
    </section>

    <section class="mx-auto w-full max-w-md">
      <h1 class="font-display text-4xl font-bold tracking-tight">{{ title }}</h1>
      <div class="mt-8">
        <slot />
      </div>
    </section>
  </main>
</template>
