const router = require('express').Router()
const Formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const HttpError = require('../middleWare/errorMiddleware')
const service = require('./services')

router.post('/upload', async (req, res, next) => {
  const form = new Formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err)
      next(err)
    }
    if (files.fileUpload) {
      if (files.fileUpload.size === 0) {
        next(new HttpError('Empty file ', 400))
      } else if (
        fs.existsSync(path.join(__dirname, '../uploads', files.fileUpload.name))
      ) {
        next(
          new HttpError(
            `File whith name ${files.fileUpload.name}  is already stored.`,
            400
          )
        )
      } else {
        const source = fs.createReadStream(files.fileUpload.path)
        const dest = fs.createWriteStream(
          path.join(__dirname, '../uploads/', files.fileUpload.name)
        )
        source.pipe(dest)
        source.on('end', () => {
          service
            .saveFile({
              fileName: files.fileUpload.name,
              size: files.fileUpload.size,
              path: '/uploads/',
              type: files.fileUpload.type,
              lastModifiedDate: files.fileUpload.lastModifiedDate
            })
            .then(resdb => {
              res.send('ok')
            })
            .catch(error => {
              console.error(error)
              next()
            })
        })
        source.on('error', error => {
          next(error)
        })
      }
    } else {
      next(new HttpError('', 400))
    }
  })
})

router.get('/', (req, res, next) => {
  service
    .getFiles()
    .then(data => {
      res.render('files', { data: data })
    })
    .catch(err => next(err))
})

router.delete('/delete/:id', (req, res, next) => {
  service
    .deleteFile(req.params.id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new HttpError('Id not found', 400))
      }
      next(err)
    })
})

router.get('/download/:id', (req, res, next) => {
  service
    .getOneFile(req.params.id)
    .then(data => {
      const filePath = path.join(__dirname, `../${data.path}`, data.fileName)
      const streamFile = fs.createReadStream(filePath)
      streamFile.on('open', () => {
        res.statusCode = 200
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=' + data.fileName
        )
        res.setHeader('Content-Type', data.type)
        res.setHeader('Content-Length', data.size)
        streamFile.pipe(res)
      })

      streamFile.on('error', err => {
        if (err.code === 'ENOENT') {
          next(new HttpError('File whith id not found', 400))
        } else {
          next(err)
        }
      })
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new HttpError('File whith id not found', 400))
      } else {
        next(err)
      }
    })
})

router.put('/edit/:id', (req, res, next) => {
  service
    .editFile(req.params.id, req.body)
    .then(data => {
      if (data) {
        res.send({ result: true })
      } else {
        next(new HttpError('', 400))
      }
    })
    .catch(next)
})

module.exports = router
