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
