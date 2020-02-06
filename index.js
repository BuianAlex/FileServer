const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const app = express()

require('jade')
require('dotenv').config()
require('./db/conectDB')

app.set('views', './views')
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const files = require('./files/router')
app.use('/files', files)

app.get('/', (req, res) => res.render('index', { data: { re: '' } }))

app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  res.status(404).render('404')
})

app.use((error, req, res, next) => {
  process.env.NODE_ENV === 'dev' && console.log(error)
  if (error.status) {
    res.status(error.status)
    res.send(error)
  } else {
    const answer = new Error()
    answer.message = 'Uncaught exeption!'
    res.status(500).send(answer)
  }
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Example app listening on port ${process.env.SERVER_PORT}!`)
})

module.exports = app
