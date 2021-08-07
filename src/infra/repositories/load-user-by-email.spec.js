const { MongoClient } = require('mongodb')

const COLLECTION_USERS = 'users'

let connection = null
let db = null

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = this.userModel.findOne({ email })
    return user
  }
}

async function makeSut () {
  const mockUser = {
    _id: 'some_user_id',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
    age: 32,
    state: 'any_state'
  }

  const userModel = db.collection(COLLECTION_USERS)

  await userModel.insertOne(mockUser)

  const sut = new LoadUserByEmailRepository(userModel)

  return { sut, mockUser }
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
    const { sut } = await makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  it('should return an user if user is found', async () => {
    const { sut, mockUser } = await makeSut()
    const user = await sut.load(mockUser.email)
    expect(user).toEqual(mockUser)
  })
})
