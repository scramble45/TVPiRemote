const fs        = require('fs')
const path      = require('path')
const yaml      = require('js-yaml')

const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

const {
  issueReceiverCmd,
} = require('./helpers/receiver')

async function source(context, cmd) {
  switch (cmd) {
    case 'aux2':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.aux2)
    case 'bluray':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.bluray)
    case 'game':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.game)
    case 'media':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.media)
  }
}

module.exports = source
