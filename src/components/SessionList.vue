<script setup lang="ts">
import { useSessionManager } from '../composables/useSessionManager'

const { sessions, activeSessionId, connect, forget } = useSessionManager()
</script>

<template>
  <section class="space-y-3 rounded-box bg-base-100 p-4">
    <h2 class="text-lg font-semibold">Збережені сесії</h2>

    <p v-if="!sessions.length" class="text-sm text-base-content/60">
      Тут з'являться ваші забіги. Натисніть на сесію, щоб відновити її.
    </p>

    <ul v-else class="list">
      <li v-for="s in sessions" :key="s.id" class="list-row items-center" :class="{ 'bg-primary/10': s.id === activeSessionId }">
        <button type="button" class="list-col-grow text-left" @click="connect(s.id)">
          <div class="font-semibold">{{ s.name }}</div>
          <div class="text-xs text-base-content/60">{{ s.characterName }} · {{ s.id }}</div>
        </button>
        <span v-if="s.id === activeSessionId" class="badge badge-primary badge-sm">активна</span>
        <button
          type="button"
          class="btn btn-ghost btn-xs"
          aria-label="Прибрати зі списку"
          title="Прибрати зі списку (сесія на сервері залишиться)"
          @click="forget(s.id)"
        >
          ✕
        </button>
      </li>
    </ul>
  </section>
</template>
