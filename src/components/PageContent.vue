<template>
  <HighlightTool>
    <div id="page-content-view">
      <div v-for="page in pageContentStore.numOfPages" :key="page" class="scr-pdf-page">
        <VuePdf :src="pageContentStore.pdfSrc" :key="configurationStore.zoom" :page="page" :scale="configurationStore.zoom * 1.5"/>
      </div>
    </div>
  </HighlightTool>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

import { VuePdf } from 'vue3-pdfjs/esm'
import { mapStores } from 'pinia'

import { usePageContentStore } from '@/store/PageContentStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import { useModuleStore } from '@/store/ModuleStore'
import HighlightTool from '@/components/HighlightTool.vue'


export default defineComponent({
  name: 'PageContent',
  data() {
    return {
      i: 0,
      si: 0,
      tagWordCheck: ['P', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'SPAN'],
    }
  },
  mounted() {
    const targetNode = document.getElementById('page-content-view')

    if (targetNode instanceof HTMLElement) {
      const observer = new MutationObserver(() => {

        // Required to make modifying pdf only happen, as the observer 
        // is triggered 5 times everytime it changes.
        if (!this.pageContentStore.wordsWrapped){
          this.pageContentStore.wordsWrapped = true

          // Wait until the PDF fully loads 
          setTimeout(() => {
            this.wrapWordsForHighlighting()
            this.glossaryPreprocessing()
          }, 1000)
        }
      })

      observer.observe(targetNode, {attributes: false, childList: true, subtree: true})

    }
  },
  components: { 
    VuePdf,
    HighlightTool
  },
  computed: {
    ...mapStores(usePageContentStore),
    ...mapStores(useConfigurationStore),
    ...mapStores(useModuleStore)
  },
  methods: {
    wrapWordsForHighlighting () {
      /* console.log('Wrapping Words') */
      const elements: HTMLCollection = document.getElementsByClassName('scr-pdf-page')

      for (let i = 0; i < elements.length; i++) {

        const element = elements[i]
        this.wrapWords(element)
      }
    },
    wrapWords (element: Element) {

      // Recursive deep search
      for (let j = 0; j < element.childElementCount; j++){
        const child = element.children[j]
        /* console.log('WrapWords: ', child) */
        this.wrapWords(child)
      }

      // Handle this element specifically

      if (this.tagWordCheck.includes(element.tagName)){

        for (let j = 0; j < element.childNodes.length; j++) {
          const node = element.childNodes[j];
          /* console.log('WrapWords ChildNodes: ', node) */ 
          this.wordSearch(element, node)
        }
      }
    },

    wordSearch (element: Element, node: Node) {

      // Only applicable if element is HTMLElement
      if (!(element instanceof HTMLElement)) {
        return
      }

      // Avoid doing it twice
      if (element.tagName == "p" && element.id[0] == 'w'){
        return 
      }

      // If we find text, replace it with a new span
      if (node.nodeName == "#text" && node.nodeValue != null){
            
        const words = node.nodeValue.split(" ");

        // Create new Container element
        const newElement = document.createElement('div')
        newElement.style['float'] = 'left'
        newElement.style['display'] = 'flex'
        /* newElement.style['opacity'] = '1' */
          
        // Create container for adding new span Nodes
        const toBeAddedElements: Element[] = []
        for (let j = 0; j < words.length; j++){
          
          // Add a text node if j != 0
          if (j != 0){
            const newChildWhiteSpace = document.createElement("p")
            newChildWhiteSpace.appendChild(document.createTextNode(" "))
            newChildWhiteSpace.style.display = "inblock-block"
            newChildWhiteSpace.style.margin= "0 0 0 0"
            newChildWhiteSpace.style['font-family'] = element.style['font-family']
            newChildWhiteSpace.style['font-size'] = element.style['font-size']
            newChildWhiteSpace.setAttribute("class", "hl")
            newChildWhiteSpace.setAttribute("id", "p" + this.moduleStore.contentID + "s" + this.si)
            this.si += 1
            toBeAddedElements.push(newChildWhiteSpace)
          }
                
          // Create new span for each Word
          const newChild = document.createElement('p')
          newChild.appendChild(document.createTextNode(words[j]))
          newChild.setAttribute("id", "p" + this.moduleStore.contentID + "w" + this.i)
          newChild.setAttribute("class", "hl")
          newChild.style.display = 'inblock-block'
          newChild.style.margin = '0 0 0 0'
          this.i += 1

          // Add font information
          newChild.style['font-family'] = element.style['font-family']
          newChild.style['font-size'] = element.style['font-size']
         
          // Store  the new element, to be added later
          toBeAddedElements.push(newChild)

        }

        // Adding the new elements into a DIV container
        for (let j = 0; j < toBeAddedElements.length; j++ ) {
          newElement.appendChild(toBeAddedElements[j])
        }
        
        // Replace
        element.removeChild(node)
        element.appendChild(newElement)
        /* console.log("Word Wrapping: removed and appended new children") */
       
      }
    },

    glossaryFormatting() {

      // First, we need to make the parent div's opacity 1 as to not 
      // affect the children elements
      const pdfElements = document.getElementsByClassName("textLayer vue-pdf__wrapper-text-layer")
      for (let i = 0; i < pdfElements.length; i++) {
        const element = pdfElements[i]
        if (element instanceof HTMLElement) {
          element.style['opacity'] = '1'
        }
      }

      // After changing the opacity, that made the selection tool too intense
      document.styleSheets[0].addRule('*::selection', 'color: white; background: #cc0000;');
      console.log("Glossary Formatting")
    
      for (let i = 0; i < this.pageContentStore.glossaryWordIds.length; i++) {
        const elementID = this.pageContentStore.glossaryWordIds[i]
        console.log("Formatting: " + elementID)
        const element = document.getElementById(elementID)

        if (element instanceof HTMLElement && element.parentNode != null) {
          const wrapperDiv = document.createElement("div")
          
          wrapperDiv.style['background-color'] = "rgb(255,255,255)"
          element.style['color'] = "red"
          element.style['text-decoration-line'] = 'underline'
          element.style['text-decoration-color'] = "red"

          element.parentNode.replaceChild(wrapperDiv, element)
          wrapperDiv.appendChild(element)
        }
      }
    },

    glossaryPreprocessing() {

      // Create form data to send request
      axios({
        method: 'get',
        url: this.configurationStore.serverLocation + '/glossary', 
      }).then((res) => {

        // If login success, save username and password and move on
        if (res.data.success) {
          console.log("Successful Glossary Fetch")
          console.log(res.data.glossary)
          this.pageContentStore.glossaryWordIds = res.data.glossary
          this.glossaryFormatting()
        }

        // Else, inform of failure
        else {
          alert("Failed Glossary fetch")
        }

      // Error Handling
      }).catch((error) => {
          alert("No Login Server Response - " + error.data)
      })
    }
  }
})
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
}

.scr-pdf-page {
  display: flex;
  justify-content: center;
  background-color: #5555;
}

::selection {
  background: "blue";
}

</style>
