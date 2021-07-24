const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  async auth (email, password) {
    if (!email || !password) {
      const missingParam = !email ? 'email' : 'password'
      throw new MissingParamError(missingParam)
    }
  }
}
