import LoginView from '@/views/LoginView.vue'
import NotebookView from '@/views/NotebookView.vue'
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/notebook',
      name: 'notebook',
      component: NotebookView
    }
  ]
})

export default router;
