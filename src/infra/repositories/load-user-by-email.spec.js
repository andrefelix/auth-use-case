const { MongoClient } = require('mongodb')

const COLLECTION_USERS = 'users'

let connection = null
let db = null

class LoadUserByEmailRepository {
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

function makeSut () {
  const userModel = db.collection(COLLECTION_USERS)
  const sut = new LoadUserByEmailRepository(userModel)

  return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    await db.collection(COLLECTION_USERS).deleteMany({})
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  it('should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()

    const fakeUser = {
      _id: 'some_user_id',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      age: 32,
      state: 'any_state'
    }

    await userModel.insertOne(fakeUser)

    const user = await sut.load(fakeUser.email)

    expect(user).toEqual({ _id: fakeUser._id, password: fakeUser.password })
  })
})
