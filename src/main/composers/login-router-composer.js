const LoginRouter = require('../../presentation/routers/loging-router')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const Encrypter = require('../../utils/encrypter')
const TokenGenerator = require('../../utils/token-generator')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/email-validator')
const env = require('../config/env')

module.exports = class LoginRouterComposer {
  static compose () {
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository: new LoadUserByEmailRepository(),
      updateAccessTokenRepository: new UpdateAccessTokenRepository(),
      encrypter: new Encrypter(),
      tokenGenerator: new TokenGenerator(env.tokenSecret)
    })

    const emailValidator = new EmailValidator()

    return new LoginRouter({ authUseCase, emailValidator })
  }
}
