const MongodbHelper = require('./mongodb-helper')

describe('MongoDb Helper', () => {
  afterAll(async () => {
    await MongodbHelper.disconnect()
  })

  it('should reconnect when getCollection() is invoked and client is disconnect', async () => {
    const sut = MongodbHelper

    await sut.connect(process.env.MONGO_URL)
    expect(sut.db).toBeTruthy()

    await sut.disconnect()
    expect(sut.db).toBeNull()

    const userModel = await sut.getCollection('users')
    expect(userModel).toBeTruthy()
  })
})
