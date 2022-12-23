import { defineStore } from 'pinia'

type PageContent = {
  title: String 
  path: String
}

type ContentDetails = {
  currentPageFilepath: string
  currentPageID: number
  contentPages: PageContent[]
}

export const usePageContentStore = defineStore('content', {
  state: () => {
    return {
      currentPageFilepath: 'content/climate_change/pages/introduction.html',
      currentPageID: 0,
      contentPages: []
    } as ContentDetails
  },
  getters: {
    getCurrentPageFilepath(state) {
      return state.contentPages[state.currentPageID].path
    }
  },
  actions: {
    loadContent (contentPath: string) {
      
      // Load the meta JSON
      fetch(contentPath)
        .then((res) => res.json())
        .then((data) => {
            this.contentPages = data.content
            this.currentPageID = 0
        }); 
    }
  }
})
