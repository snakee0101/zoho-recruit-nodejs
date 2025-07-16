<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const loginForm = reactive({
  email: '',
  password: '',
})

const loginErrors = reactive({
  email: '',
  password: '',
  invalid_credentials: ''
})

const loginSuccess = ref(false)

function validateLogin() {
  loginErrors.email = loginForm.email.trim() ? '' : 'Email is required.'
  loginErrors.password = loginForm.password.trim() ? '' : 'Password is required.'

  return !loginErrors.email && !loginErrors.password
}

async function submitLogin() {
  if (!validateLogin()) return

  try {
    const response = await axios.post('http://localhost:3001/api/login', loginForm)
    loginSuccess.value = true
    setTimeout(() => loginSuccess.value = false, 2000)
  } catch (err) {
    loginErrors.invalid_credentials = 'Invalid credentials.'
  }
}
</script>

<template>
  <main class="form-container login">
    <h2>Login</h2>

    <div class="form-grid single-column">
      <div class="form-field">
        <label for="email">Email</label>
        <div>
          <InputText id="email" v-model="loginForm.email" />
          <p class="error-text" v-if="loginErrors.email">{{ loginErrors.email }}</p>
        </div>
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <div>
          <Password id="password" v-model="loginForm.password" toggleMask :feedback="false" />
          <p class="error-text" v-if="loginErrors.password">{{ loginErrors.password }}</p>
        </div>
      </div>

      <div class="buttons-1">
        <Button @click="submitLogin">Login</Button>
      </div>
    </div>

    <p class="error-text" v-if="loginErrors.invalid_credentials">{{ loginErrors.password }}</p>

    <div v-if="loginSuccess" class="success-message">
      Logged in successfully!
    </div>
  </main>
</template>

<style scoped>
.form-container.login {
  max-width: 500px;
  margin: auto;
  margin-top: 4rem;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.form-grid.single-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 1rem;
}

label {
  font-weight: 600;
  white-space: nowrap;
}

input, .p-inputtext, .p-password {
  width: 100%;
  min-height: 2.5rem;
}

.buttons-1 {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}
</style>