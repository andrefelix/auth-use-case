const MissingParamError = require('../../utils/errors/missing-param-error')
const MongodbHelper = require('../helpers/mongodb-helper')

module.exports = class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    const userModel = await MongodbHelper.getCollection('users')
    const query = { _id: userId }
    const updateDoc = { $set: { accessToken } }

    await userModel.updateOne(query, updateDoc)
  }
}
