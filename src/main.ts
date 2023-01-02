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
    .use(AOIPlugin)
    .use(VuePdf)
    .mount('#app')
