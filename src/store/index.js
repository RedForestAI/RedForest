import { createStore } from 'vuex'

export const store = createStore({
    state: {

        pageList: [],
        currentPageId: null,
        currentPageFilepath: '/content/climate_change/pages/introduction.html'
    },
})

// Load content
// store.dispatch('loadContent', '/content/climate_change/meta.json')
