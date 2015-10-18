var ipfsAPI = require('ipfs-api')

var ipfs = ipfsAPI('localhost', '5001')

const hash = "QmXFmCEhamPHvpbzQ3HMFABrpAXgE7D9jzp6QtvyC8Xp55"

ipfs.dht.findprovs(hash, (err, res) => {
	if(err) throw err
	console.log(res)
	console.log(typeof res)
	console.log("Streamable?", !!res.readable)
	console.log('So what to do with `res` here?')
})
