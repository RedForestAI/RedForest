import { defineStore } from 'pinia'
import axios from 'axios'

type PageContent = {
  title: string 
  path: string
}

type ContentDetails = {
  contentPages: PageContent[]
  currentPageID: number
  currentPageFilepath: string
}

export const usePageContentStore = defineStore('pageContent', {
  state: () => {
    return {
      contentPages: [],
      currentPageID: 0,
      currentPageFilepath: '',
    } as ContentDetails
  },
  getters: {
    getCurrentPageFilepath(state): string {
      return state.contentPages[state.currentPageID].path
    },
  },
  actions: {
    loadPage () {
      this.currentPageFilepath = this.getCurrentPageFilepath
    },
    loadContent (contentPath: string) {
      
      // Load the meta JSON
      fetch(contentPath)
        .then((res) => res.json())
        .then((data) => {
          this.contentPages = data.content
          this.currentPageID = 0
          this.loadPage()
        }); 
    },
  }
})
