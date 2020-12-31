const express   = require("express")
const helmet    = require("helmet")
const path      = require('path')
const yaml      = require('js-yaml')
const fs        = require('fs')
const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

const {
  AuthenticationError,
  ValidationError,
  NotFoundError
} = require("../errors")

const app = express()

app.enable("trust proxy") // enables reverse proxy support; req.ip == upstream remote addr.
app.use(helmet.xssFilter())
app.use(helmet.frameguard("deny"))
app.use(helmet.hidePoweredBy())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.hsts({
  maxAge: 10886400000, // Must be at least 18 weeks to be approved by Google
  preload: true
}))

app.use(function enforceSSL(req, res, next) {
  if (process.env.NODE_ENV !== "production") return next()
  if (req.headers["x-forwarded-proto"] === "https") return next()
  res.redirect(301, `https://${req.get("host")}${req.originalUrl}`)
})

app.use("/", express.static(path.join(__dirname, "../../public")))
app.use(require("./auth"))
app.use(express.json({limit: "900kb"}))
app.use("/", require("./routes"))

// Route all other 404 requests to error handler
app.use(function(req, res, next) {
  return next(new NotFoundError(`Cannot ${req.method} ${req.url}`))
})

// Mount error handler to log errors
app.use(function(err, req, res, next) {
  if (!err) return next()

  if (err instanceof AuthenticationError) {
    return res.status(401).send({status: "error", errorType: "authentication", errors: err.errors})
  }

  if (err instanceof ValidationError) {
    return res.status(400).send({status: "error", errorType: "validation", errors: err.errors})
  }

  if (err instanceof NotFoundError) {
    return res.status(404).send({status: "error", errorType: "not-found", errors: err.errors, error: err.error})
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).send({status: "error", errorType: "validation", errors: [err.message]})
  }

  if (err.code === "ECONNABORTED") {
    return res.status(408).send({status: "error", errorType: "external", errors: ["Timeout exceeded"]})
  }

  if (["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT"].indexOf(err.code) !== -1) {
    req.log.error(err)
    return res.status(503).send({status: "error", errorType: "external", errors: [err.message]})
  }

  console.error(err)
  req.log.error(err)
  return res.status(500).send({status: "error", errorType: "internal", errors: ["Internal server error"]})
})

// log unhandled promise rejections
process.on("unhandledRejection", function (err, p) {
  console.error(err, `UnhandledRejection: ${err.message}`)
  process.exit(1)
})

process.on("uncaughtException", function(err) {
  console.error(err, `UncaughtException: ${err.message}`)
  process.exit(1)
})

process.on("uncaughtExceptionMonitor", function(err) {
  console.error(err, `UncaughtExceptionMonitor: ${err.message}`)
  process.exit(1)
})

// Start the server if it is the top level module
if (!module.parent) {
  (async () => {
    let server = app.listen(process.env.PORT || config?.express?.port)
    server.once("listening", function () {
      let host = server.address() || {}
      console.log({address: host.address, port: host.port, env: process.env.NODE_ENV || "development"}, 'Server listening')
    })
  })()
}

module.exports = app
