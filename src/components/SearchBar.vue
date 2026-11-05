<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Service from '@/services/service.js'
import type { AxiosResponse } from 'axios'
import router from '@/router'

const query = ref('')
const books = ref()
function search() {
  Service.searchBook(query.value).then((response: AxiosResponse) => {
    books.value = response.data
    router.push({
      name: 'books',
      query: { data: JSON.stringify(response.data) },
    })
  })
}
// const emitionGaz = 6.7
</script>

<template>
  <form @submit.prevent="search()">
    <input
      v-model="query"
      type="search"
      name="search"
      id="search"
      class="search"
      placeholder="search"
    />
  </form>

  <!-- <button @click="$emit('runEmissionFunc', emitionGaz)">emit</button> -->
</template>

<style scoped>
input {
  width: 20rem;
  padding: 0.5rem;

  border: 1px solid var(--secondary-2);
  border-radius: 5px;
  box-sizing: content-box;

  background: url('../assets/icons/search.svg') center right 0.5rem no-repeat;
  background-color: var(--main);

  transition: all 200ms;
}

input:focus {
  border: 2px solid var(--third);
  outline: none;
}
</style>
