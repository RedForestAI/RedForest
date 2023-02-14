import { defineStore } from 'pinia'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { createLoadingTask } from 'vue3-pdfjs/esm';

type ContentDetails = {
  wordsWrapped: boolean
  pdfSrc: string
  numOfPages: number
  glossaryWordIds: Array<string>
}

export const usePageContentStore = defineStore('pageContent', {
  state: () => {
    return {
      wordsWrapped: false,
      pdfSrc: '',
      numOfPages: 0,
      glossaryWordIds: [],
      glossaryShow: false,
      glossaryWord: '',
      glsosaryDefinition: '',
    } as ContentDetails
  },
  actions: {
    loadPdf (pdfPath: string) {
      this.pdfSrc = pdfPath;
      const loadingTask = createLoadingTask(this.pdfSrc)
      loadingTask.promise.then((pdf: PDFDocumentProxy) => {
        this.numOfPages = pdf.numPages
        this.wordsWrapped = false
        this.glossaryWordIds = []
      })
    },
    reloadPdf () {
      const loadingTask = createLoadingTask(this.pdfSrc)
      loadingTask.promise.then((pdf: PDFDocumentProxy) => {
        this.numOfPages = pdf.numPages
        this.wordsWrapped = false
      })
    }
  }
})
