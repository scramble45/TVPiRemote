const _         = require('lodash')
const util      = require('util')
const axios     = require('axios')
const fs        = require('fs')
const path      = require('path')
const yaml      = require('js-yaml')

const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

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

async function issueReceiverCmd(cmd) {
  try {
    let response = await axios({
      method: 'get',
      url: `http://${config?.devices?.marantz?.server}/MainZone/index.put.asp?cmd0=${cmd}`
    })
    
    if (response.status === 200){
      return Promise.resolve({
        status: 'ok'
      })
    } else {
      return Promise.resolve({
        status: 'error'
      })
    }

  } catch (err) {
    throw new Error(err.message)
  }
}


module.exports = source
