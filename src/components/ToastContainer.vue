<script setup lang="ts">
import { useToastStore, type ToastType } from '../stores/toast.store'

const toastStore = useToastStore()

const ALERT_CLASS: Record<ToastType, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error'
}
</script>

<template>
  <TransitionGroup
    tag="div"
    class="toast toast-top toast-end z-50"
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-x-8"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 translate-x-8"
    move-class="transition duration-300"
  >
    <div v-for="t in toastStore.toasts" :key="t.id" role="alert" class="alert max-w-xs" :class="ALERT_CLASS[t.type]">
      <span>{{ t.message }}</span>
      <button class="btn btn-ghost btn-xs" aria-label="Закрити" @click="toastStore.dismiss(t.id)">✕</button>
    </div>
  </TransitionGroup>
</template>
