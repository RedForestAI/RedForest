// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/views/router'
import { createPinia } from 'pinia'
import { AOIWebTracker } from 'aoiwebtracker'
import VuePdf from 'vue3-pdfjs'

// Create pinia
const pinia = createPinia()

// Create application
const app = createApp(App)

// Install store first (as others depend on it)
app.use(pinia)

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
    .mount('#app')
