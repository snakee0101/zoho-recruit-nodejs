<script setup>
import { ref } from 'vue'

const step = ref(1)
const form = ref({
  firstName: '',
  email: '',
  age: '',
  country: ''
})

const nextStep = () => {
  step.value = 2
}

const prevStep = () => {
  step.value = 1
}

const submitForm = () => {
  console.log('Form submitted:', form.value)
  alert('Form submitted! See console.')
}
</script>

<template>
  <main class="form-container">
    <h2>Candidate Application</h2>
     <!-- Step 1 -->
    <div v-if="step === 1" class="step">
      <label>
        First Name:
        <input v-model="form.firstName" type="text" />
      </label>
      <label>
        Email:
        <input v-model="form.email" type="email" />
      </label>
      <button @click="nextStep">Next</button>
    </div>

    <!-- Step 2 -->
    <div v-else-if="step === 2" class="step">
      <label>
        Age:
        <input v-model="form.age" type="number" />
      </label>
      <label>
        Country:
        <input v-model="form.country" type="text" />
      </label>
      <div class="buttons">
        <button @click="prevStep">Previous</button>
        <button @click="submitForm">Submit</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  text-align: center;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-weight: bold;
}

.buttons {
  display: flex;
  justify-content: space-between;
}
</style>