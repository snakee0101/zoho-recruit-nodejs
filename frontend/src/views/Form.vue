<script setup>
import { ref, reactive } from 'vue'

import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import FileUpload from 'primevue/fileupload'

const step = ref(1)
const form = reactive({
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
  const f = form
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
  form.resume = event.files?.[0]
}

function submitForm() {
  console.log('Submitted:', form)
  alert('Candidate submitted successfully!')
  // You can reset the form or navigate elsewhere here
}
</script>

<template>
  <main class="form-container">
    <h2>Candidate Application</h2>

    <!-- Step 1 -->
    <div v-if="step === 1" class="step">
      <div class="form-grid">
        <!-- Left Column -->
        <div class="column">
          <div class="form-field">
            <label for="firstName">First Name*</label>
            <InputText id="firstName" v-model="form.firstName" required />
          </div>

          <div class="form-field">
            <label for="email">Email Address*</label>
            <InputText id="email" v-model="form.email" type="email" required />
          </div>

          <div class="form-field">
            <label for="dob">Date of Birth*</label>
            <DatePicker id="dob" v-model="form.dob" dateFormat="yy-mm-dd" required />
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
            <div v-if="form.resume" class="resume-name">Selected: {{ form.resume.name }}</div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="column">
          <div class="form-field">
            <label for="lastName">Last Name*</label>
            <InputText id="lastName" v-model="form.lastName" required />
          </div>

          <div class="form-field">
            <label for="phone">Phone Number*</label>
            <InputMask id="phone" v-model="form.phone" mask="+999 999999999" required />
          </div>

          <div class="form-field">
            <label for="address">Current Address</label>
            <Textarea id="address" v-model="form.address" rows="4" cols="20" />
          </div>

          <div class="form-field">
            <label for="linkedin">LinkedIn Profile</label>
            <InputText id="linkedin" v-model="form.linkedin" type="url" />
          </div>
        </div>
      </div>

      <div class="buttons-1">
        <Button @click="goToStep(2)">Next</Button>
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
  max-width: 1000px;
  margin: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

h2 {
  text-align: center;
    margin-bottom: 2rem;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Каждое поле — две колонки: label и input */
.form-field {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  gap: 1rem;
}

label {
  font-weight: 600;
  white-space: nowrap;
}

.form-field :is(input, textarea, .p-inputtext, .p-dropdown, .p-calendar, .p-inputmask, .p-fileupload) {
  width: 100%;
  min-height: 2.5rem;
}

.resume-name {
  grid-column: 2; /* выравниваем под полем, а не под label */
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #444;
  font-style: italic;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.buttons-1 {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}
</style>
