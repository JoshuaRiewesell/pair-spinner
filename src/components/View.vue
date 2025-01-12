<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useViewStore } from '@/stores/view'

const viewStore = useViewStore()

function copyView() {
  viewStore.copyToClipboard()
}
</script>

<template>
  <div class="column">
    <h1>Ansicht</h1>
    <button @click="copyView()">Copy</button>
    <ul>
      <li v-for="(pair, index) in viewStore.setOfPairs.pairs" :key="index" class="item">
        {{ pair.person1.name }} - {{ pair.person2.name }}
      </li>
    </ul>
  </div>
</template>
