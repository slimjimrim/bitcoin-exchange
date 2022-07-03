const parsers = require('./parsers')
const augment = require('./augment')

const PROTOCOLS = {
  'http:': require('http'),
  'https:': require('https')
}

module.exports = function request (options, callback) {
  let timeout
  function done (err, res) {
    if (timeout) clearTimeout(timeout)
    if (callback) callback(err, res)
    callback = undefined
  }

  options = augment(options)

  let protocol
  if (options.protocol !== undefined) {
    protocol = PROTOCOLS[options.protocol]
  }

  const request = protocol.request(options, function (response) {
    const length = response.headers['content-length']
    if (options.limit && length > options.limit) return done(new Error('Content-Length exceeded limit'))

    function handle (err, body) {
      if (err) return done(err)
      if (body === undefined) body = null

      done(null, {
        statusCode: response.statusCode,
        headers: response.headers,
        body: body
      })
    }

    const contentType = response.headers['content-type']
    if (contentType) {
      if (/application\/json/.test(contentType)) return parsers.json(response, length, handle)
      if (/text\/(plain|html)/.test(contentType)) return parsers.text(response, length, handle)
      if (/application\/octet-stream/.test(contentType)) return parsers.raw(response, length, handle)
    }

    handle()
  })

  request.on('error', done)

  if (options.timeout) {
    timeout = setTimeout(function () {
      request.abort()

      done(new Error('ETIMEDOUT'))
    }, options.timeout)
  }

  request.end(options.body)
}
