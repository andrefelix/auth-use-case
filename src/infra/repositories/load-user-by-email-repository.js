const MissingParamError = require('../../utils/errors/missing-param-error')
const MongodbHelper = require('../helpers/mongodb-helper')

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    const userModel = await MongodbHelper.getCollection('users')
    const query = { email }
    const requiredProps = { password: 1 }
    const user = await userModel.findOne(query, { projection: requiredProps })

    return user
  }
}
