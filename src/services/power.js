const _         = require('lodash')
const util      = require('util')
const exec      = util.promisify(require('child_process').exec)
const axios     = require('axios')
const fs        = require('fs')
const path      = require('path')
const xml2js    = require('xml2js')
const yaml      = require('js-yaml')

const configSrc = path.join(__dirname, '../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

const {
  NotFoundError
} = require('../errors')

async function power(context, cmd) {
  let powerState = await getPowerState()

  switch (cmd) {
    case 'on':
      if (powerState) {
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
      if (powerState) {
        // power off reciever
        await issueReceiverCmd(config?.devices?.marantz?.buttons?.power?.off)
  
        // power off projector
        await exec(`sleep 3 && ${config?.commands?.tv?.off} && sleep 2 && ${config?.commands?.tv?.off}`)
  
        return Promise.resolve({
          status: 'ok'
        })
      } else {
        // reciever is off so just return status
        return Promise.resolve({
          status: 'ok'
        })
      }
  }

  return Promise.resolve({
    status: 'error'
  })
}

async function issueReceiverCmd(cmd) {
  try {
    let response = await axios({
      method: 'get',
      url: `http://${config?.devices?.marantz?.server}/MainZone/index.put.asp?cmd0=${cmd}`
    })
    
    if (response.status === 200){
      return {
        status: 'ok'
      }
    } else {
      return {
        status: 'error'
      }
    }

  } catch (err) {
    throw new Error(err.message)
  }
}

async function getPowerState(cmd) {
  try {
    let response = await axios({
      method: 'get',
      url: `http://${config?.devices?.marantz?.server}/goform/formMainZone_MainZoneXml.xml`
    })
    
    const parser = new xml2js.Parser({
      explicitArray: false,
      strict: true
    })

    responseData = response?.data
    if (!responseData) return Promise.reject(new NotFoundError(`Unable to get reciever data: ${response.status}`))
    const result = await util.promisify(parser.parseString.bind(parser))(responseData)

    if (!result?.item?.Power?.value) return false
    switch (result?.item?.Power?.value) {
      case 'ON':
        return true
      // case 'OFF': // should never get here and hit default
      //   console.log('Reciever is currently OFF')
      //   return false
      default:
        return false
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = power
