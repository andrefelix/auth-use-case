const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, updateAccessTokenRepository, encryptor, tokenGenerator } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
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
    const isValid = !!user && await this.encryptor.compare(password, user.password)

    if (!isValid) {
      return null
    }

    const accessToken = await this.tokenGenerator.generate(this.loadUserByEmailRepository.user.id)

    await this.updateAccessTokenRepository.update(user.id, accessToken)

    return accessToken
  }
}
