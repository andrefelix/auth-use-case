const express = require('express')
const app = express()
const setup = require('./setup')
const routes = require('../config/routes')

setup(app)
routes(app)

module.exports = app
