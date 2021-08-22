const MongodbHelper = require('../infra/helpers/mongodb-helper')
const env = require('./config/env')

MongodbHelper
  .connect(env.mongoUrl)
  .then(() => {
    const app = require('./config/app')
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
