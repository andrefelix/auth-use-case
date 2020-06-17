class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email || !password) {
      return HttpResponse.badRequest()
    }
  }
}

class HttpResponse {
  static badRequest () {
    return {
      statusCode: 400
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}

describe('Login Router', () => {
  it('Should return 400 if no email is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: { password: 'any_password' }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('Should return 400 if no password is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: { email: 'any_email@mail.com' }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('Should return 500 if httpRequest is not provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if body is not provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
