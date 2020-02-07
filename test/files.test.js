const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../index')
const fs = require('fs')
const path = require('path')
const FileQuery = require('../files/scheme')
chai.use(chaiHttp)

let testData

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

  it('file not exist in fsys', done => {
    const test = new FileQuery({
      fileName: 'test.test',
      size: 200,
      path: '/uploads/',
      type: 'test/test',
      lastModifiedDate: 34534534534
    })
    test.save().then(data => {
      testData = test
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

describe('File Edit', () => {
  it('Rename and replace file which not exist in the fs and db should be status (400)', done => {
    const newFileData = { name: 'new.nwe', path: '/sdsd/' }
    chai
      .request(server)
      .put('/files/edit/5e331b2dff442556ceb6b5e3')
      .send(newFileData)
      .end((err, res) => {
        if (err) {
          console.log(err)
        }
        res.should.have.status(400)
        done()
      })
  })

  it('Rename and replace file should be status (200)', done => {
    const newFileData = { name: 'new.nwe', path: '/sdsd/' }
    FileQuery.findOne({ fileName: 'calce.jpg' }).then(data => {
      chai
        .request(server)
        .put(`/files/edit/${data._id}`)
        .send(newFileData)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          res.should.have.status(200)
          done()
        })
    })
  })
})

describe('File DELETE', () => {
  it('Delete file which not saved in db should be status (200) whith error msg', done => {
    chai
      .request(server)
      .delete('/files/delete/234423423423')
      .end((err, res) => {
        if (err) {
          console.log(err)
        }
        res.should.have.status(200)
        res.body.deleteFromDB.result.should.eql(false)
        done()
      })
  })

  it('Delete file which saved on the fs and db should be status (200)', done => {
    FileQuery.findOne({ fileName: 'new.nwe' }).then(data => {
      chai
        .request(server)
        .delete(`/files/delete/${data._id}`)
        .end((err, res) => {
          if (err) {
            console.log(err)
          }
          res.should.have.status(200)
          res.body.deleteFromDB.result.should.eql(true)
          res.body.deleteFileSys.result.should.eql(true)
          done()
        })
    })
  })

  it('Delete file which saved on the db but not in the fs should be status(200) whith error msg', done => {
    chai
      .request(server)
      .delete(`/files/delete/${testData._id}`)
      .end((err, res) => {
        if (err) {
          console.log(err)
        }
        res.should.have.status(200)
        res.body.deleteFromDB.result.should.eql(true)
        res.body.deleteFileSys.result.should.eql(false)
        done()
      })
  })
})
