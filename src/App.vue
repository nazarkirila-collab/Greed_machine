<script setup lang="ts">
import { onMounted } from 'vue'
import CharacterPanel from './components/CharacterPanel.vue'
import MachinePanel from './components/MachinePanel.vue'
import SessionList from './components/SessionList.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useSessionManager } from './composables/useSessionManager'

const { restore } = useSessionManager()

onMounted(restore)
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <header class="navbar bg-base-100 px-4 shadow-sm">
      <h1 class="text-xl font-bold">The Greed Machine</h1>
    </header>

    <main class="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[320px_1fr_300px]">
      <div class="order-2 lg:order-1"><CharacterPanel /></div>
      <div class="order-1 lg:order-2"><MachinePanel /></div>
      <div class="order-3"><SessionList /></div>
    </main>

    <ToastContainer />
  </div>
</template>
