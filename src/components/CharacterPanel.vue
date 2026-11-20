<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAvatarUrl } from '../utils/avatar'
import { useSessionManager } from '../composables/useSessionManager'

const {
  sessions, activeSessionId, characters, selectedCharacterId, selectedCharacter, hasSession,
  customName, sessionIdInput, connectInvalid, selectKey, isLoading,
  isCharactersLoading, charactersError,
  loadCharacters, createSession, changeCharacter, connect, connectFromInput
} = useSessionManager()

const brokenAvatars = ref<string[]>([])

onMounted(loadCharacters)
</script>

<template>
  <section class="space-y-4 rounded-box bg-base-100 p-4">
    <h2 class="text-lg font-semibold">Персонаж</h2>

    <div v-if="isCharactersLoading" class="flex justify-center py-4">
      <span class="loading loading-dots"></span>
    </div>

    <div v-else-if="charactersError" role="alert" class="alert alert-error">
      <span>{{ charactersError }}</span>
      <button class="btn btn-sm" @click="loadCharacters">Повторити</button>
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <button
        v-for="c in characters"
        :key="c.id"
        type="button"
        class="avatar avatar-placeholder rounded-box p-1 ring-2 transition"
        :class="c.id === selectedCharacterId ? 'ring-primary' : 'ring-transparent hover:ring-base-300'"
        :title="c.name"
        @click="selectedCharacterId = c.id"
      >
        <div class="w-12 rounded-box bg-neutral text-neutral-content">
          <img
            v-if="!brokenAvatars.includes(c.id)"
            :src="getAvatarUrl(c.avatar_url)"
            :alt="c.name"
            class="[image-rendering:pixelated]"
            @error="brokenAvatars.push(c.id)"
          />
          <span v-else class="text-xl">{{ c.name.charAt(0) }}</span>
        </div>
      </button>
    </div>

    <div v-if="selectedCharacter" class="space-y-2">
      <p class="font-semibold">{{ selectedCharacter.name }}</p>
      <p class="text-sm text-base-content/70">{{ selectedCharacter.description }}</p>
      <ul class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <li>Монети: <b>{{ selectedCharacter.starting_coins }}</b></li>
        <li>Бомби: <b>{{ selectedCharacter.starting_bombs }}</b></li>
        <li>Удача: <b>{{ selectedCharacter.luck }}</b></li>
        <li>Клин/монета: <b>{{ selectedCharacter.jam_rate }}</b></li>
        <li class="col-span-2">Шанс сюрпризу: <b>{{ Math.round(selectedCharacter.surprise_chance * 100) }}%</b></li>
      </ul>
    </div>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Назва забігу (необов'язково)</legend>
      <input v-model="customName" class="input w-full" placeholder="Мій забіг" />
    </fieldset>

    <div class="flex flex-wrap gap-2">
      <button class="btn btn-primary" :disabled="isLoading" @click="createSession">Новий забіг</button>
      <button
        class="btn btn-outline"
        :disabled="!hasSession || isLoading || !selectedCharacterId"
        @click="changeCharacter(selectedCharacterId)"
      >
        Змінити героя
      </button>
    </div>

    <div class="divider my-1"></div>

    <h2 class="text-lg font-semibold">Сесія</h2>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Збережені сесії</legend>
      <select
        :key="selectKey"
        class="select w-full"
        :value="activeSessionId ?? ''"
        :disabled="!sessions.length || isLoading"
        @change="connect(($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled>{{ sessions.length ? 'Оберіть сесію' : 'Немає збережених сесій' }}</option>
        <option v-for="s in sessions" :key="s.id" :value="s.id">{{ s.name }} · {{ s.characterName }}</option>
      </select>
    </fieldset>

    <form class="fieldset" @submit.prevent="connectFromInput">
      <legend class="fieldset-legend">Підключитись за session_id</legend>
      <div class="join w-full">
        <input
          v-model="sessionIdInput"
          class="input join-item w-full"
          :class="{ 'input-error': connectInvalid }"
          placeholder="greed_a8f3b2c1d9e4"
          @input="connectInvalid = false"
        />
        <button type="submit" class="btn btn-secondary join-item" :disabled="isLoading || !sessionIdInput.trim()">
          Підключити
        </button>
      </div>
      <p v-if="connectInvalid" class="label text-warning">Невалідний session ID — такої сесії не існує.</p>
    </form>
  </section>
</template>
