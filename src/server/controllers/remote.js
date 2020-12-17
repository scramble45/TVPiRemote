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
    if (Object.keys(req.query).length === 0) res.sendStatus(400)
    for (const [key] of Object.entries(req.query)) {
      switch(key) {
        case 'aux2':
          res.json({route: 'source', source: 'aux2'})
          break
        case 'bluray':
          res.json({route: 'source', source: 'bluray'})
          break
        case 'game':
          res.json({route: 'source', source: 'game'})
          break
        case 'media':
          res.json({route: 'source', source: 'media'})
          break
        default:
          res.sendStatus(400)
      } 
    }
  }

  RemoteController.prototype.volume = (req, res) => {
    if (Object.keys(req.query).length === 0) res.sendStatus(400)
    for (const [key, value] of Object.entries(req.query)) {
      switch(key) {
        case 'mute':
          res.json({route: 'volume', button: 'mute'})
          break
        case 'up':
          res.json({route: 'volume', button: 'up'})
          break
        case 'down':
          res.json({route: 'volume', button: 'down'})
          break
        case 'set':
          res.json({route: 'volume', button: 'set', level: value})
          break
        default:
          res.sendStatus(400)
      } 
    }
  }

  return RemoteController
})()

module.exports = () => {
  return new RemoteController()
}