import { defineStore } from 'pinia'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { createLoadingTask } from 'vue3-pdfjs/esm';

type ContentDetails = {
  wordCounter: number
  wordsWrapped: boolean
  wrappingWords: boolean
  pdfSrc: string
  numOfPages: number
  glossaryWordIds: Array<string>
}

export const usePageContentStore = defineStore('pageContent', {
  state: () => {
    return {
      wordCounter: 0,
      wordsWrapped: false,
      wrappingWords: false,
      pdfSrc: '',
      numOfPages: 0,
      glossaryWordIds: [],
      glossaryShow: false,
      glossaryWord: '',
      glsosaryDefinition: '',
    } as ContentDetails
  },
  actions: {
    restart() {
      this.reset()
      this.glossaryWordIds = []
    },
    reset () {
      this.wordCounter = 0
      this.wordsWrapped = false
      this.wrappingWords = false
    },
    loadPdf (pdfPath: string) {
      this.pdfSrc = pdfPath;
      const loadingTask = createLoadingTask(this.pdfSrc)
      loadingTask.promise.then((pdf: PDFDocumentProxy) => {
        this.numOfPages = pdf.numPages
        this.restart()
      })
    },
    reloadPdf () {
      const loadingTask = createLoadingTask(this.pdfSrc)
      loadingTask.promise.then((pdf: PDFDocumentProxy) => {
        this.numOfPages = pdf.numPages
        this.reset()
      })
    }
  }
})
