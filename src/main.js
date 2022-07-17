import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'

// Create the app instance
const app = createApp(App)

// Add tue router instance
app.use(router)

// Then mount the app instance
app.mount('#app')
