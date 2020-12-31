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