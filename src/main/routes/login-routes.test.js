const request = require('supertest')
const app = require('../config/app')
const MongodbHelper = require('../../infra/helpers/mongodb-helper')
const bcrypt = require('bcrypt')

const COLLECTION_USERS = 'users'

const fakeUser = {
  _id: 'any_id',
  email: 'valid_email@mail.com',
  password: 'hashed_password',
  age: 32,
  state: 'any_state'
}

let userModel = null

describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongodbHelper.connect(process.env.MONGO_URL)
    userModel = await MongodbHelper.getCollection(COLLECTION_USERS)
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await userModel.deleteOne({ _id: fakeUser._id })
    await MongodbHelper.disconnect()
  })

  it('should return 200 when valid credentials are provided', async () => {
    await userModel.insertOne({
      email: fakeUser.email,
      password: bcrypt.hashSync(fakeUser.password, 10)
    })

    await request(app)
      .post('/api/login')
      .send({
        email: fakeUser.email,
        password: fakeUser.password
      })
      .expect(200)
  })
})
