import { ref } from 'vue'
import { defineStore } from 'pinia'
import { VuePdfPropsType } from 'vue3-pdfjs/components/vue-pdf/vue-pdf-props'; // Prop type definitions can also be imported
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { createLoadingTask } from 'vue3-pdfjs/esm';

type ContentDetails = {
  pdfSrc: string
  numOfPages: number
}

export const usePageContentStore = defineStore('pageContent', {
  state: () => {
    return {
      pdfSrc: '',
      numOfPages: 0
    } as ContentDetails
  },
  actions: {
    loadPdf (pdfPath: string) {
      this.pdfSrc = pdfPath;
      const loadingTask = createLoadingTask(this.pdfSrc)
      loadingTask.promise.then((pdf: PDFDocumentProxy) => {
        this.numOfPages = pdf.numPages
      })
    }
  }
})
