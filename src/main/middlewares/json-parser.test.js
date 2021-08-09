const app = require('../config/app')
const request = require('supertest')

describe('JSON Parser Middleware', () => {
  it('should parse body as JSON', async () => {
    app.post('/test_json_parser', (req, res) => { res.send(req.body) })

    await request(app)
      .post('/test_json_parser')
      .send({ test: 'test' })
      .expect({ test: 'test' })
  })
})
