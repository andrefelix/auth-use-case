const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    return jwt.sign(id, 'secret')
  }
}

function makeSut () {
  return new TokenGenerator()
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
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe('secret')
  })
})
