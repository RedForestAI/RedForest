import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { store } from '@/store'
import { AOIPlugin } from '@/plugins/AOIPlugin'

// Create the app instance
const app = createApp(App)

// Add the router instance
app.use(router)

// Add the store instance
app.use(store)

// Add plugins
app.use(AOIPlugin)

// Then mount the app instance
app.mount('#app')
