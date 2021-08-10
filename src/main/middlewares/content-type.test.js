const app = require('../config/app')
const request = require('supertest')

describe('Content Type Middleware', () => {
  it('should return json content-type as default', async () => {
    app.post('/test_content_type', (req, res) => { res.send('') })

    await request(app)
      .post('/test_content_type')
      .expect('content-type', /json/)
  })
})
