const buttons = document.querySelectorAll('[file-id]')

buttons.forEach(elem => {
  elem.addEventListener('click', function() {
    var xhr = new XMLHttpRequest()
    xhr.open('DELETE', `/files/delete/${elem.getAttribute('file-id')}`, true)

    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        alert(this.response)
        location.reload()
      }
    }
    xhr.send()
    console.log(elem.getAttribute('file-id'))
  })
})
