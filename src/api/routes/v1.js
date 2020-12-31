const _      = require("lodash")
const router = require("express").Router()
const wrap   = require("../async_wrapper")

const {
  power,
  volume,
  source
} = require("../../services")

router.get("/power/:cmd", wrap(async function powerHandler(req, res) {
  let result = await power(req.context, req.params.cmd)
  return res.json(result)
}))

router.get("/volume/:cmd", wrap(async function volumeHandler(req, res) {
  let result = await volume(req.context, req.params.cmd, req.query)
  return res.json(result)
}))

router.get("/source/:cmd", wrap(async function sourceHandler(req, res) {
  let result = await source(req.context, req.params.cmd)
  return res.json(result)
}))

module.exports = router
