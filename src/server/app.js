const basicAuth = require('basic-auth')
const http      = require('http')
const fs        = require('fs')
const path      = require('path')
const util      = require('util')
const debug     = require('debug')('remote')
const express   = require('express')
const yaml      = require('js-yaml')
const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')
const exec      = util.promisify(require('child_process').exec)

const routes    = require('./routes')

debug('Config Loaded:', JSON.stringify(config, null, 2))

const app = express()
const server = http.createServer(app)
const basicAuthLogins = {admin : 'password'}

const basicAuthCheck = (req, res, next) => {
  let creds = basicAuth(req)
  // return res.status(401).send() unless creds and basicAuthLogins[creds.name] is creds.pass
  // req.context = {username: creds.name}
  next()
}

app.set('port', process.env.PORT || 3002)

app.use(basicAuthCheck)
app.use(express.json({limit: '300kb'}))
app.use(express.urlencoded({extended: false}))

routes(app)

server.listen(app.get('port'))
console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env)
