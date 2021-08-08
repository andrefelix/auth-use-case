const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MongodbHelper = require('../helpers/mongodb-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

const COLLECTION_USERS = 'users'

let db = null

function makeSut () {
  const userModel = db.collection(COLLECTION_USERS)
  const sut = new LoadUserByEmailRepository(userModel)

  return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
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

  it('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  it('should return an user if user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load(fakeUser.email)

    expect(user).toEqual({ _id: fakeUser._id, password: fakeUser.password })
  })

  describe('Throw Errors', () => {
    it('should throw if userModel is not provided', async () => {
      const sut = new LoadUserByEmailRepository()
      const promise = sut.load('any_email@mail.com')
      await expect(promise).rejects.toThrow()
    })

    it('should throw if email is not provided', async () => {
      const { sut } = makeSut()
      const promise = sut.load()
      await expect(promise).rejects.toThrow(new MissingParamError('email'))
    })
  })
})
