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
  currentPageHtml: string
}

export const usePageContentStore = defineStore('content', {
  state: () => {
    return {
      contentPages: [],
      currentPageID: 0,
      currentPageFilepath: '',
      currentPageHtml: ''
    } as ContentDetails
  },
  getters: {
    getCurrentPageFilepath(state): string {
      console.log(state.contentPages)
      return state.contentPages[state.currentPageID].path
    },
    getCurrentPageHtml(state): string {
      axios
        .get(this.currentPageFilepath)
        .then((response) => (this.currentPageHtml = response.data))
      return this.currentPageHtml
    }
  },
  actions: {
    loadPage () {
      this.currentPageFilepath = this.getCurrentPageFilepath
      this.currentPageHtml = this.getCurrentPageHtml
    },
    loadContent (contentPath: string) {
      
      // Load the meta JSON
      fetch(contentPath)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          this.contentPages = data.content
          this.currentPageID = 0
          this.loadPage()
        }); 
    },
    prev () {
      if (this.currentPageID > 0) {
        this.currentPageID -= this.currentPageID
        this.loadPage()
      }
    },
    next () {
      if (this.currentPageID < this.contentPages.length - 1){
        this.currentPageID += this.currentPageID
        this.loadPage()
      }
    }
  }
})
