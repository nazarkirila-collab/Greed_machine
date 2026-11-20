import axios from 'axios'
import { apiClient } from './client'
import { useSessionStore } from '../stores/session.store'
import { useToastStore, type ToastType } from '../stores/toast.store'

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Некоректний запит',
  404: 'Сесію не знайдено',
  409: 'Автомат заклинило!',
  422: 'Некоректні дані запиту',
  429: 'Занадто багато запитів, зачекайте'
}

function getMessage(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null
  const { detail, message } = data as { detail?: unknown; message?: unknown }

  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const text = detail
      .map((item) => (item as { msg?: unknown }).msg)
      .filter((msg): msg is string => typeof msg === 'string')
      .join('; ')
    if (text) return text
  }
  return typeof message === 'string' ? message : null
}

function getToastType(status: number): ToastType {
  return [404, 409, 429].includes(status) ? 'warning' : 'error'
}

export function setupInterceptors(): void {
  apiClient.interceptors.request.use((config) => {
    const session = useSessionStore()
    if (session.activeSessionId) {
      config.headers['X-Session-ID'] = session.activeSessionId
    }
    return config
  })

  apiClient.interceptors.response.use(
    (response) => {
      const message = getMessage(response.data)
      if (message) {
        const failed = (response.data as { success?: unknown }).success === false
        useToastStore().show(failed ? 'warning' : 'success', message)
      }
      return response
    },
    (error: unknown) => {
      const toast = useToastStore()

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response
          toast.show(getToastType(status), getMessage(data) ?? DEFAULT_MESSAGES[status] ?? `Помилка сервера (${status})`)
        } else if (error.code === 'ECONNABORTED') {
          toast.show('error', 'Сервер не відповів вчасно')
        } else {
          toast.show('error', "Немає зв'язку із сервером")
        }
      }

      return Promise.reject(error)
    }
  )
}
