import { createRouter, createWebHistory } from 'vue-router'
import Form from '../views/Form.vue'
import List from '@/views/List.vue'
import Login from '@/views/Login.vue'

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
  if (to.name === 'list' && from.name === 'form') {
    if (confirm('Warning! All data entered into the form will be lost. Are you sure to proceed?') === false) {
        return false;
    } 
  }
})

export default router
