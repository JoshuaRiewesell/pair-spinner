<script setup lang="ts">
import Persons from '@/components/Persons.vue'
import { usePersonsStore } from '@/stores/persons'
import { useSetsStore } from '@/stores/sets'
import Settings from './components/Settings.vue'
import Sets from './components/Sets.vue'
import View from './components/View.vue'

const patientsStore = usePersonsStore()
const setsStore = useSetsStore()

patientsStore.loadFromLocalStorage()
setsStore.loadFromLocalStorage()
</script>

<template>
  <main>
    <div class="grid">
      <Settings />
      <Persons />

      <div class="column">
        <h1>Filter</h1>
        <div>
          <button>Gebieten</button>
          <button>Verbieten</button>
        </div>
      </div>

      <Sets />

      <div class="column">
        <h1>Verwendet</h1>
        <div>
          <button>Export</button>
        </div>
        <ul class="usedSet-items"></ul>
      </div>

      <View />
    </div>
  </main>
</template>

<style scoped></style>
