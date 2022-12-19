// Creating app
import { createApp } from 'vue'
import App from '@/App.vue'

// Plugins
import router from '@/router'
import { store } from '@/store'
import { AOIPlugin } from '@/plugins/AOIPlugin'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

// Create the app instance
createApp(App)
    .use(router)
    .use(store)
    .use(AOIPlugin)
    .mount('#app')
