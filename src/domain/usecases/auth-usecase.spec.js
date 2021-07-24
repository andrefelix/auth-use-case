const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email || !password) {
      const missingParam = !email ? 'email' : 'password'
      throw new MissingParamError(missingParam)
    }
  }
}

function makeSut () {
  return new AuthUseCase()
}

describe('Auth Use Case', () => {
  it('should throw Error if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should throw Error if no password is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth('any_email@mail.com')
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
