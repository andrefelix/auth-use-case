const bcrypt = require('bcrypt')
const { MissingParamError } = require('./errors')

module.exports = class Encrypter {
  async compare (value, hashValue) {
    if (!value) {
      throw new MissingParamError('value')
    }

    if (!hashValue) {
      throw new MissingParamError('hashValue')
    }

    const isValid = await bcrypt.compare(value, hashValue)
    return isValid
  }
}
