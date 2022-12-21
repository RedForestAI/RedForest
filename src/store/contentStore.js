export const contentStore = {
    namespaced: true,
    state: {
        contentPages: [],
        currentPageId: null,
    },
    getters: {
        getCurrentPageFilepath (state) {
            return state.contentPages[state.currentPageId].path
        }
    },
    mutations: {
        loadContent (state, contentPath) {

            // Load the meta JSON
            fetch(contentPath)
                .then((res) => res.json())
                .then((data) => {
                    
                    // Object with content attribute that is an
                    // Array of Objects with title and path attributes
                    // {
                    //     'content': 
                    //         [
                    //             {
                    //                 "title": "PlaceHolderTitle",
                    //                 "path": "PlaceHolderPath"
                    //             }
                    //         ]
                    // }
                    state.contentPages = data.content
                    state.currentPageId = 0
                });
        }
    },
    actions: {
        loadContent (context, contentPath) {
            context.commit('loadContent', contentPath)
        }
    }
}
