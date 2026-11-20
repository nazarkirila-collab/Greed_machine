<script setup lang="ts">
import GreedMachine from './GreedMachine.vue'
import { useGreedMachine } from '../composables/useGreedMachine'

const {
  state, hasSession, isLoading, isShaking, isJammed, jamChance, wallet, bombs,
  hundreds, tens, units, canDonate, canAct, resetMachine,
  donate, bomb, resetRun
} = useGreedMachine()
</script>

<template>
  <section class="flex flex-col items-center gap-5">
    <GreedMachine :class="{ 'animate-shake': isShaking }">
      <span class="countdown" aria-live="polite" :aria-label="String(hundreds)">
        <span :style="{ '--value': hundreds, '--digits': 1 }">{{ hundreds }}</span>
      </span>
      <span class="countdown" aria-live="polite" :aria-label="String(tens)">
        <span :style="{ '--value': tens, '--digits': 1 }">{{ tens }}</span>
      </span>
      <span class="countdown" aria-live="polite" :aria-label="String(units)">
        <span :style="{ '--value': units, '--digits': 1 }">{{ units }}</span>
      </span>
    </GreedMachine>

    <div v-if="!hasSession" role="alert" class="alert alert-info max-w-sm">
      <span>Створіть новий забіг або підключіться до існуючої сесії.</span>
    </div>

    <template v-else>
      <div v-if="isJammed" role="alert" class="alert alert-error max-w-sm">
        <span>Автомат заклинило! Підірвіть його бомбою або скиньте спробу.</span>
      </div>

      <div class="stats stats-vertical w-full max-w-sm border border-base-300 bg-base-100 sm:stats-horizontal">
        <div class="stat px-4 py-3">
          <div class="stat-title">Монети</div>
          <div class="stat-value text-2xl text-warning">{{ wallet }}</div>
        </div>
        <div class="stat px-4 py-3">
          <div class="stat-title">Бомби</div>
          <div class="stat-value text-2xl">{{ bombs }}</div>
        </div>
      </div>

      <div class="w-full max-w-sm space-y-1">
        <div class="flex justify-between text-sm">
          <span>Jam Chance: {{ jamChance.toFixed(2) }}%</span>
          <span v-if="isJammed" class="badge badge-error badge-sm">ЗАКЛИНИЛО</span>
        </div>
        <progress
          class="progress w-full"
          :class="isJammed ? 'progress-error' : 'progress-warning'"
          :value="jamChance"
          max="100"
        ></progress>
      </div>

      <div class="flex w-full max-w-sm flex-wrap justify-center gap-2">
        <button class="btn btn-primary" :disabled="!canDonate" @click="donate">
          <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
          Кинути монету
        </button>
        <button class="btn btn-warning" :disabled="!canAct" @click="bomb">Підірвати бомбою</button>
        <button class="btn btn-outline" :disabled="!canAct" @click="resetRun">Скинути спробу</button>
      </div>

      <label class="label cursor-pointer gap-2 text-sm">
        <input v-model="resetMachine" type="checkbox" class="checkbox checkbox-sm" />
        Скидати також лічильник автомата
      </label>

      <p class="text-xs text-base-content/60">Сесія: {{ state?.name }} · {{ state?.session_id }}</p>
    </template>
  </section>
</template>
