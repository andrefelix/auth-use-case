jest.mock('bcrypt', () => ({
  isValid: true,
  value: '',
  hashValue: '',

  async compare (value, hashValue) {
    this.value = value
    this.hashValue = hashValue
    return this.isValid
  }
}))

const Encrypter = require('./encrypter')
const bcrypt = require('bcrypt')
const { MissingParamError } = require('./errors')

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

  it('should throw if no correct params is provided', async () => {
    const sut = makeSut()
    const promiseWithoutValue = sut.compare()
    const promiseWithoutHashValue = sut.compare('any_value')
    await expect(promiseWithoutValue).rejects.toThrow(new MissingParamError('value'))
    await expect(promiseWithoutHashValue).rejects.toThrow(new MissingParamError('hashValue'))
  })
})
