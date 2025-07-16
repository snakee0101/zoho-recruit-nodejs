<script setup>
import axios from 'axios'
import { reactive, ref } from 'vue'

let form_submissions = ref([]);

axios.get('http://localhost:3001/api/form_submissions')
    .then(response => {
      form_submissions.value = response.data
    })
    .catch(error => {
      console.error('Error loading form submissions:', error)
    });

function formatDate(datetime) {
  if (!datetime) return ''
  return new Date(datetime).toLocaleString()
}
</script>

<template>
  <div class="form-submissions-list">
    <h1>Submitted Candidate Forms</h1>

    <div
      v-for="submission in form_submissions"
      :key="submission.id"
      class="form-block"
    >
      <h2 class="form-title">Submission #{{ submission.id }}</h2>

      <div class="form-grid">
        <!-- Column 1 -->
        <div class="column">
          <div class="form-field">
            <label>First Name:</label>
            <div>{{ submission.first_name }}</div>
          </div>

          <div class="form-field">
            <label>Email Address:</label>
            <div>{{ submission.email }}</div>
          </div>

          <div class="form-field">
            <label>Date of Birth:</label>
            <div>{{ submission.dob }}</div>
          </div>

          <div class="form-field">
            <label>Position:</label>
            <div>{{ submission.position }}</div>
          </div>

          <div class="form-field">
            <label>LinkedIn:</label>
            <div><a :href="submission.linkedin" target="_blank">{{ submission.linkedin }}</a></div>
          </div>

          <div class="form-field">
            <label>Resume:</label>
            <div>Not stored</div>
          </div>
        </div>

        <!-- Column 2 -->
        <div class="column">
          <div class="form-field">
            <label>Last Name:</label>
            <div>{{ submission.last_name }}</div>
          </div>

          <div class="form-field">
            <label>Phone Number:</label>
            <div>{{ submission.phone }}</div>
          </div>

          <div class="form-field">
            <label>Address:</label>
            <div>{{ submission.address }}</div>
          </div>

          <div class="form-field">
            <label>Education Level:</label>
            <div>{{ submission.education_level }}</div>
          </div>

          <div class="form-field">
            <label>Skills:</label>
            <div>{{ submission.skills?.join(', ') }}</div>
          </div>
        </div>
      </div>

      <div class="form-grid">
        <div class="column">
          <div class="form-field">
            <label>Previous Employer:</label>
            <div>{{ submission.previous_employer }}</div>
          </div>

          <div class="form-field">
            <label>Current Job Title:</label>
            <div>{{ submission.current_job_title }}</div>
          </div>

          <div class="form-field">
            <label>Notice Period:</label>
            <div>{{ submission.notice_period }}</div>
          </div>

          <div class="form-field">
            <label>Expected Salary:</label>
            <div>${{ submission.expected_salary }}</div>
          </div>
        </div>

        <div class="column">
          <div class="form-field">
            <label>Availability for Interview:</label>
            <div>{{ formatDate(submission.availability_interview) }}</div>
          </div>

          <div class="form-field">
            <label>Preferred Location:</label>
            <div>{{ submission.preferred_location }}</div>
          </div>

          <div class="form-field">
            <label>Source of Application:</label>
            <div>{{ submission.source_application }}</div>
          </div>

          <div class="form-field">
            <label>Cover Letter:</label>
            <div class="cover-letter-block">{{ submission.cover_letter }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-submissions-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.form-block {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  background-color: #f9fafb;
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: #1f2937;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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

.cover-letter-block {
  white-space: pre-wrap;
  background-color: #fff;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: sans-serif;
}
</style>