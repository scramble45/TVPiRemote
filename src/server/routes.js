const Controllers = require('./controllers')

module.exports = (app) => {
  app.get('/power', (req, res) => {
    return Controllers.Remote().power(req, res)
  })

  app.get('/volume', (req, res) => {
    return Controllers.Remote().volume(req, res)
  })

  app.get('/source', (req, res) => {
    return Controllers.Remote().source(req, res)
  })
}
