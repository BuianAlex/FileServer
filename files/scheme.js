const mongoose = require('mongoose')

const filesScheme = mongoose.Schema({
  fileName: {
    type: String,
    index: true
  },
  size: {
    type: String
  },
  path: {
    type: String
  },
  type: {
    type: String
  },
  uploadTime: {
    type: Date
  },
  lastModifiedDate: {
    type: Date
  }
})

filesScheme.pre('save', next => {
  const user = this
  user.uploadTime = Date.now()
  next()
})

const FileQuery = mongoose.model('files', filesScheme)
module.exports = FileQuery
