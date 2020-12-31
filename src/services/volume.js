const _         = require('lodash')
const util      = require('util')
const axios     = require('axios')
const fs        = require('fs')
const path      = require('path')
const yaml      = require('js-yaml')

const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

async function volume(context, cmd) {
  switch (cmd) {
    case 'mute':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.mute)
    case 'down':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.volDown)
    case 'preset':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.volPreset)
    case 'up':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.volUp)
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

module.exports = volume
