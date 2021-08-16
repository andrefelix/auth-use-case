const LoginRouter = require('./loging-router')
const { UnauthorizedError, ServerError } = require('../errors')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

const makeAuthuseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'

  return authUseCaseSpy
}

const makeAuthuseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true

  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

const makeSut = () => {
  const authUseCaseSpy = makeAuthuseCase()
  const emailValidatorSpy = makeEmailValidator()

  const sut = new LoginRouter({ authUseCase: authUseCaseSpy, emailValidator: emailValidatorSpy })

  return { sut, authUseCaseSpy, emailValidatorSpy }
}

describe('Login Router', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { password: 'any_password' }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'any_email@mail.com' }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 if httpRequest is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if body is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password@mail.com'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut } = makeSut()
    sut.authUseCase.accessToken = null

    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password@mail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password@mail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: { email: 'invalid_email@mail.com', password: 'any_password' }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password@mail.com'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  describe('Server Error', () => {
    it('should throw Server Error if no valid dependencies are provided', async () => {
      const { authUseCaseSpy, emailValidatorSpy } = makeSut()

      const allDependencies = { authUseCase: authUseCaseSpy, emailValidator: emailValidatorSpy }

      const withoutAuthUseCase = { ...allDependencies, authUseCase: null }
      const invalidAuthUseCase = { ...allDependencies, authUseCase: {} }
      const withoutEmailValidator = { ...allDependencies, emailValidator: null }
      const invalidEmailValidator = { ...allDependencies, emailValidator: {} }

      const suts = [
        new LoginRouter(),
        new LoginRouter(withoutAuthUseCase),
        new LoginRouter(invalidAuthUseCase),
        new LoginRouter(withoutEmailValidator),
        new LoginRouter(invalidEmailValidator)
      ]

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password@mail.com'
        }
      }

      for (const sut of suts) {
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
      }
    })

    it('should throw Server Error if dependencies throw a Error', async () => {
      const { authUseCaseSpy, emailValidatorSpy } = makeSut()

      const allDependencies = { authUseCase: authUseCaseSpy, emailValidator: emailValidatorSpy }

      const authUseCaseWithError = { ...allDependencies, authUseCase: makeAuthuseCaseWithError() }
      const emailValidatorWithError = { ...allDependencies, emailValidator: makeEmailValidatorWithError() }

      const suts = [
        new LoginRouter(authUseCaseWithError),
        new LoginRouter(emailValidatorWithError)
      ]

      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password@mail.com'
        }
      }

      for (const sut of suts) {
        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
      }
    })
  })
})
