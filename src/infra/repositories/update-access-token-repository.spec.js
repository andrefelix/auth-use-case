const MongodbHelper = require('../helpers/mongodb-helper')

const COLLECTION_USERS = 'users'

let db = null

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    const query = { _id: userId }
    const updateDoc = { $set: { accessToken } }

    await this.userModel.updateOne(query, updateDoc)
  }
}

function makeSut () {
  const userModel = db.collection(COLLECTION_USERS)
  const sut = new UpdateAccessTokenRepository(userModel)

  return { sut, userModel }
}

describe('UpdateAccessToken Repository', () => {
  const fakeUser = {
    _id: 'some_user_id',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
    age: 32,
    state: 'any_state'
  }

  beforeAll(async () => {
    await MongodbHelper.connect(process.env.MONGO_URL)
    db = await MongodbHelper.getDB()
  })

  beforeEach(async () => {
    const userModel = db.collection(COLLECTION_USERS)
    userModel.insertOne(fakeUser)
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
})
