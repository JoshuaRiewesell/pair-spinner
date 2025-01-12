import { defineStore } from 'pinia'

export const useSetsStore = defineStore('sets', {
  state: (): Sets => ({
    id: 0,
    sets: []
  }),
  actions: {
    loadFromLocalStorage() {
      const savedsets = localStorage.getItem('sets')
      if (savedsets) {
        this.sets = JSON.parse(savedsets)
      }
    },
    updateLocalStorage() {
      localStorage.setItem('sets', JSON.stringify(this.sets))
    },
    removeAllSets() {
      this.sets = []
      localStorage.setItem('sets', JSON.stringify([]))
    },
    generateSets(persons: Person[]) {
      console.log('Persons: ' + persons)
      const sets = [] as SetOfPairs[]
      let seats = persons
      for (let i = 0; i < seats.length - 1; i++) {
        sets.push(this.createSet(seats, i))
        seats = this.rotate(seats)
      }
      //this.sets = this.filterSets(sets, this.sets)
      this.sets = sets
      this.updateLocalStorage()
    },
    rotate(seats: Person[]): Person[] {
      const newSeats = seats
      const lastPerson = newSeats[newSeats.length - 1]
      for (let i = newSeats.length - 1; i > 1; i--) {
        newSeats[i] = newSeats[i - 1]
      }
      newSeats[1] = lastPerson
      return newSeats
    },
    createSet(seats: Person[], number: number): SetOfPairs {
      const set = {
        id: number,
        name: 'Set ' + (number + 1),
        pairs: [] as Pair[]
      } as SetOfPairs
      for (let i = 0; i < seats.length / 2; i++) {
        const pair = {
          person1: seats[i],
          person2: seats[seats.length - 1 - i]
        }
        set.pairs.push(pair)
      }
      return set
    }
    /*filterSets(sets: Sets, usedSets: Sets) {
      let acceptSet = true
      if (usedSets.length < 1) {
        return sets
      }
      const filteredSets = sets.filter((item) => {
        acceptSet = true
        item.pairs.forEach((item2) => {
          usedSets.forEach((item3) => {
            item3.pairs.forEach((item4) => {
              if (
                (item2.person1.id == item4.person1.id && item2.person2.id == item4.person2.id) ||
                (item2.person1.id == item4.person2.id && item2.person2.id == item4.person1.id)
              ) {
                acceptSet = false
              }
            })
          })
        })
        return acceptSet
      })
      return filteredSets
    }*/
  }
})
