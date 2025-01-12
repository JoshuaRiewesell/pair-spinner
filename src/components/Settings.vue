<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { usePersonsStore } from '@/stores/persons'
import { useSetsStore } from '@/stores/sets'

const personsStore = usePersonsStore()
const setsStore = useSetsStore()

function clearAll() {
  personsStore.removeAllPersons()
  setsStore.removeAllSets()
}
</script>
<template>
  <div class="column">
    <h1>Zweierschaften</h1>
    <button @click="clearAll()">Reset</button>
  </div>
</template>
