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

function makeLoadUserByEmailRepositoryWithError () {
  class LoadUserByEmailRepositorySpy {
    async load () {
      throw new Error()
    }
  }

  return new LoadUserByEmailRepositorySpy()
}

function makeUpdateAccessTokenRepository () {
  class UpdateAccessTokenRepositorySpy {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  return new UpdateAccessTokenRepositorySpy()
}

function makeUpdateAccessTokenRepositoryWithError () {
  class UpdateAccessTokenRepositorySpy {
    async update () {
      throw new Error()
    }
  }

  return new UpdateAccessTokenRepositorySpy()
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

function makeEncryptorWithError () {
  class EncryptorSpy {
    async compare () {
      throw new Error()
    }
  }

  return new EncryptorSpy()
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

function makeTokenGeneratorWithError () {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

function makeSut () {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const encryptorSpy = makeEncryptor()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encryptor: encryptorSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy, encryptorSpy, tokenGeneratorSpy }
}

describe('Auth Use Case', () => {
  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
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
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(accessToken).toBeTruthy()
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  describe('Throw Error', () => {
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

    it('should throw if no valid dependencies are provided', async () => {
      const allDependencies = {
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
        encryptor: makeEncryptor(),
        tokenGenerator: makeTokenGenerator()
      }

      const withoutLoadUserByEmailRepository = { ...allDependencies, loadUserByEmailRepository: null }
      const invalidLoadUserByEmailRepository = { ...allDependencies, loadUserByEmailRepository: {} }
      const withoutEncriptor = { ...allDependencies, encryptor: null }
      const invalidEncriptor = { ...allDependencies, encryptor: {} }
      const withoutTokenGenerator = { ...allDependencies, tokenGenerator: null }
      const invalidTokenGenerator = { ...allDependencies, tokenGenerator: {} }
      const withoutUpdateAccessTokenRepository = { ...allDependencies, updateAccessTokenRepository: null }
      const invalidUpdateAccessTokenRepository = { ...allDependencies, updateAccessTokenRepository: {} }

      const suts = [
        new AuthUseCase(),
        new AuthUseCase(withoutLoadUserByEmailRepository),
        new AuthUseCase(invalidLoadUserByEmailRepository),
        new AuthUseCase(withoutEncriptor),
        new AuthUseCase(invalidEncriptor),
        new AuthUseCase(withoutTokenGenerator),
        new AuthUseCase(invalidTokenGenerator),
        new AuthUseCase(withoutUpdateAccessTokenRepository),
        new AuthUseCase(invalidUpdateAccessTokenRepository)
      ]

      for (const sut of suts) {
        const promise = sut.auth('any_email@mail.com', 'any_password')
        await expect(promise).rejects.toThrow()
      }
    })

    it('should throw a Error if dependencies throw a Error', async () => {
      const allDependencies = {
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        updateAccessTokenRepository: makeUpdateAccessTokenRepository(),
        encryptor: makeEncryptor(),
        tokenGenerator: makeTokenGenerator()
      }

      const LoadUserByEmailRepositoryWithError = {
        ...allDependencies,
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
      }

      const EncriptorWithError = { ...allDependencies, encryptor: makeEncryptorWithError() }
      const TokenGeneratorWithError = { ...allDependencies, tokenGenerator: makeTokenGeneratorWithError() }

      const UpdateAccessTokenRepositoryWithError = {
        ...allDependencies,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError()
      }

      const suts = [
        new AuthUseCase(LoadUserByEmailRepositoryWithError),
        new AuthUseCase(EncriptorWithError),
        new AuthUseCase(TokenGeneratorWithError),
        new AuthUseCase(UpdateAccessTokenRepositoryWithError)
      ]

      for (const sut of suts) {
        const promise = sut.auth('any_email@mail.com', 'any_password')
        await expect(promise).rejects.toThrow()
      }
    })
  })
})
