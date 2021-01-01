const util      = require('util')
const exec      = util.promisify(require('child_process').exec)
const fs        = require('fs')
const path      = require('path')
const yaml      = require('js-yaml')

const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

const {
  issueReceiverCmd,
  recieverConfig
} = require('./helpers/receiver')

async function power(context, cmd) {
  let powerState = await recieverConfig()

  switch (cmd) {
    case 'on':
      if (powerState?.Power?.value === 'ON') {
        // reciever is on so just return status
        return Promise.resolve({
          status: 'ok'
        })
      } else {
        // power on reciever
        await issueReceiverCmd(config?.devices?.marantz?.buttons?.power?.on)
  
        // power on projector
        await exec(config?.commands?.tv?.on)
  
        return Promise.resolve({
          status: 'ok'
        })
      }
    case 'off':
      if (powerState?.Power?.value === 'ON') {
        // power off reciever
        await issueReceiverCmd(config?.devices?.marantz?.buttons?.power?.off)
  
        // power off projector
        try {
          await exec(`sleep 3 && ${config?.commands?.tv?.off} && sleep 2 && ${config?.commands?.tv?.off}`)
        } catch (e) {
          console.error(e)
        }

        return Promise.resolve({
          status: 'ok'
        })
      } else {
        // reciever is off so just return status
        return Promise.resolve({
          status: 'ok'
        })
      }
    case 'toggle':
      if (powerState?.Power?.value === 'ON') {
        // power off reciever
        await issueReceiverCmd(config?.devices?.marantz?.buttons?.power?.off)
  
        // power off projector
        await exec(`sleep 3 && ${config?.commands?.tv?.off} && sleep 2 && ${config?.commands?.tv?.off}`).catch((error) => {
          console.error(error)
        })
        
        return Promise.resolve({
          status: 'ok'
        })
      } else { 
        // power on reciever
        await issueReceiverCmd(config?.devices?.marantz?.buttons?.power?.on)
  
        // power on projector
        await exec(config?.commands?.tv?.on).catch((error) => {
          console.error(error)
        })

        return Promise.resolve({
          status: 'ok'
        })
      }
  }

  return Promise.resolve({
    status: 'error'
  })
}

module.exports = power
