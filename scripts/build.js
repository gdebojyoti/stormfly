const fs = require('fs')
const PUBLIC_FOLDER = './public'

function deleteFolderRecursive (path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + '/' + file

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })

    if (path !== PUBLIC_FOLDER) {
      console.log(`Deleting directory "${path}"...`)
      fs.rmdirSync(path)
    }
  }
}

console.log('Cleaning working tree...')

deleteFolderRecursive(PUBLIC_FOLDER)

console.log('Successfully cleaned working tree!')
