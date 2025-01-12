<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { usePersonsStore } from '@/stores/persons'
import { useSetsStore } from '@/stores/sets'
import { useViewStore } from '@/stores/view'

const personsStore = usePersonsStore()
const setsStore = useSetsStore()
const viewStore = useViewStore()

function generateSets() {
  setsStore.generateSets(personsStore.persons)
}

function view(set: SetOfPairs) {
  viewStore.viewSet(set)
}
</script>

<template>
  <div class="column">
    <h1>Sets</h1>
    <button @click="generateSets()">Generate</button>
    <ul>
      <li v-for="(setOfPairs, index) in setsStore.sets" :key="index" class="item">
        {{ setOfPairs.name }}
        <button class="set-use-button">Use</button>
        <button class="pair-view-button" @click="view(setOfPairs)">View</button>
      </li>
    </ul>
  </div>
</template>
