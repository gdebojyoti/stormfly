class Controls {
  static addListener (event, { up, down, left, right } = {}) {
    if (typeof event !== 'string') {
      console.warn('Incorrect arguments provided. Exiting method..')
      return
    }

    const handler = e => {
      switch (e.keyCode) {
        case 87: {
          // W
          up && up()
          break
        }
        case 65: {
          // A
          left && left()
          break
        }
        case 83: {
          // S
          down && down()
          break
        }
        case 68: {
          // D
          right && right()
          break
        }
      }
    }
    window.addEventListener(event, handler)
  }
}

export default Controls
