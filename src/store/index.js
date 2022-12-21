import { createStore } from 'vuex'
import { contentStore } from './contentStore.js'

export const store = createStore({
    modules: {
        contentStore
    }
})

// Load content (thereby selecting which one it is
// store.dispatch('contentStore/loadContent', '/content/sandbox_content/meta.json')
store.dispatch('contentStore/loadContent', '/content/climate_change/meta.json')
