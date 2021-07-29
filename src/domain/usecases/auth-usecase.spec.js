const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

function makeSut () {
  const sut = new AuthUseCase()

  return { sut }
}

describe('Auth Use Case', () => {
  it('should throw Error if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should throw Error if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
