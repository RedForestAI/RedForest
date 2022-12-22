import { defineStore } from 'pinia'

type PageContent = {
  title: String 
}

type ContentDetails = {
  currentPageID: number | undefined
  contentPages: PageContent[]
}

export const pageContentStore = defineStore('pageContent', {
  state: () => {
    return {
      currentPageID: undefined,
      contentPages: []
    } as ContentDetails
  },
  actions: {
    loadContent (contentPath: URL) {
      
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
