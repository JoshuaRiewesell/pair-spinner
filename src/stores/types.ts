interface Sets {
  id: Number
  sets: SetOfPairs[]
}

interface SetOfPairs {
  id: Number
  name: String
  pairs: Pair[]
}

interface Pair {
  person1: Person
  person2: Person
}

interface Persons {
  persons: Person[]
}

interface Person {
  name: string
  isStuff: boolean
}

interface View {
  setOfPairs: SetOfPairs
  isVisible: Boolean
}
