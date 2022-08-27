// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/router'
import { store } from '@/store'
// import { AOIPlugin } from '@/plugins/AOIPlugin'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

// Create the app instance
const app = createApp(App)

// Add the router instance
app.use(router)

// Add sidebar 
app.use(VueSidebarMenu)

// Add the store instance
app.use(store)

// Add plugins
// app.use(AOIPlugin)

// Then mount the app instance
app.mount('#app')
