const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest('email')
      }

      if (!password) {
        return HttpResponse.badRequest('password')
      }

      this.authUseCase.auth(email, password)

      return HttpResponse.unauthorizedError()
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') console.error(error)
      return HttpResponse.serverError()
    }
  }
}