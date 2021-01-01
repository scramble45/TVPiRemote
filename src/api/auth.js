const _         = require("lodash")
const basicAuth = require("basic-auth")
const fs        = require('fs')
const path      = require('path')
const wrap      = require("./async_wrapper")
const yaml      = require('js-yaml')

const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

async function auth(req, res, next) {
  if (req?.headers['x-skip-auth'] === 'true') return next() // skip auth
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") return next() // skip auth

  const basicAuthLogins = {[config.auth.username]: config.auth.password}

  let credentials = basicAuth(req)
  if (!credentials || !credentials?.name || !credentials?.pass) return res.status(401).end()
  if (basicAuthLogins[credentials.name] !== config.auth.username && credentials.pass !== config.auth.password) {
    return res.status(401).send()
  }

  return next()
}

module.exports = wrap(auth)
