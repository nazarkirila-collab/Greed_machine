import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { SavedSession } from '../types/greed'

const SESSIONS_KEY = 'greed_sessions'
const ACTIVE_KEY = 'greed_active_session'

function loadSessions(): SavedSession[] {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export const useSessionStore = defineStore('session', () => {
  const _sessions = ref<SavedSession[]>(loadSessions())
  const _activeSessionId = ref<string | null>(localStorage.getItem(ACTIVE_KEY))

  watch(_sessions, (value) => localStorage.setItem(SESSIONS_KEY, JSON.stringify(value)), { deep: true })
  watch(_activeSessionId, (value) => {
    if (value) localStorage.setItem(ACTIVE_KEY, value)
    else localStorage.removeItem(ACTIVE_KEY)
  })

  const sessions = computed(() => _sessions.value)
  const activeSessionId = computed(() => _activeSessionId.value)

  function setActive(id: string | null) {
    _activeSessionId.value = id
  }

  function upsert(session: SavedSession) {
    const index = _sessions.value.findIndex((s) => s.id === session.id)
    if (index === -1) _sessions.value.unshift(session)
    else _sessions.value[index] = session
  }

  function remove(id: string) {
    _sessions.value = _sessions.value.filter((s) => s.id !== id)
    if (_activeSessionId.value === id) _activeSessionId.value = null
  }

  return { sessions, activeSessionId, setActive, upsert, remove }
})
