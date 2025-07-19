<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'

onMounted(() => {
  const accountsServer = "https://accounts.zoho.eu"
  const clientId = "1000.TV6HFTR586F2SJ2F8K25JRDT2K6C1B"
  const redirectUrl = "http://localhost:3001/oauth"
  const scopes = 'ZohoRECRUIT.modules.all'

  //check whether you need to authorize
  axios.get('http://localhost:3001/should_authorize/' + localStorage.getItem('token'))
    .then(response => {
      const should_authorize = response.data.should_authorize;

      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')

      if (should_authorize && !accessToken) {
        //if you need to authorize, redirect to Zoho OAuth login page
        const url = `${accountsServer}/oauth/v2/auth` +
          `?scope=${encodeURIComponent(scopes)}` +
          `&client_id=${clientId}` +
          `&state=testing` +
          `&response_type=code` +
          `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
          `&access_type=offline` +
          `&prompt=consent`

        window.location.href = url;
      }

      //if we sent back access token from /oauth - then we need to save it to the database 
      if (accessToken) {
        //send token data to database
        axios.post('http://localhost:3001/api/token', {
            access_token: params.get('access_token'),
            refresh_token: params.get('refresh_token'),
            api_domain: params.get('api_domain'),
            expires_in: params.get('expires_in'),
            token: localStorage.getItem('token')
        }).then(() => window.location.href = 'http://localhost:5173'); //refresh the form without token query parameters
      }
    })
});

const showSuccess = ref(false)
const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  dob: '',
  position: '',
  resume: '',
  educationLevel: '',
  sourceApplication: ''
})

const step = ref(1)
const form = reactive({
  // Step 1 fields
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dob: null, //date
  position: null,
  resume: null, //isn't included in database structure
  linkedin: '',

  // Step 2 fields
  educationLevel: null,
  yearsExperience: null,
  skills: [],
  previousEmployer: '',
  currentJobTitle: '',
  noticePeriod: null, //string
  expectedSalary: null,
  availabilityInterview: null, //date-time
  preferredLocation: null,
  coverLetter: '',
  sourceApplication: null
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

function validateStep1() {
  errors.first_name = form.firstName.trim() ? '' : 'First name is required.'
  errors.last_name = form.lastName.trim() ? '' : 'Last name is required.'
  errors.email = form.email.trim() ? '' : 'Email address is required.'
  errors.phone = form.phone.trim() ? '' : 'Phone number is required.'
  errors.dob = form.dob ? '' : 'Date of birth is required.'
  errors.position = form.position ? '' : 'Position must be selected.'
  errors.resume = form.resume ? '' : 'Resume is required.'

  return (
    !errors.first_name &&
    !errors.last_name &&
    !errors.email &&
    !errors.phone &&
    !errors.dob &&
    !errors.position &&
    !errors.resume
  )
}

function validateStep2() {
  errors.educationLevel = form.educationLevel ? '' : 'Education level is required.'
  errors.sourceApplication = form.sourceApplication ? '' : 'Source of application is required.'

  return (
    !errors.sourceApplication &&
    !errors.educationLevel
  )
}

function goToStep1() {
  step.value = 1;
}

function goToStep2() {
  if (!validateStep1()) {
    alert('Enter the values for all required fields and upload your resume.');

    return
  }

  step.value = 2;
}

function selectFiles(event) {
  form.resume = event.files[0]
}

function resetForm() {
  for (const key in form) {
    if (Array.isArray(form[key])) {
      form[key] = []
    } else {
      form[key] = null
    }
  }

  // Optional: reset resume file manually and switch to step 1
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  form.phone = ''
  form.address = ''
  form.linkedin = ''
  form.resume = null
  step.value = 1
}

function submitForm() {
  if (!validateStep2()) {
    alert('Please fill in all required fields in stage 2 before submitting the form.')
    return
  }

  axios.post('http://localhost:3001/api/form_submissions', {...form, token: localStorage.getItem('token')})
      .then(response => {
          showSuccess.value = true
          resetForm()

          setTimeout(() => showSuccess.value = false, 2000)
      })
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
            <div>
              <InputText id="firstName" v-model="form.firstName" required />
              <p class="error-text" v-if="errors.first_name">{{ errors.first_name }}</p>
            </div>
          </div>

          <div class="form-field">
            <label for="email">Email Address*</label>
            <div>
              <InputText id="email" v-model="form.email" type="email" required />
              <p class="error-text" v-if="errors.email">{{ errors.email }}</p>
            </div>
          </div>

          <div class="form-field">
            <label for="dob">Date of Birth*</label>
            <div>
              <DatePicker id="dob" v-model="form.dob" dateFormat="yy-mm-dd" required />
              <p class="error-text" v-if="errors.dob">{{ errors.dob }}</p>
            </div>
          </div>

          <div class="form-field">
            <label for="position">Position Applied For*</label>
            <div>
              <Select
                id="position"
                v-model="form.position"
                :options="positions"
                placeholder="Select a position"
                required
              />
              <p class="error-text" v-if="errors.position">{{ errors.position }}</p>
            </div>
          </div>

          <div class="form-field">
            <label for="resume">Resume / CV Upload*</label>
            <div>
              <FileUpload
                id="resume"
                name="resume"
                mode="basic"
                accept=".pdf,.doc,.docx"
                @select="selectFiles"
                required
              />
              <p class="error-text" v-if="errors.resume">{{ errors.resume }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="column">
          <div class="form-field">
            <label for="lastName">Last Name*</label>
            <div>
              <InputText id="lastName" v-model="form.lastName" required />
              <p class="error-text" v-if="errors.last_name">{{ errors.last_name }}</p>
            </div>
          </div>

          <div class="form-field">
            <label for="phone">Phone Number*</label>
            <div>
              <InputMask id="phone" v-model="form.phone" mask="+999 999999999" required />
              <p class="error-text" v-if="errors.phone">{{ errors.phone }}</p>
            </div>
          </div>

          <div class="form-field">
            <label for="address">Current Address</label>
            <Textarea id="address" v-model="form.address" rows="4" cols="20" />
          </div>

          <div class="form-field">
            <label for="linkedin">LinkedIn Profile</label>
            <div>
              <InputText id="linkedin" v-model="form.linkedin" type="url" />
            </div>
          </div>
        </div>
      </div>

      <div class="buttons-1">
        <Button @click="goToStep2()">Next</Button>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-else-if="step === 2" class="step">
      <div class="form-grid">
        <!-- Left Column -->
        <div class="column">
          <div class="form-field">
            <label for="educationLevel">Education Level*</label>
            <div>
              <Select
                id="educationLevel"
                v-model="form.educationLevel"
                :options="educationLevels"
                placeholder="Select education level"
                required
              />
              <p class="error-text" v-if="errors.educationLevel">{{ errors.educationLevel }}</p>
            </div>
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
            <div>
              <Select
                id="sourceApplication"
                v-model="form.sourceApplication"
                :options="sources"
                placeholder="Select source"
                required
              />
              <p class="error-text" v-if="errors.sourceApplication">{{ errors.sourceApplication }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="buttons">
        <Button @click="goToStep1()">Previous</Button>
        <Button @click="submitForm">Submit</Button>
      </div>
    </div>   
    
    <!--Success message-->
    <div class="success-message" v-if="showSuccess">
      Form submitted successfully!
    </div>
  </main>
</template>

<style scoped>
.error-text {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

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

.form-field .p-select, .form-field .p-datepicker {
  width: 100%;
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

.success-message {
  max-width: 1000px;
  margin: 1rem auto;
  padding: 1rem;
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  transition: 0.2s;
}
</style>
