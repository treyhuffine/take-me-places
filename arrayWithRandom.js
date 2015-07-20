export default class ArrayWithRand extends Array {
  get sample() {
    return this[Math.floor(Math.random()*this.length)]
  }
}
