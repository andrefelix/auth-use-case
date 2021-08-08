const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    const query = { _id: userId }
    const updateDoc = { $set: { accessToken } }

    await this.userModel.updateOne(query, updateDoc)
  }
}
