import { createRouter, createWebHistory } from 'vue-router'
import Form from '../views/Form.vue'
import List from '@/views/List.vue'

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
  ],
})

export default router
