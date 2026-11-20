import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

const MAX_TOASTS = 3

export const useToastStore = defineStore('toast', () => {
  const _toasts = ref<Toast[]>([])
  let nextId = 1

  const toasts = computed(() => _toasts.value)

  function dismiss(id: number) {
    _toasts.value = _toasts.value.filter((t) => t.id !== id)
  }

  function show(type: ToastType, message: string, timeout = 4000) {
    const id = nextId++
    _toasts.value.push({ id, type, message })
    if (_toasts.value.length > MAX_TOASTS) {
      _toasts.value.shift()
    }
    setTimeout(() => dismiss(id), timeout)
  }

  return { toasts, show, dismiss }
})
