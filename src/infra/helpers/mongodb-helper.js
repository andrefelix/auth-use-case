const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri) {
    this.uri = uri

    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    this.db = await this.connection.db()
  },

  async disconnect () {
    this.connection.close()
    this.connection = null
    this.db = null
  },

  async getCollection (collectionName) {
    if (!this.connection || !this.connection.isConnected()) {
      await this.connect(this.uri)
    }

    return this.db.collection(collectionName)
  }
}
