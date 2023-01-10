import LoginView from '@/views/LoginView.vue'
import NotebookView from '@/views/NotebookView.vue'
import CompletionView from '@/views/CompletionView.vue'
import BreakView from '@/views/BreakView.vue'
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
    },
    {
      path: '/break',
      name: 'break',
      component: BreakView
    },
    {
      path: '/completion',
      name: 'completion',
      component: CompletionView
    }
  ]
})

export default router;
