import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { greedService } from '../services/greed.service'
import { useGreedStore } from '../stores/greed.store'
import { useSessionStore } from '../stores/session.store'
import { useToastStore } from '../stores/toast.store'
import { hasStatus } from '../utils/errors'

export function useSessionManager() {
  const greed = useGreedStore()
  const sessionStore = useSessionStore()
  const toast = useToastStore()
  const { state, characters } = storeToRefs(greed)
  const { sessions, activeSessionId } = storeToRefs(sessionStore)

  const selectedCharacterId = ref('isaac')
  const customName = ref('')
  const sessionIdInput = ref('')
  const connectInvalid = ref(false)
  const selectKey = ref(0)
  const isLoading = ref(false)
  const isCharactersLoading = ref(false)
  const charactersError = ref<string | null>(null)

  const hasSession = computed(() => state.value !== null)
  const selectedCharacter = computed(() => characters.value.find((c) => c.id === selectedCharacterId.value))

  watch(
    () => state.value?.character.id,
    (id) => {
      if (id) selectedCharacterId.value = id
    }
  )

  async function loadCharacters(): Promise<void> {
    isCharactersLoading.value = true
    charactersError.value = null
    try {
      greed.setCharacters(await greedService.getCharacters())
    } catch {
      charactersError.value = 'Не вдалося завантажити персонажів'
    } finally {
      isCharactersLoading.value = false
    }
  }

  async function createSession(): Promise<void> {
    if (isLoading.value) return
    isLoading.value = true
    try {
      const created = await greedService.createSession({
        character_id: selectedCharacterId.value,
        custom_name: customName.value.trim() || null
      })
      sessionStore.setActive(created.session_id)
      greed.setState(created)
      customName.value = ''
      toast.show('success', `Новий забіг: ${created.name}`)
    } catch {
      return
    } finally {
      isLoading.value = false
    }
  }

  async function changeCharacter(characterId: string): Promise<void> {
    if (isLoading.value) return
    isLoading.value = true
    try {
      greed.setState(await greedService.selectCharacter(characterId))
    } catch {
      return
    } finally {
      isLoading.value = false
    }
  }

  async function connect(id: string): Promise<boolean> {
    const target = id.trim()
    if (!target || isLoading.value) return false
    isLoading.value = true
    const previous = activeSessionId.value
    try {
      await greedService.verifySession(target)
      sessionStore.setActive(target)
      try {
        greed.setState(await greedService.getState())
      } catch (e) {
        sessionStore.setActive(previous)
        throw e
      }
      connectInvalid.value = false
      sessionIdInput.value = ''
      return true
    } catch (e) {
      connectInvalid.value = hasStatus(e, 404)
      selectKey.value++
      return false
    } finally {
      isLoading.value = false
    }
  }

  const connectFromInput = () => connect(sessionIdInput.value)

  function forget(id: string): void {
    const wasActive = activeSessionId.value === id
    sessionStore.remove(id)
    if (wasActive) greed.clearState()
  }

  async function restore(): Promise<void> {
    if (!activeSessionId.value) return
    try {
      greed.setState(await greedService.getState())
    } catch (e) {
      if (hasStatus(e, 404)) sessionStore.setActive(null)
    }
  }

  return {
    sessions, activeSessionId, characters, selectedCharacterId, selectedCharacter, hasSession,
    customName, sessionIdInput, connectInvalid, selectKey, isLoading,
    isCharactersLoading, charactersError,
    loadCharacters, createSession, changeCharacter, connect, connectFromInput, forget, restore
  }
}
