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
  it('should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
})
