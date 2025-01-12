import { defineStore } from 'pinia'

export const useViewStore = defineStore('view', {
  state: (): View => ({
    setOfPairs: {
      id: 0,
      name: '',
      pairs: []
    },
    isVisible: false
  }),
  actions: {
    viewSet(setOfPairs: SetOfPairs) {
      this.setOfPairs = setOfPairs
      this.isVisible = true
    },
    copyToClipboard() {
      if (this.isVisible) {
        let copyText = ''
        this.setOfPairs.pairs.forEach((pair) => {
          copyText = copyText + pair.person1.name + ' - ' + pair.person2.name + '\n'
        })
        navigator.clipboard.writeText(copyText)
      }
    }
  }
})
