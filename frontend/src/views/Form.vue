<script setup>
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <main>
    There will be the form itself
    <Button>test</Button>
    <InputText type="text" v-model="value" />
  </main>
</template>
