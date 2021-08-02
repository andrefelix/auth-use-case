const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encryptor, tokenGenerator) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encryptor = encryptor
    this.tokenGenerator = tokenGenerator
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

    await this.tokenGenerator.generate(this.loadUserByEmailRepository.user.id)
  }
}
