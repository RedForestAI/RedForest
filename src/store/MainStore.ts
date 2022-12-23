import { defineStore } from 'pinia'

// Load other stores
import { usePageContentStore } from './PageContentStore'
      

export const useMainStore = defineStore('main', {
  actions: {
    initialize() {
      console.log("Initialization is occurring!")
      const pageContent = usePageContentStore()
      pageContent.loadContent("/content/climate_change/meta.json")
    }
  }
})