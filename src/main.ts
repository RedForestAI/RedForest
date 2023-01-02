// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/views/router'
import { createPinia } from 'pinia'
import { AOIPlugin } from '@/plugins/AOIPlugin'

// Create pinia
const pinia = createPinia()

// Create application
const app = createApp(App)

// Load configuration
fetch(process.env.BASE_URL + "config.json")
    .then((res) => res.json())
    .then((config) => {
        app.config.globalProperties.config = config
    })

// Create the app instance
app.use(router)
    .use(pinia)
    .use(AOIPlugin)
    .mount('#app')
