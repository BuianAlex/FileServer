const buttons = document.querySelectorAll('#delete')

buttons.forEach(elem => {
  elem.addEventListener('click', function() {
    const request = new XMLHttpRequest()
    request.open(
      'DELETE',
      `/files/delete/${elem.getAttribute('file-id')}`,
      true
    )

    request.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        if (this.status === 200) {
          location.reload()
        } else {
          alert(this.statusText)
        }
      }
    }
    request.send()
  })
})

const submitBtn = document.querySelector('[type=submit]')

submitBtn.addEventListener('click', e => {
  e.preventDefault()
  const formElement = document.querySelector('form')
  var request = new XMLHttpRequest()
  request.open('POST', '/files/upload')
  request.onreadystatechange = function() {
    console.log(this)
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload()
      } else {
        alert(this.statusText)
      }
    }
  }
  request.send(new FormData(formElement))
})

function createTextInput(inputValue, lable, name, parent) {
  const root = document.createElement('div')
  root.classList.add('mui-textfield')

  const inputLeble = document.createElement('lable')
  inputLeble.textContent = lable
  root.appendChild(inputLeble)

  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('value', inputValue)
  input.setAttribute('name', name)

  root.appendChild(input)

  parent.appendChild(root)
}

function sendEditedData(data) {
  const formElement = document.querySelector('#form-edit')
  const dataForm = new FormData(formElement)
  const jsonObject = {}
  for (const [key, value] of dataForm.entries()) {
    jsonObject[key] = value
  }
  console.log(jsonObject)

  var request = new XMLHttpRequest()
  request.open('PUT', `/files/edit/${data.id}`)
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8')
  request.onreadystatechange = function() {
    console.log(this)
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        location.reload()
      } else {
        alert(this.statusText)
      }
    }
  }
  request.send(JSON.stringify(jsonObject))
}

function activateModal(id) {
  const fileData = workflowData.find(file => id === file._id)
  console.log(fileData)

  // initialize modal element
  const modalEl = document.createElement('div')
  modalEl.style.width = '400px'
  modalEl.style.height = '300px'
  modalEl.style.margin = '100px auto'
  modalEl.style.padding = '20px'
  modalEl.style.backgroundColor = '#fff'
  modalEl.style.position = 'relative'

  const closeBtn = document.createElement('button')
  closeBtn.classList.add('close-btn')
  closeBtn.textContent = 'X'
  closeBtn.addEventListener('click', () => {
    mui.overlay('off')
  })
  modalEl.appendChild(closeBtn)

  const form = document.createElement('form')
  form.classList.add('mui-form')
  form.setAttribute('id', 'form-edit')

  const legend = document.createElement('legend')
  legend.textContent = 'Edit file info'
  form.appendChild(legend)

  createTextInput(fileData.fileName, 'Remame', 'name', form)
  createTextInput(fileData.path, 'Move to...', 'path', form)

  const saveBtn = document.createElement('button')
  saveBtn.classList.add(
    'mui-btn',
    'mui-btn--raised',
    'mui-btn--primary',
    'fixed-right'
  )
  saveBtn.textContent = 'Save'
  saveBtn.addEventListener('click', e => {
    e.preventDefault()
    sendEditedData({ id: fileData._id })
  })
  form.appendChild(saveBtn)

  form.appendChild(saveBtn)
  modalEl.appendChild(form)

  // show modal
  mui.overlay('on', modalEl)
}

const editBtn = document.querySelector('#edit')

if (editBtn) {
  editBtn.addEventListener('click', e => {
    const id = e.target.getAttribute('file-id')
    activateModal(id)
  })
}

const uploadFile = document.querySelector('#uploadFile')
const uploadLable = document.querySelector('#uploadLable')
uploadFile.addEventListener(
  'change',
  function() {
    uploadLable.textContent = this.files[0].name
    console.log(this.files)
  },
  false
)
