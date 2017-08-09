const test = require ('tape')
const swish = require('../dist/swish')

test('Successful flow (init -> add -> get)', t => {

  const configData = {
    cert: {
      key: './fixtures/swish.key',
      cert: './fixtures/swish.crt',
      ca: './fixtures/swish.txt',
      passphrase: 'swish',
    },
    data: {
      payeeAlias: '1231181189',
      callbackUrl: 'https://www.test.se'
    }
  }

  swish.init(configData).then(result => {
    t.notEqual(-1, result.cert.key.indexOf('BEGIN RSA PRIVATE KEY'), 'Found private key')
    t.notEqual(-1, result.cert.cert.indexOf('BEGIN CERTIFICATE'), 'Found certificate')
    t.notEqual(-1, result.cert.ca.indexOf('BEGIN CERTIFICATE'), 'Found root certificate')
    t.equal(configData.cert.passphrase, result.cert.passphrase, 'Found passphrase')
    t.equal(configData.data.payeeAlias, result.data.payeeAlias, 'Found payee alias')
    t.equal(configData.data.callbackUrl, result.data.callbackUrl, 'Found callback url')

    t.end()
  })

  swish.add({
    payeePaymentReference: 'snus123',
    payerAlias: '0706123456',
    amount: '100',
    message: 'Prima snus'
  })
  .then(id => {
    t.equal(id.length, 32, 'Response: 200 / valid ID (#{id})')
    return swish.get(id)
  })
  .then(result => {
    t.equal(id, result.id, 'Response: 200 / found (#{id})')
    t.end()
  })
  .catch(err => {
    t.fail(JSON.stringify(error))
    t.end()
  })

})
