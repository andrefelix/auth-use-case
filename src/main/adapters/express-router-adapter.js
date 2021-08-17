module.exports = class ExpressRuterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }

      const httpResponse = await router.route(httpRequest)

      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
