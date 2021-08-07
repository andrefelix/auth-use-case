const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
  async load () {
    return null
  }
}

describe('LoadUserByEmail Repository', () => {
  let connection
  let db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    await db.collection('COLLECTION_NAME').deleteMany({})
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should retrn null if no user is found', async () => {
    const sut = new LoadUserByEmailRepository()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })
})
