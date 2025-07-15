<script setup>
import { ref } from 'vue'

import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import FileUpload from 'primevue/fileupload'

const step = ref(1)
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dob: null,
  position: null,
  resume: null,
  linkedin: '',
})

const positions = [
  'Software Engineer',
  'Data Analyst',
  'Project Manager',
  'QA Engineer',
  'UX Designer',
]

function goToStep(n) {
  /*if (n === 2 && !validateStep1()) {
    alert('Please fill in all required fields.')
    return
  }*/
  step.value = n
}

function validateStep1() {
  const f = form.value
  return (
    f.firstName &&
    f.lastName &&
    f.email &&
    f.phone &&
    f.dob &&
    f.position &&
    f.resume
  )
}

function handleUpload(event) {
  form.value.resume = event.files?.[0]
}

function submitForm() {
  console.log('Submitted:', form.value)
  alert('Candidate submitted successfully!')
  // You can reset the form or navigate elsewhere here
}
</script>

<template>
  <main class="form-container">
    <h2>Candidate Application</h2>
     <!-- Step 1 -->
    <div v-if="step === 1" class="step">
      <div class="column">
        <div class="form-field">
          <label for="firstName">First Name*</label>
          <InputText id="firstName" v-model="form.firstName" required />
        </div>

        <div class="form-field">
          <label for="lastName">Last Name*</label>
          <InputText id="lastName" v-model="form.lastName" required />
        </div>

        <div class="form-field">
          <label for="email">Email Address*</label>
          <InputText id="email" v-model="form.email" type="email" required />
        </div>

        <div class="form-field">
          <label for="phone">Phone Number*</label>
          <InputMask id="phone" v-model="form.phone" mask="+999 999999999" required />
        </div>

        <div class="form-field">
          <label for="dob">Date of Birth*</label>
          <DatePicker id="dob" v-model="form.dob" dateFormat="yy-mm-dd" required />
        </div>

        <div class="form-field">
          <label for="address">Current Address</label>
          <Textarea id="address" v-model="form.address" rows="4" />
        </div>

        <div class="form-field">
          <label for="position">Position Applied For*</label>
          <Select
            id="position"
            v-model="form.position"
            :options="positions"
            placeholder="Select a position"
            required
          />
        </div>

        <div class="form-field">
          <label for="linkedin">LinkedIn Profile</label>
          <InputText id="linkedin" v-model="form.linkedin" type="url" />
        </div>

        <div class="form-field">
          <label for="resume">Resume / CV Upload*</label>
          <FileUpload
            id="resume"
            name="resume"
            mode="basic"
            accept=".pdf,.doc,.docx"
            :auto="true"
            @upload="handleUpload"
            required
          />
        </div>
        <div class="buttons-1">
          <Button @click="goToStep(2)">Next</Button>
        </div>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-else-if="step === 2" class="step">
      step 2
      <div class="buttons">
        <Button @click="goToStep(1)">Previous</Button>
        <Button @click="submitForm">Submit</Button>
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
  margin-top: 2em;
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

.buttons-1 {
  display: flex;
  justify-content: flex-end;
}
</style>