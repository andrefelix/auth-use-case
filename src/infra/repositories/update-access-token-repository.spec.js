const UpdateAccessTokenRepository = require('./update-access-token-repository')
const MongodbHelper = require('../helpers/mongodb-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

const COLLECTION_USERS = 'users'

let userModel = null

function makeSut () {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessToken Repository', () => {
  const fakeUser = {
    _id: 'any_id',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
    age: 32,
    state: 'any_state'
  }

  beforeAll(async () => {
    await MongodbHelper.connect(process.env.MONGO_URL)
    userModel = await MongodbHelper.getCollection(COLLECTION_USERS)

    await userModel.insertOne(fakeUser)
  })

  afterAll(async () => {
    await userModel.deleteOne({ _id: fakeUser._id })
    await MongodbHelper.disconnect()
  })

  it('should update the user with the given accessToken', async () => {
    const sut = makeSut()
    await sut.update(fakeUser._id, 'valid_accesToken')

    const user = await userModel.findOne({ _id: fakeUser._id })
    expect(user.accessToken).toBe('valid_accesToken')
  })

  it('should throw if parameters are not provided', async () => {
    const sut = makeSut()
    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    await expect(sut.update(fakeUser._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
