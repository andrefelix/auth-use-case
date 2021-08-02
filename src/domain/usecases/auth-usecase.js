const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encryptor) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encryptor = encryptor
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepository.load(email)
    const isValid = user && await this.encryptor.compare(password, user.password)

    if (!isValid) {
      return null
    }
  }
}
