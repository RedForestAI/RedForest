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

import { VuePdf } from 'vue3-pdfjs/esm'
import { mapStores } from 'pinia'

import { usePageContentStore } from '@/store/PageContentStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import HighlightTool from '@/components/HighlightTool.vue'


export default defineComponent({
  name: 'PageContent',
  data() {
    return {
      i: 0,
      tagWordCheck: ['P', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'SPAN'],
      modifyingPdf: false
    }
  },
  mounted() {
    const targetNode = document.getElementById('page-content-view')
    console.log(targetNode)

    if (targetNode instanceof HTMLElement) {
      const observer = new MutationObserver(() => {

        // Required to make modifying pdf only happen, as the observer 
        // is triggered 5 times everytime it changes.
        if (!this.modifyingPdf){
          this.modifyingPdf = true

          setTimeout(() => {
            /* this.wrapWordsForHighlighting() */
            /* this.modifyingPdf = false */
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
    ...mapStores(useConfigurationStore)
  },
  methods: {
    wrapWordsForHighlighting () {
      console.log('Wrapping Words')
      const elements: HTMLCollection = document.getElementsByClassName('scr-pdf-page')

      for (let i = 0; i < elements.length; i++) {

        const element = elements[i]
        /* console.log('WrapWordsForHighlighting: ', element) */
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

      // Avoid doing it twice
      if (element.tagName == "span" && element.id[0] == 'w'){
        return 
      }
     
      // Create range to find BB
      const range = new Range();

      // If we find text, replace it with a new span
      if (node.nodeName == "#text" && node.nodeValue != null){
            
        const words = node.nodeValue.split(" ");

        let textStartPointer = 0;
        let textEndPointer = 0;

        for (let j = 0; j < words.length; j++){
                
          // Select the word's range
          textEndPointer = textStartPointer + words[j].length;
          range.setStart(node, textStartPointer);
          range.setEnd(node, textEndPointer);

          // Get word data and store
          const rect = range.getBoundingClientRect();

          // Create new span for each Word
          const newSpan = document.createElement('span')
          newSpan.appendChild(document.createTextNode(words[j]))
          newSpan.setAttribute("id", "w" + this.i)
          newSpan.style.left = (rect.left + window.scrollX) + "px"
          /* newSpan.setAttribute('x', rect.x) */
          /* newSpan.setAttribute('y', rect.y) */
          /* newSpan.setAttribute('width', rect.width) */
          /* newSpan.setAttribute('height', rect.height) */
          element.appendChild(newSpan)

        }

        // Replace and move to the next element
        element.removeChild(node)
        this.i += 1
      }
    }
  }
});
</script>

<style>
img {
  max-width: 100%;
  max-height: 100%;
}

.scr-pdf-page {
  display: flex;
  justify-content: center;
  background-color: #3333;
}

</style>
