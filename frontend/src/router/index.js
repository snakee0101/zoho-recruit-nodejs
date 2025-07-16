import { createRouter, createWebHistory } from 'vue-router'
import Form from '../views/Form.vue'
import List from '@/views/List.vue'
import Login from '@/views/Login.vue'
import axios from 'axios'

async function isSavedTokenValid() {
  let is_token_valid = false;
  
  await axios.post('http://localhost:3001/api/is_token_valid', { token: localStorage.getItem('token') })
    .then((response) => {
      is_token_valid = response.data.valid    
    })
    .catch((error) => is_token_valid = false)
  
  return is_token_valid;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'form',
      component: Form,
    },
    {
      path: '/list',
      name: 'list',
      component: List,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})

router.beforeEach((to, from) => {
  isSavedTokenValid().then((isTokenValid) => {
    if (to.name != 'login' && isTokenValid == false) {
      return router.push('/login')
    }

    if (to.name === 'list' && from.name === 'form') {
      if (confirm('Warning! All data entered into the form will be lost. Are you sure to proceed?') === false) {
          return false;
      } 
    }
  });
})

export default router
