const AuthUseCase = require('./auth-usecase')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class LoadUserByEmailRepositorySpy {
  async load (email) {
    this.email = email
  }
}

function makeSut () {
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepository)

  return { sut, loadUserByEmailRepository }
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

  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepository.email).toBe('any_email@mail.com')
  })

  it('should trown if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password')
    await expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  it('should trown if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    await expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })
})
