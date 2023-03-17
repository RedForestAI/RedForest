// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/views/router' // Views
import { createPinia } from 'pinia' // State management
import AOIWebTracker from 'aoiwebtracker' // AOI tracker
import { ChimeraJSIntegrator } from 'chimera-js-integrator' // ChimeraPy integrator
import VuePdf from 'vue3-pdfjs' // PDF
import emitter from './emitter' // Event Bus
import InputTracker from './inputTracker'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#4f84f7',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme
    }
  }
})

// Internal Imports
import { useMainStore } from '@/store/MainStore'

// Create pinia
const pinia = createPinia()
const store = useMainStore(pinia)
    
// Install ChimeraPy integration
const chimerajs = new ChimeraJSIntegrator(emitter, [], 9100)
        
// Install AOIWebTracker
const tracker = new AOIWebTracker()
tracker.install({ 
  emitter: emitter,
  drawCanvas: false,
  toTrackElements: [
    // Start with the highlevel information
    {searchBy: 'id', searchName: 'scr-page-container'},
    {searchBy: 'id', searchName: 'scr-quiz-container'},
    {searchBy: 'id', searchName: 'scr-total-quiz-color-container'},
    // Quiz
    {searchBy: 'id', searchName: 'quiz-container'},
    {searchBy: 'id', searchName: 'question-title'},
    {searchBy: 'id', searchName: 'quiz-prompt'},
    {searchBy: 'class', searchName: 'answer-textarea'},
    {searchBy: 'id', searchName: 'quiz-buttons', recursiveSearch: true, saveChildren: true},
    {searchBy: 'id', searchName: 'scr-nav', recursiveSearch: true, saveWordContainers: true},
    {searchBy: 'class', searchName: 'scr-answers'},
    // Page
    {searchBy: 'class', searchName: 'hl'}
  ],
  tagColorMap: {
    DEFAULT: "rgba(255,0,0,0.1)",
    DIV: "rgba(0,255,0,0.1)",
    IMG: "rgba(0,0,255,0.1)",
    TEXT: "rgba(0,0,255,0.5)",
  },
  timeSpacing: 200
})

// Initialized store
const initPromise = store.initialize()

// Only execute the following once the store had loaded
initPromise.then(
  (value) => {
    console.log("Init Promise: " + value)

    // Create application
    const app = createApp(App)

    // Install Vuetify
    app.use(vuetify)

    // Install store first (as others depend on it)
    app.use(pinia)

    // Setting up global parameters
    app.config.globalProperties.$mitt = emitter

    // Then install others
    app.use(router)
        .use(VuePdf)

    // Finish mounting the application
    app.mount('#app') 

    // Tracking mouse movements
    const mTracker = new InputTracker(emitter)
  }
)
