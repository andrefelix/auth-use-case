const loginRouter = require('../composers/login-router-composer')
const ExpressRuterAdapter = require('../adapters/express-router-adapter')

module.exports = router => {
  router.post('/login', ExpressRuterAdapter.adapt(loginRouter))
}
