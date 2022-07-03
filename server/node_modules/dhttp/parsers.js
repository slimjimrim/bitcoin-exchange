function raw (response, limit, callback) {
  var buffers = []
  var length = 0

  response.on('data', function (data) {
    buffers.push(data)
    length += data.length

    if (length > limit) return callback(new Error('Exceeded limit'))
  })

  response.on('end', function () {
    callback(null, Buffer.concat(buffers, length))
  })
}

function text (response, limit, callback) {
  raw(response, limit, function (err, buffer) {
    if (err) return callback(err)

    callback(null, buffer.toString('utf8'))
  })
}

function json (response, limit, callback) {
  text(response, limit, function (err, text) {
    if (err) return callback(err)

    try {
      callback(null, JSON.parse(text))
    } catch (e) {
      callback(e)
    }
  })
}

module.exports = {
  raw: raw,
  text: text,
  json: json
}
