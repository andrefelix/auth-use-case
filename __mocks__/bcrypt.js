module.exports = {
  isValid: true,
  value: '',
  hashValue: '',

  async compare (value, hashValue) {
    this.value = value
    this.hashValue = hashValue
    return this.isValid
  }
}
