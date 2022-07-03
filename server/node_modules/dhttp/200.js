const dhttp = require('./')
const httpStatus = require('statuses/codes.json')

module.exports = function only200 (options, callback) {
  dhttp(options, function (err, result) {
    if (err) return callback(err)
    if (result.statusCode < 200 || result.statusCode >= 300) {
      const message = result.body || httpStatus[result.statusCode]
      return callback(new Error(message))
    }

    callback(null, result.body)
  })
}
