// Third-party
import { createRouter, createWebHistory } from "vue-router"

// View Imports
import LoginView from '@/views/LoginView.vue'
import TutorialView from '@/views/TutorialView.vue'
import NotebookView from '@/views/NotebookView.vue'
import CompletionView from '@/views/CompletionView.vue'
import InstructionView from '@/views/InstructionView.vue'

// Store Imports
import { useConfigurationStore } from '@/store/ConfigurationStore'
import emitter from "@/emitter"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: TutorialView,
      meta:{requiresAuth: true}
    },
    {
      path: '/notebook',
      name: 'notebook',
      component: NotebookView,
      meta:{requiresAuth: true}
    },
    {
      path: '/instruction',
      name: 'instruction',
      component: InstructionView,
      meta:{requiresAuth: true},
    },
    {
      path: '/completion',
      name: 'completion',
      component: CompletionView,
      meta:{requiresAuth: true}
    }
  ]
})

// Preventing users to visiting routes that need AUTH
router.beforeEach((to, from, next) => {
  // Get reference to the configurationStore to get the login
  const configurationStore = useConfigurationStore()

  // Validate route with AUTH
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

// Recording the changes in views after they finished loading
router.afterEach((to, from, failure) => {

  // Making sure there is a route
  if (router.currentRoute.value.name != null){
    emitter.emit('router_viewChange', router.currentRoute.value.name.toString())
  }
})


export default router
