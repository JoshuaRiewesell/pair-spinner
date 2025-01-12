import { defineStore } from 'pinia'

export const usePersonsStore = defineStore('persons', {
  state: (): Persons => ({
    persons: []
  }),
  actions: {
    loadFromLocalStorage() {
      const savedPersons = localStorage.getItem('persons')
      if (savedPersons) {
        this.persons = JSON.parse(savedPersons)
      }
    },
    updateLocalStorage() {
      localStorage.setItem('persons', JSON.stringify(this.persons))
    },
    addPerson(name: string, isStuff: boolean) {
      const newPerson: Person = {
        name,
        isStuff
      }
      this.persons.push(newPerson)
      this.updateLocalStorage()
    },
    removePerson(name: string) {
      const index = this.persons.findIndex((person) => person.name === name)
      if (index !== -1) {
        this.persons.splice(index, 1)
        this.updateLocalStorage()
      } else {
        console.error('Person with name ' + name + ' not found.')
      }
    },
    removeAllPersons() {
      this.persons = []
      localStorage.setItem('persons', JSON.stringify([]))
    }
  }
})
