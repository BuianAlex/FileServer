const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const deleteFilePromise = promisify(fs.unlink)
const renameFilePromise = promisify(fs.rename)
const FileQuery = require('./scheme')
const HttpError = require('../middleWare/errorMiddleware')
const saveFile = fileInfo => {
  return new FileQuery(fileInfo).save()
}

const getFiles = () => {
  return FileQuery.find({})
}

const getOneFile = id => {
  return FileQuery.findOne({ _id: id })
}

const deleteFile = async id => {
  const result = {}
  try {
    const deleteResDB = await FileQuery.findByIdAndRemove(id)
    if (deleteResDB) {
      result.deleteFromDB = { result: true }
      const filePath = path.join(
        __dirname,
        `../${deleteResDB.path}`,
        deleteResDB.fileName
      )
      const fileSysDeleteRes = await deleteFilePromise(filePath)

      result.deleteFileSys = { result: true }
      return result
    } else {
      result.deleteFromDB = { result: false, msg: 'id not found' }
      return result
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      result.deleteFileSys = { result: false, msg: 'file not found' }
      return result
    } else {
      return error
    }
  }
}

const editFile = async (id, body) => {
  try {
    const fileInfo = await FileQuery.findOne({ _id: id })
    if (!fileInfo) {
      return Promise.reject(new HttpError('id is not found', 400))
    }

    if (fileInfo.path !== body.path || fileInfo.fileName !== body.name) {
      const dirPath = path.join(__dirname, `../${body.path}`)
      !fs.existsSync(dirPath) && fs.mkdirSync(dirPath)
      const oldPath = path.join(
        __dirname,
        `../${fileInfo.path}`,
        fileInfo.fileName
      )
      const newPath = path.join(__dirname, `../${body.path}`, body.name)
      const resFs = await renameFilePromise(oldPath, newPath)
      fileInfo.fileName = body.name
      fileInfo.path = body.path
      return fileInfo.save()
    }
    return false
  } catch (error) {
    return error
  }
}
module.exports = { saveFile, getFiles, deleteFile, getOneFile, editFile }
