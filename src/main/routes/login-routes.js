const loginRouter = require('../composer/login-router-composer')

module.exports = router => {
  router.post('/login', loginRouter)
}
