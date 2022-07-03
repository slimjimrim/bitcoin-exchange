const url = require('url')
const CONTENT_TYPE_MAP = {
  'buffer': 'application/octet-stream',
  'object': 'application/json',
  'number': 'application/json',
  'string': 'text/plain'
}

module.exports = function augment (options) {
  // don't mutate
  options = Object.assign({}, options)

  if (options.url) {
    Object.assign(options, url.parse(options.url))
  }

  if (options.body === undefined) return options

  let typeOf = typeof options.body
  if (Buffer.isBuffer(options.body)) {
    typeOf = 'buffer'
  }

  options.headers = options.headers || {}
  if (!options.headers['content-type']) {
    options.headers = Object.assign({}, options.headers)
    options.headers['content-type'] = CONTENT_TYPE_MAP[typeOf]
  }

  if (options.headers['content-type'] === 'application/json') {
    if (typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body)
    }
  }

  return options
}
