var fs = require('fs')

function fileExists (filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.isFile() || stats.isDirectory()
  } catch (err) {
    return false
  }
}

var ipfsAPI = require('ipfs-api')

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001') // leaving out the arguments will default to these values

if (fileExists('store/')) {
  console.log('folder exists')
  const id_exists = fileExists('store/id')
  const chats_exists = fileExists('store/chats')
  if(id_exists) {
    console.log('id exists')
  }
  if(chats_exists) {
    console.log('chat exists')
  }
}

// Need to do two things
// Get the current state
  // Find peers
  // Merge the jsons
  // Save files
// Save a new state
  // update files
