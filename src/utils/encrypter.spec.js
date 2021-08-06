const bcrypt = require('bcrypt')
class Encrypter {
  async compare (value, hashValue) {
    const isValid = await bcrypt.compare(value, hashValue)
    return isValid
  }
}

function makeSut () {
  return new Encrypter()
}

describe('Encrypter', () => {
  beforeEach(() => {
    bcrypt.isValid = true
    bcrypt.value = ''
    bcrypt.hashValue = ''
  })

  it('should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  it('should return false if bcrypt returns false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hashValue).toBe('any_hash')
  })
})
