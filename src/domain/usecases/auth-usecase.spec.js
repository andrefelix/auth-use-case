const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

class LoadUserByEmailRepositorySpy {
  async load (email) {
    this.email = email
    return this.user
  }
}

function makeLoadUserByEmailRepository () {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {}

  return loadUserByEmailRepositorySpy
}

function makeSut () {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return { sut, loadUserByEmailRepositorySpy }
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
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  it('should trown if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  it('should trown if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  it('should return null if no valid email has provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  it('should return null if no valid password has provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
})
