const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    const query = { email }
    const requiredProps = { password: 1 }
    const user = this.userModel.findOne(query, { projection: requiredProps })

    return user
  }
}
