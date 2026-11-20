import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useSessionStore } from './session.store'
import type { Character, GreedState } from '../types/greed'

export const useGreedStore = defineStore('greed', () => {
  const _state = ref<GreedState | null>(null)
  const _characters = ref<Character[]>([])

  const state = computed(() => _state.value)
  const characters = computed(() => _characters.value)

  function setState(next: GreedState) {
    _state.value = next
    useSessionStore().upsert({
      id: next.session_id,
      name: next.name,
      characterId: next.character.id,
      characterName: next.character.name
    })
  }

  function patchState(patch: Partial<GreedState>) {
    if (_state.value) _state.value = { ..._state.value, ...patch }
  }

  function clearState() {
    _state.value = null
  }

  function setCharacters(list: Character[]) {
    _characters.value = list
  }

  return { state, characters, setState, patchState, clearState, setCharacters }
})
