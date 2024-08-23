<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import { ref, watchEffect } from 'vue';
import type { User } from './utils';

const autobots = ref<User[]>([])
const error = ref()
const isLoading = ref(false)

watchEffect(async () => {
  const { data, error, isFetching} = await useFetch(`${import.meta.env.VITE_API_BASE_URL}/users`).json()
  
  isLoading.value = isFetching.value
  if(error){
    error.value = error
  }
  
  autobots.value = data.value.autobots
})


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

    <table>
      <thead>
        <th>Id</th>
        <th>Name</th>
        <th>CreatedAt</th>
      </thead>
      <tbody>
        <tr v-for="bot in autobots">
          <td>{{ bot.id }}</td>
          <td>{{ bot.name }}</td>
          <td>{{ bot.createdAt }}</td>
        </tr>
        
      </tbody>
    </table>
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
