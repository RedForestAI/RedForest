// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/views/router'
import { createPinia } from 'pinia'
import { AOIPlugin } from '@/plugins/AOIPlugin'
import VuePdf from 'vue3-pdfjs'

// Create pinia
const pinia = createPinia()

// Create application
const app = createApp(App)

// Create the app instance
app.use(router)
    .use(pinia)
    .use(AOIPlugin, { 
        drawCanvas: false,
        toTrackElements: [
            {tag: 'div', id: 'scr-page-container', recursive: true, wordLevel: true},
            {tag: 'div', id: 'scr-quiz-container', recursive: true, wordLevel: true},
            {tag: 'div', id: 'scr-nav', recursive: true, wordLevel: true}
        ]
    })
    .use(VuePdf)
    .mount('#app')
