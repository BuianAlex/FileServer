const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../index')
const fs = require('fs')
const path = require('path')
const FileQuery = require('../files/scheme')
chai.use(chaiHttp)

describe('File Upload', () => {
  it('Upload valid file', done => {
    chai
      .request(server)
      .post('/files/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach(
        'fileUpload',
        path.join(__dirname, './files/calce.jpg'),
        'calce.jpg'
      )
      .end((err, res) => {
        if (err) {
          console.error(err)
        } else {
          res.should.have.status(200)
          // console.log(res)
        }
        done()
      })
  })
})

describe('File DOWNLOAD', () => {
  it('Download file', done => {
    FileQuery.findOne({ fileName: 'calce.jpg' }).then(data => {
      chai
        .request(server)
        .get(`/files/download/${data._id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          res.should.have.status(200)
          console.log(res.data)

          done()
        })
    })
  })

  it('id not exist', done => {
    chai
      .request(server)
      .get('/files/download/sdfsfdsdfs')
      .end((err, res) => {
        if (err) {
          console.log(err)
        }
        res.should.have.status(400)
        done()
      })
  })

  it('file not exist', done => {
    const test = new FileQuery({
      fileName: 'test.test',
      size: 200,
      path: '/uploads/',
      type: 'test/test',
      lastModifiedDate: 34534534534
    })
    test.save().then(data => {
      chai
        .request(server)
        .get(`/files/download/${data._id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          res.should.have.status(400)
          done()
        })
    })
  })
})

describe('File DELETE', () => {
  it('Delete file which not saved in db', done => {
    chai
      .request(server)
      .delete('/files/delete/234423423423')
      .end((err, res) => {
        if (err) {
          console.log(err)
        }
        res.should.have.status(200)
        // res.body.deleteFromDB.result.should.eql(false)
        done()
      })
  })

  it('Delete file which saved on the fs and db', done => {
    FileQuery.findOne({ fileName: 'calce.jpg' }).then(data => {
      chai
        .request(server)
        .delete(`/files/delete/${data._id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          res.should.have.status(200)
          // res.body.deleteFromDB.result.should.eql(true)
          // res.body.deleteFileSys.result.should.eql(true)
          done()
        })
    })
  })

  it('Delete file which saved on the db but not in fs', done => {
    const test = new FileQuery({
      fileName: 'test.test',
      size: 200,
      path: '/uploads/',
      type: 'test/test',
      lastModifiedDate: 34534534534
    })
    test.save().then(data => {
      chai
        .request(server)
        .delete(`/files/delete/${data._id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          res.should.have.status(200)
          // res.body.deleteFromDB.result.should.eql(true)
          // res.body.deleteFileSys.result.should.eql(false)
          done()
        })
    })
  })
})

describe('File Edit', () => {
  it('replace', done => {
    const newFileData = { name: 'new.nwe', path: '/sdsd/' }
    chai
      .request(server)
      .put('/files/edit/5e331b2dff442556ceb6b5e3')
      .send(newFileData)
      .end((err, res) => {
        if (err) {
          console.log(err)
        }
        console.log(res.status)
        console.log(res.body)

        done()
      })
  })
})
