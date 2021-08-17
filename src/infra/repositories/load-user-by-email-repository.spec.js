const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MongodbHelper = require('../helpers/mongodb-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

const COLLECTION_USERS = 'users'

let userModel = null

function makeSut () {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
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

  it('should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  it('should return an user if user is found', async () => {
    const sut = makeSut()
    const user = await sut.load(fakeUser.email)

    expect(user).toEqual({ _id: fakeUser._id, password: fakeUser.password })
  })

  it('should throw if email is not provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
