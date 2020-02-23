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
