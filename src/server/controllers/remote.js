const RemoteController = (() => {
  function RemoteController() {}

  RemoteController.prototype.power = (req, res) => {
    if (Object.keys(req.query).length === 0) res.sendStatus(400)
    for (const [key] of Object.entries(req.query)) {
      switch(key) {
        case 'on':
          res.json({route: 'power', status: 'on'})
          break
        case 'off':
          res.json({route: 'power', status: 'off'})
          break
        default:
          res.sendStatus(400)
      } 
    }
  }

  RemoteController.prototype.source = (req, res) => {

  }

  RemoteController.prototype.volume = (req, res) => {

  }

  return RemoteController
})()

module.exports = () => {
  return new RemoteController()
}