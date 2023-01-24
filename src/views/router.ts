// Third-party
import { createRouter, createWebHistory } from "vue-router"

// View Imports
import LoginView from '@/views/LoginView.vue'
import NotebookView from '@/views/NotebookView.vue'
import CompletionView from '@/views/CompletionView.vue'
import BreakView from '@/views/BreakView.vue'

// Store Imports
import { useConfigurationStore } from '@/store/ConfigurationStore'

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
      component: NotebookView,
      meta:{requiresAuth: true}
    },
    {
      path: '/break',
      name: 'break',
      component: BreakView,
      meta:{requiresAuth: true}
    },
    {
      path: '/completion',
      name: 'completion',
      component: CompletionView,
      meta:{requiresAuth: true}
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Get reference to the configurationStore to get the login
  const configurationStore = useConfigurationStore()

  if (to.meta.requiresAuth) {
    if (configurationStore.loggedIn) {
      next()
    }
    else {
      next('/')
    }
  }
  else {
    next()
  }
})

export default router;
