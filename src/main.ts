// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/views/router' // Views
import { createPinia } from 'pinia' // State management
import { AOIWebTracker } from 'aoiwebtracker' // AOI tracker
import ChimeraJSIntegrator from 'chimera-js-integrator' // ChimeraPy integrator
import VuePdf from 'vue3-pdfjs' // PDF
import emitter from './emitter'

// Internal Imports
import { useMainStore } from '@/store/MainStore'

// Create pinia
const pinia = createPinia()
const store = useMainStore(pinia)
    
// Install ChimeraPy integration
const chimerajs = new ChimeraJSIntegrator()
chimerajs.install({
  emitter: emitter,
  eventArray: [],
  subPort: 7777,
  subIP: '127.0.0.1',
  repPort: 6767
})

// Initialized store
const initPromise = store.initialize()

// Only execute the following once the store had loaded
initPromise.then(
    (value) => {
        console.log("Init Promise: " + value)

        // Create application
        const app = createApp(App)

        // Install store first (as others depend on it)
        app.use(pinia)

        // Setting up global parameters
        app.config.globalProperties.$mitt = emitter

        // Then install others
        app.use(router)
            .use(AOIWebTracker, { 
                drawCanvas: false,
                toTrackElements: [
                    {tag: 'div', id: 'scr-page-container', recursive: true, wordLevel: true},
                    {tag: 'div', id: 'scr-quiz-container', recursive: true, wordLevel: true},
                    {tag: 'div', id: 'scr-nav', recursive: true, wordLevel: true}
                ]
            })
            .use(VuePdf)

        // Finish mounting the application
        app.mount('#app') 
    }
)
