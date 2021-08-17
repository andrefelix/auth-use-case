const MissingParamError = require('../../utils/errors/missing-param-error')
const MongodbHelper = require('../helpers/mongodb-helper')

module.exports = class LoadUserByEmailRepository {
  async load (email) {
    if (!email) {
      throw new MissingParamError('email')
    }

    const db = await MongodbHelper.getDB()
    const query = { email }
    const requiredProps = { password: 1 }
    const user = await db.collection('users').findOne(query, { projection: requiredProps })

    return user
  }
}
