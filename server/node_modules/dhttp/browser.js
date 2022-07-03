const Buffer = require('buffer').Buffer
const augment = require('./augment')

function returnJSON (result, body, callback) {
  try {
    body = body.toString('utf8')
    result.body = JSON.parse(body)
  } catch (e) {
    return callback(e)
  }

  callback(null, result)
}

function returnUTF8 (result, body, callback) {
  result.body = body.toString('utf8')
  return callback(null, result)
}

function returnRaw (result, body, callback) {
  result.body = body
  return callback(null, result)
}

module.exports = function request (options, callback) {
  let timeout
  function done (err, res) {
    if (timeout) clearTimeout(timeout)
    if (callback) callback(err, res)
    callback = undefined
  }

  options = augment(options)

  let xhr
  function ready () {
    if (this.readyState < 2) return

    let headers = {}
    xhr.getAllResponseHeaders()
      .split('\r\n')
      .forEach(function (header) {
        const i = header.indexOf(':')
        if (i === -1) return

        const key = header.substr(0, i).toLowerCase()
        headers[key] = header.substr(i)
      })

    const length = headers['content-length']
    if (options.limit && length > options.limit) return done(new Error('Content-Length exceeded limit'))

    if (this.readyState !== 4) return
    if (xhr.status === 0) return done(new Error('ETIMEDOUT'))

    const body = Buffer.from(xhr.response || '')
    const result = {
      body: null,
      headers: headers,
      statusCode: xhr.status
    }

    const contentType = headers['content-type']
    if (contentType) {
      if (/application\/json/.test(contentType)) return returnJSON(result, body, done)
      if (/text\/(plain|html)/.test(contentType)) return returnUTF8(result, body, done)
      if (/application\/octet-stream/.test(contentType)) return returnRaw(result, body, done)
    }

    done(null, result)
  }

  if (options.timeout) {
    timeout = setTimeout(function () {
      xhr.abort()

      done(new Error('ETIMEDOUT'))
    }, options.timeout)
  }

  xhr = new window.XMLHttpRequest()
  xhr.onreadystatechange = ready
  xhr.onerror = done
  xhr.responseType = 'arraybuffer'
  xhr.open(options.method, options.url, true)

  if (options.headers !== undefined && xhr.setRequestHeader) {
    for (const key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key])
    }
  }

  xhr.send(options.body)
}
