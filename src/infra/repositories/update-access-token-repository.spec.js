const UpdateAccessTokenRepository = require('./update-access-token-repository')
const MongodbHelper = require('../helpers/mongodb-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

const COLLECTION_USERS = 'users'

let db = null

function makeSut () {
  const userModel = db.collection(COLLECTION_USERS)
  const sut = new UpdateAccessTokenRepository(userModel)

  return { sut, userModel }
}

describe('UpdateAccessToken Repository', () => {
  let fakeUser = null

  beforeAll(async () => {
    await MongodbHelper.connect(process.env.MONGO_URL)
    db = await MongodbHelper.getDB()
  })

  beforeEach(async () => {
    const userModel = db.collection(COLLECTION_USERS)
    const result = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      age: 32,
      state: 'any_state'
    })

    fakeUser = result.ops[0]
  })

  afterEach(async () => {
    await db.collection(COLLECTION_USERS).deleteMany({})
  })

  afterAll(async () => {
    await MongodbHelper.disconnect()
  })

  it('should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut()
    await sut.update(fakeUser._id, 'valid_accesToken')

    const user = await userModel.findOne({ _id: fakeUser._id })
    expect(user.accessToken).toBe('valid_accesToken')
  })

  describe('Throw Error', () => {
    it('should throw if userModel is not provided', async () => {
      const sut = new UpdateAccessTokenRepository()
      const promise = sut.update(fakeUser._id, 'valid_accessToken')
      await expect(promise).rejects.toThrow()
    })

    it('should throw if parameters are not provided', async () => {
      const { sut } = makeSut()
      await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
      await expect(sut.update(fakeUser._id)).rejects.toThrow(new MissingParamError('accessToken'))
    })
  })
})
