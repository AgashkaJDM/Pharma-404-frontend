<script setup>
defineProps({ order: { type: Object, required: true } })

const colors = {
  pending: 'bg-sun/30 text-amber-900 dark:bg-sun/15 dark:text-sun',
  receipt_issued: 'bg-cobalt/10 text-cobalt dark:bg-cobalt/25 dark:text-blue-200',
  paid: 'bg-mint/30 text-emerald-900 dark:bg-mint/15 dark:text-mint',
  cancelled: 'bg-ink/10 text-ink/60 dark:bg-white/10 dark:text-white/50',
}
const dots = {
  pending: 'bg-sun',
  receipt_issued: 'bg-cobalt',
  paid: 'bg-emerald-500',
  cancelled: 'bg-ink/30',
}
</script>

<template>
  <span class="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold" :class="colors[order.status]">
    <span class="h-2 w-2 rounded-full" :class="[dots[order.status], order.status === 'pending' ? 'animate-pulse' : '']" aria-hidden="true"></span>
    {{ order.status_label }}
  </span>
</template>
