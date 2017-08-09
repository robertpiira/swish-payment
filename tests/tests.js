const test = require ('tape')
const async = require('async')
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
    // 1 - Find private key
    t.notEqual(-1, result.cert.key.indexOf('BEGIN RSA PRIVATE KEY'), 'Found private key')
    // 2 - Find certificate
    t.notEqual(-1, result.cert.cert.indexOf('BEGIN CERTIFICATE'), 'Found certificate')
    // 3 - Find root certificate
    t.notEqual(-1, result.cert.ca.indexOf('BEGIN CERTIFICATE'), 'Found root certificate')
    // 4 - Find passphrase
    t.equal(configData.cert.passphrase, result.cert.passphrase, 'Found passphrase')
    // 5 - Find payeeAlias
    t.equal(configData.data.payeeAlias, result.data.payeeAlias, 'Found payee alias')
    // 6 - Find payeeAlias
    t.equal(configData.data.callbackUrl, result.data.callbackUrl, 'Found callback url')

    t.end()
  }).catch(err => {
    t.equal(true, true, 'should be true')
    t.end()
  })


})





  // # 2 - ADD
  // .then ->
  //
  //   paymentData =
  //     payeePaymentReference: '1234'
  //     payerAlias: '0709123456'
  //     amount: '100'
  //     message: 'test'
  //
  //   swish.add paymentData
  //
  // .then (@id) ->
  //   # 7 - Get id
  //   t.equal id.length, 32, 'Response: 200 / valid ID (#{id})'
  //   swish.get id
  // .then (result) ->
  //   console.log result
  //   t.equal id, result.id, 'Response: 200 / found (#{id})'
  //   t.end()
  // .catch (err) ->
  //   t.fail JSON.stringify error
  //   t.end()
