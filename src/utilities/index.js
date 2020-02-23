export function getSearchParam (param) {
  if (!window.location.search) {
    return ''
  }

  const search = window.location.search.split('?')[1]
  const searchStrings = search.split('&')

  let value = ''
  searchStrings.forEach(searchString => {
    const params = searchString.split('=')
    if (params[0] === param) {
      value = params[1]
    }
  })

  return value
}

export function saveToLocalStorage (key, value) {
  const ls = window.localStorage
  if (!ls) {
    console.error('You are using a browser that does not support Local Storage!')
    return
  }
  if (typeof value === 'object') {
    ls.setItem(key, JSON.stringify(value))
  } else {
    ls.setItem(key, value)
  }
}

export function getFromLocalStorage (key) {
  const ls = window.localStorage
  if (!ls) {
    console.error('You are using a browser that does not support Local Storage!')
    return
  }
  const data = ls.getItem(key)
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

export function viewLevelJson () {
  const levelData = getFromLocalStorage('levelData')
  if (!levelData) {
    window.alert('No level data found in browser\'s local storage')
    return
  }

  var levelDataJson = JSON.stringify(levelData, null, 2)
  console.info('Level data:', levelDataJson)
  var x = window.open()
  x.document.open()
  x.document.write('<html><body><pre>' + levelDataJson + '</pre></body></html>')
  x.document.close()

  // TODO: get below statement to work
  // window.open('data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(levelData)))
}

export function downloadLevelJson () {
  const levelData = getFromLocalStorage('levelData')
  if (!levelData) {
    window.alert('No level data found in browser\'s local storage')
    return
  }

  const levelDataJson = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(levelData))
  const elm = document.createElement('a')
  elm.setAttribute('href', levelDataJson)
  elm.setAttribute('download', 'levelData.json')
  document.body.appendChild(elm) // required for firefox
  elm.click()
  elm.remove()

  console.info('Downloading level data in JSON format...')
}
