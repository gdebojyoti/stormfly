const messages = {}

class Messenger {
  static publish (msg, data) {
    if (messages[msg]) {
      messages[msg].forEach(listener => {
        listener && listener(data)
      })
    }
  }

  static subscribe (msg, listener) {
    if (messages[msg] && messages[msg].length) {
      messages[msg].push(listener)
    } else {
      messages[msg] = [listener]
    }
  }
}

export default Messenger
