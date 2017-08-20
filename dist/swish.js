var Promise, R, config, fs, request, urls, testUrls;

Promise = require("promise");

request = require("request");

R = require('ramda');

fs = require("fs");

testUrls = {
  payment: "https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1/paymentrequests/",
  refund: "https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1/refunds/"
};

urls = {
  payment: "https://swicpc.bankgirot.se/swish-cpcapi/api/v1/paymentrequests/",
  refund: "https://swicpc.bankgirot.se/swish-cpcapi/api/v1/refunds/"
};

config = null;

var getUrls = function (isTestEnv) {
  if (isTestEnv) {
    return testUrls
  } else {
    return urls
  }
}

exports.init = (function(_this) {
  return function(data) {

    return new Promise(function(resolve, reject) {


      return resolve(config = {
        isTestEnv: data.isTestEnv,
        cert: {
          key: fs.readFileSync(data.cert.key, 'ascii'),
          cert: fs.readFileSync(data.cert.cert, 'ascii'),
          ca: fs.readFileSync(data.cert.ca, 'ascii'),
          passphrase: data.cert.passphrase
        },
        data: {
          payeeAlias: data.data.payeeAlias,
          currency: (data.data != null ? data.data.currency : void 0) != null ? data.data.currency : "SEK",
          callbackUrl: data.data.callbackUrl
        }
      });
    });
  };
})(this);

exports.get = function(id) {
  return new Promise(function(resolve, reject) {
    var options;
    options = R.merge(config.cert, {
      method: 'get',
      url: getUrls(config.isTestEnv).payment + id
    });
    return request(options, function(err, response) {
      if (response.statusCode === 200) {
        return resolve(JSON.parse(response.body));
      } else {
        return reject({
          code: response.statusCode,
          message: response.statusMessage
        });
      }
    });
  });
};

exports.add = function(data) {
  return new Promise(function(resolve, reject) {
    var options;
    options = R.merge(config.cert, {
      method: 'post',
      url: getUrls(config.isTestEnv).payment,
      body: R.merge(config.data, data),
      json: true
    });
    return request(options, function(err, response) {
      var location, ref, ref1;
      location = response != null ? (ref = response.caseless) != null ? (ref1 = ref.dict) != null ? ref1.location : void 0 : void 0 : void 0;
      if (location) {
        return resolve(location.slice(location.lastIndexOf('/') + 1));
      } else {
        return reject((response != null ? response.body : void 0) != null ? response.body : {
          err: "unknown"
        });
      }
    });
  });
};
