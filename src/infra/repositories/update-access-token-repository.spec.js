const UpdateAccessTokenRepository = require('./update-access-token-repository')
const MongodbHelper = require('../helpers/mongodb-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

const COLLECTION_USERS = 'users'

let db = null

function makeSut () {
  const userModel = db.collection(COLLECTION_USERS)
  return new UpdateAccessTokenRepository(userModel)
}

describe('UpdateAccessToken Repository', () => {
  let fakeUser = null

  beforeAll(async () => {
    await MongodbHelper.connect(process.env.MONGO_URL)
    db = await MongodbHelper.getDB()

    const result = await db.collection(COLLECTION_USERS).insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      age: 32,
      state: 'any_state'
    })

    fakeUser = result.ops[0]
  })

  afterAll(async () => {
    await db.collection(COLLECTION_USERS).deleteOne({ _id: fakeUser._id })
    await MongodbHelper.disconnect()
  })

  it('should update the user with the given accessToken', async () => {
    const sut = makeSut()
    await sut.update(fakeUser._id, 'valid_accesToken')

    const user = await sut.userModel.findOne({ _id: fakeUser._id })
    expect(user.accessToken).toBe('valid_accesToken')
  })

  describe('Throw Error', () => {
    it('should throw if userModel is not provided', async () => {
      const sut = new UpdateAccessTokenRepository()
      const promise = sut.update(fakeUser._id, 'valid_accessToken')
      await expect(promise).rejects.toThrow()
    })

    it('should throw if parameters are not provided', async () => {
      const sut = makeSut()
      await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
      await expect(sut.update(fakeUser._id)).rejects.toThrow(new MissingParamError('accessToken'))
    })
  })
})
