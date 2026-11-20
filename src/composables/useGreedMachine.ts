import { computed, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { greedService } from '../services/greed.service'
import { useGreedStore } from '../stores/greed.store'
import { useToastStore } from '../stores/toast.store'
import { hasStatus } from '../utils/errors'
import { runPayload } from '../utils/payload'

export function useGreedMachine() {
  const greed = useGreedStore()
  const toast = useToastStore()
  const { state } = storeToRefs(greed)

  const isLoading = ref(false)
  const isShaking = ref(false)
  const resetMachine = ref(false)
  let shakeTimer: ReturnType<typeof setTimeout> | undefined

  const hasSession = computed(() => state.value !== null)
  const isJammed = computed(() => state.value?.is_jammed ?? false)
  const jamChance = computed(() => state.value?.jam_chance ?? 0)
  const wallet = computed(() => state.value?.wallet ?? 0)
  const bombs = computed(() => state.value?.bombs ?? 0)

  const coins = computed(() => state.value?.coins_in_machine ?? 0)
  const hundreds = computed(() => Math.floor(coins.value / 100) % 10)
  const tens = computed(() => Math.floor(coins.value / 10) % 10)
  const units = computed(() => coins.value % 10)

  const canDonate = computed(() => hasSession.value && !isJammed.value && !isLoading.value)
  const canAct = computed(() => hasSession.value && !isLoading.value)

  async function run(action: () => Promise<void>): Promise<void> {
    if (isLoading.value) return
    isLoading.value = true
    try {
      await action()
    } catch {
      return
    } finally {
      isLoading.value = false
    }
  }

  const donate = () =>
    run(async () => {
      try {
        const res = await greedService.donate()
        greed.patchState({
          wallet: res.wallet,
          coins_in_machine: res.coins_in_machine,
          jam_chance: res.jam_chance,
          is_jammed: res.is_jammed
        })
        if (res.payload) {
          try {
            runPayload(res.payload)
          } catch (e) {
            toast.show('error', `Не вдалося виконати пейлоад: ${e instanceof Error ? e.message : e}`)
          }
        }
      } catch (e) {
        if (!hasStatus(e, 409)) throw e
        greed.setState(await greedService.getState())
      }
    })

  const bomb = () =>
    run(async () => {
      const res = await greedService.bomb()
      greed.patchState({
        wallet: res.wallet,
        coins_in_machine: res.coins_in_machine,
        bombs: res.bombs,
        is_jammed: res.is_jammed,
        is_exploded: res.is_exploded
      })
    })

  const resetRun = () =>
    run(async () => {
      greed.setState(
        await greedService.reset({
          character_id: state.value?.character.id,
          reset_machine: resetMachine.value
        })
      )
    })

  watch(isJammed, (jammed) => {
    if (!jammed) return
    isShaking.value = true
    clearTimeout(shakeTimer)
    shakeTimer = setTimeout(() => (isShaking.value = false), 600)
  })

  onUnmounted(() => clearTimeout(shakeTimer))

  return {
    state, hasSession, isLoading, isShaking, isJammed, jamChance, wallet, bombs,
    hundreds, tens, units, canDonate, canAct, resetMachine,
    donate, bomb, resetRun
  }
}
