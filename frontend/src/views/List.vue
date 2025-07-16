<script>
import axios from 'axios'
import { ref } from 'vue'

const form_submissions = ref([]);

axios.get('http://localhost:3001/api/form_submissions')
     .then(response => {
       form_submissions.value = response.data
       
       console.log(form_submissions.value)
     })

</script>

<template>
  <div>
    <h1>This is submitted forms list</h1>
  </div>
</template>

<style>

</style>
