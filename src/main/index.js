const MongodbHelper = require('../infra/helpers/mongodb-helper')
const env = require('./config/env')

MongodbHelper
  .connect(env.mongoUrl)
  .then(() => {
    const app = require('./config/app')
    app.listen(5858, () => console.log('Server running'))
  })
  .catch(console.error)
