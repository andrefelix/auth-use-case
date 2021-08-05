const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

function makeLoadUserByEmailRepository () {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'any_hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

function makeEncryptor () {
  class EncryptorSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encryptorSpy = new EncryptorSpy()
  encryptorSpy.isValid = true

  return encryptorSpy
}

function makeTokenGenerator () {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'

  return tokenGeneratorSpy
}

function makeSut () {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const encryptorSpy = makeEncryptor()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encryptor: encryptorSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return { sut, loadUserByEmailRepositorySpy, encryptorSpy, tokenGeneratorSpy }
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
    const sut = new AuthUseCase({
      loadUserByEmailRepository: {}
    })
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
    const { sut, encryptorSpy } = makeSut()
    encryptorSpy.isValid = false
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  it('should call Encryptor with correct values', async () => {
    const { sut, encryptorSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(encryptorSpy.password).toBe('any_password')
    expect(encryptorSpy.hashedPassword).toBeTruthy()
    expect(encryptorSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  it('should call TokenGenerator with correct userId', async () => {
    const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('should an accessToken if correct credentials are provided', async () => {
    const { sut } = makeSut()
    const accesToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(accesToken).toBeTruthy()
  })
})
