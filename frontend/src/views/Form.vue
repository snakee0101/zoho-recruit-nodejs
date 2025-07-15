<script setup>
import { ref, reactive, computed } from 'vue'

import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'

const step = ref(1)
const form = reactive({
  // Step 1 fields
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dob: null,
  position: null,
  resume: [],
  linkedin: '',

  // Step 2 fields
  educationLevel: null,
  yearsExperience: null,
  skills: [],
  previousEmployer: '',
  currentJobTitle: '',
  noticePeriod: null,
  expectedSalary: null,
  availabilityInterview: null,
  preferredLocation: null,
  coverLetter: '',
  sourceApplication: null,
})

const positions = [
  'Software Engineer',
  'Data Analyst',
  'Project Manager',
  'QA Engineer',
  'UX Designer',
]

const educationLevels = [
  'High School',
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate',
]

const noticePeriods = [
  'Immediate',
  '1 Week',
  '2 Weeks',
  '1 Month',
  'More than 1 Month',
]

const preferredLocations = [
  'New York',
  'San Francisco',
  'Chicago',
  'Austin',
  'Remote',
]

const sources = [
  'Company Website',
  'LinkedIn',
  'Job Board',
  'Referral',
  'Other',
]

const skillsOptionsMap = {
  'Software Engineer': [
    'JavaScript',
    'Python',
    'SQL',
    'Java',
    'C#',
    'React',
    'Node.js',
    'AWS',
    'Docker',
    'Kubernetes',
  ],
  'Data Analyst': [
    'SQL',
    'Python',
    'R',
    'Excel',
    'Tableau',
    'PowerBI',
    'SAS',
    'MATLAB',
  ],
  'Project Manager': ['Agile', 'Scrum', 'Project Planning', 'Risk Management', 'Budgeting'],
  'QA Engineer': ['Test Automation', 'Selenium', 'JIRA', 'TestRail', 'Performance Testing'],
  'UX Designer': ['Sketch', 'Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
}

const skillsOptions = computed(() => {
  return skillsOptionsMap[form.position]
})

const getFileNames = computed(() => {
  return form.resume.map(file => file.name).join(', ')
})

function goToStep(n) {
  step.value = n
}

function selectFiles(event) {
  form.resume = event.files
}

function submitForm() {
  console.log('Submitted:', form)
  alert('Candidate submitted successfully!')
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
              name="resume[]"
              :multiple="true"
              mode="basic"
              accept=".pdf,.doc,.docx"
              @select="selectFiles"
              required
            />
            <div v-if="form.resume" class="resume-name">Selected: {{ getFileNames }}</div>
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
      <div class="form-grid">
        <!-- Left Column -->
        <div class="column">
          <div class="form-field">
            <label for="educationLevel">Education Level*</label>
            <Select
              id="educationLevel"
              v-model="form.educationLevel"
              :options="educationLevels"
              placeholder="Select education level"
              required
            />
          </div>

          <div class="form-field">
            <label for="yearsExperience">Years of Experience</label>
            <InputText
              id="yearsExperience"
              v-model.number="form.yearsExperience"
              type="number"
              min="0"
              placeholder="e.g. 3"
            />
          </div>

          <div class="form-field">
            <label for="skills">Skills</label>
            <MultiSelect
              id="skills"
              v-model="form.skills"
              :options="skillsOptions"
              placeholder="Select relevant skills"
              :filter="true"
              :showClear="true"
            />
          </div>

          <div class="form-field">
            <label for="previousEmployer">Previous Employer</label>
            <InputText id="previousEmployer" v-model="form.previousEmployer" />
          </div>

          <div class="form-field">
            <label for="currentJobTitle">Current Job Title</label>
            <InputText id="currentJobTitle" v-model="form.currentJobTitle" />
          </div>

          <div class="form-field">
            <label for="noticePeriod">Notice Period</label>
            <Select
              id="noticePeriod"
              v-model="form.noticePeriod"
              :options="noticePeriods"
              placeholder="Select notice period"
            />
          </div>

          <div class="form-field">
            <label for="expectedSalary">Expected Salary</label>
            <InputText
              id="expectedSalary"
              v-model.number="form.expectedSalary"
              type="number"
              min="0"
              placeholder="Enter expected salary"
            />
          </div>
        </div>

        <!-- Right Column -->
        <div class="column">
          <div class="form-field">
            <label for="availabilityInterview">Availability for Interview</label>
            <DatePicker
              id="availabilityInterview"
              v-model="form.availabilityInterview"
              showTime
              hourFormat="24"
              placeholder="Select date & time"
              dateFormat="yy-mm-dd"
            />
          </div>

          <div class="form-field">
            <label for="preferredLocation">Preferred Location</label>
            <Select
              id="preferredLocation"
              v-model="form.preferredLocation"
              :options="preferredLocations"
              placeholder="Select preferred location"
            />
          </div>

          <div class="form-field" style="align-items: flex-start;">
            <label for="coverLetter">Cover Letter</label>
            <Textarea id="coverLetter" v-model="form.coverLetter" rows="6" cols="20" />
          </div>

          <div class="form-field">
            <label for="sourceApplication">Source of Application*</label>
            <Select
              id="sourceApplication"
              v-model="form.sourceApplication"
              :options="sources"
              placeholder="Select source"
              required
            />
          </div>
        </div>
      </div>

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
