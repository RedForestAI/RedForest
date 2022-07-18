import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

// Create the app instance
const app = createApp(App)

// Add the router instance
app.use(router)

// Add the store instance
app.use(store)

// Then mount the app instance
app.mount('#app')
