jest.mock('jsonwebtoken', () => ({
  token: 'any_token',
  id: '',
  secret: '',

  sign (payload, secret) {
    this.payload = payload
    this.secret = secret
    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const { MissingParamError } = require('./errors')
const TokenGenerator = require('./token-generator')

function makeSut () {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  beforeEach(() => {
    jwt.token = 'any_token'
    jwt.id = ''
    jwt.secret = ''
  })

  it('should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  it('should return a token if JWT returns token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  it('should call JWT with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.payload).toEqual({ _id: 'any_id' })
    expect(jwt.secret).toBe(sut.secret)
  })

  it('should throw if no secret is provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    await expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  it('should throw if no id is provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
