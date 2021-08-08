module.exports = class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const query = { email }
    const requiredProps = { password: 1 }
    const user = this.userModel.findOne(query, { projection: requiredProps })

    return user
  }
}
