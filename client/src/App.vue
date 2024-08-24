<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import { onMounted, ref, watchEffect } from 'vue';
import type { User } from './utils';
import TableComp from './components/TableComp.vue';

const autobots = ref<User[]>([])
const error = ref()
const isLoading = ref(false)
console.log(import.meta.env.VITE_API_BASE_URL)
onMounted(async () => {
  const { data, error, isFetching, execute} = await useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`).json()
  console.log(data.value)
  // Runs every minute
  setInterval(() => {
    execute()
  }, 1000 * 60);
  isLoading.value = isFetching.value
  if(error){
    error.value = error
  }
  
  autobots.value = data.value.users
})

function sortArray(a: User, b: User){
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  // Handle missing or invalid dates
  if (isNaN(dateA.getTime())) {
    // Handle missing or invalid dateA
    return 1; // Consider dateA as "later"
  }
  if (isNaN(dateB.getTime())) {
    // Handle missing or invalid dateB
    return -1; // Consider dateB as "later"
  }

  return dateB.getTime() - dateA.getTime();
}
</script>

<template>
  <header>
    <nav>
      <p class="">Smart Things Autobot count</p>
    </nav>
  </header>
  <body>
    <p v-if="isLoading">Loading...</p>
    <p v-if="error">{{ error }}</p>
    <p>Current Autobot count: {{ autobots.length }}</p>
    <TableComp :users="autobots.sort(sortArray)" />
  </body>
</template>

<style scoped>
nav p{
  font-size: clamp(15px, 20px, 5rem);
}
p{
  font-weight: bold;
}
</style>
