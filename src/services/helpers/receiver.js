const fs        = require('fs')
const axios     = require('axios')
const util      = require('util')
const path      = require('path')
const xml2js    = require('xml2js')
const yaml      = require('js-yaml')
const configSrc = path.join(__dirname, '../../../config.yml')
const config    = yaml.safeLoad(fs.readFileSync(configSrc), 'utf8')

const {
  NotFoundError
} = require('../../errors')

async function issueReceiverCmd(cmd, options) {
  try {
    let result = {}

    if (options?.volumeLevel) {
      result.level = options.volumeLevel
    }

    if (options?.volumePreset) {
      result.preset = options.volumePreset
      cmd = cmd + result.preset
    }

    let opts = {
      method: 'get',
      url: `http://${config?.devices?.marantz?.server}/MainZone/index.put.asp?cmd0=${cmd}`
    }

    let response = await axios(opts)
    
    if (response.status === 200){
      result.status = 'ok'
      return Promise.resolve(result)
    } else {
      result.status = 'error'
      return Promise.resolve(result)
    }

  } catch (err) {
    throw new Error(err.message)
  }
}

async function recieverConfig() {
  try {
    let response = await axios({
      method: 'get',
      url: `http://${config?.devices?.marantz?.server}/goform/formMainZone_MainZoneXml.xml`
    })
    
    const parser = new xml2js.Parser({
      explicitArray: false,
      strict: true
    })

    if (!response?.data) return Promise.reject(new NotFoundError(`Unable to get reciever data: ${response.status}`))
    let recieverConfig = await util.promisify(parser.parseString.bind(parser))(response.data)
    return recieverConfig.item

  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = {
  issueReceiverCmd: issueReceiverCmd,
  recieverConfig: recieverConfig
}