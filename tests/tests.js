const test = require ('tape')
const swish = require('../dist/swish')

test('Successful flow (init -> add -> get)', t => {

  const configData = {
    isTestEnv: true,
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
  })

  swish.add({
    payeePaymentReference: 'snus123',
    payerAlias: '0706123456',
    amount: '100',
    message: 'Prima snus'
  })
  .then(({swishId}) => {
    t.equal(swishId.length, 32, `Response: 200 / valid ID (${swishId})`)

    swish.get(swishId).then(result => {
      t.equal(swishId, result.id, `Valid ID (${swishId})`)
      t.equal(result.status, 'CREATED', 'Status: CREATED')
      t.equal(result.payeePaymentReference, 'snus123', 'payeePaymentReference')
      t.equal(result.paymentReference, null, 'paymentReference')
      t.equal(result.errorMessage, null, 'errorMessage')
      t.equal(result.errorCode, null, 'errorCode')
      t.equal(result.callbackUrl, 'https://www.test.se', 'callbackUrl')
      t.equal(result.payerAlias, '0706123456', 'payerAlias')
      t.equal(result.payeeAlias, '1231181189', 'payeeAlias')
      t.equal(result.amount, 100, 'amount')
      t.equal(result.message, 'Prima snus', 'message')
      t.equal(!!result.dateCreated, true, 'dateCreated')
      t.equal(result.datePaid, null, 'datePaid')
      t.equal(result.currency, 'SEK', 'currency')
      t.end()
    })
    .catch(err => {
      t.fail(JSON.stringify(error))
      t.end()
    })
  })


})
