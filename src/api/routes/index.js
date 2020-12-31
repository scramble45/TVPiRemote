const router = require('express').Router()

router.get('/', function(req, res, next) {
  res.send('Something should be here')
})

router.use('/', require('./v1'))
router.use('/v1', require('./v1'))

module.exports = router
