const mongoose = require('mongoose')

const filesScheme = mongoose.Schema(
  {
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
    }
  },
  { timestamps: true }
)

const FileQuery = mongoose.model('files', filesScheme)
module.exports = FileQuery
