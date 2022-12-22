// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/views/router'
import { createPinia } from 'pinia'
import { AOIPlugin } from '@/plugins/AOIPlugin'

// Create pinia
const pinia = createPinia()

// Create the app instance
createApp(App)
    .use(router)
    .use(pinia)
    .use(AOIPlugin)
    .mount('#app')
