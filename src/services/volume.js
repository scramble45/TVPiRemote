const fs        = require('fs')
const path      = require('path')
const yaml      = require('js-yaml')

const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

const {
  issueReceiverCmd,
  recieverConfig
} = require('./helpers/receiver')

async function volume(context, cmd, query) {

  let volumeSettings = await recieverConfig()
  let volumeLevel = volumeSettings?.MasterVolume?.value
  let volumePreset = query?.set || config?.devices?.marantz?.defaultVolume

  switch (cmd) {
    case 'mute':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.mute, {volumeLevel: volumeLevel})
    case 'down':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.volDown, {volumeLevel: volumeLevel})
    case 'preset':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.volPreset, {volumeLevel: volumeLevel, volumePreset: volumePreset})
    case 'up':
      return await issueReceiverCmd(config?.devices?.marantz?.buttons?.volUp, {volumeLevel: volumeLevel})
  }
}

module.exports = volume
