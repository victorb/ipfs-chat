var ipfsAPI = require('ipfs-api')

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001')

import _ from 'underscore'

//var request = require('request')
//  , JSONStream = require('JSONStream')
//  , es = require('event-stream')



class client {
	constructor(client) {
		this.client = client
		this.id = null
	}
	add_app_id(callback) {
		this.client.add([new Buffer('ipfs-chat')], (err, hash) => {
			if(err) {
				callback(err, null)
				return
			}
			callback(err, hash.Hash)
		})
	}
	get_new_messages(callback) {
		console.log('Gonna get new messages')
		this.peers((err, peer_ids) => {
			console.log('should make ' + peer_ids.length + ' requests...')
			let count = 0;
			let resolves = peer_ids.map((id) => {
				return new Promise((resolve, reject) => {
					this.client.name.resolve(id, (err, res) => {
						count = count + 1
						console.log(count + ' requests made!')
						resolve(err, res)
					})
				})
			})
			Promise.all(resolves).then((res) => {
				console.log('All promises have been resolved')
				callback(res)
			})
		})
		// find all available peers
		// check if they are ipfs or ipns peers
		// if ipns, we're sure they are publishing *something*
		// if ipns peer + /id === ipfs-chat, they are a client of ipfs-chat
		// fetch messages
		// do this for all peers
		// return all messages
	}
	peers(callback) {
		this.add_app_id((err, hash) => {
			console.log('Gonna find peers with id')
			console.log(hash)
			if(err) {
				callback(err, null)
				return
			}
			console.log('Finding new peers...')
			this.client.dht.findprovs(hash, (err, res) => {
				const ids_ugly = res.match(/(Qm).*/g)
				const ids = ids_ugly.map((id) => {
					return id.substr(0, id.length - 1)
				})
				const unique_ids = _.uniq(ids)
				callback(null, unique_ids)
			})
		})
	}
	id(callback) {
		this.client.id((err, res) => {
			if(err) {
				callback(err, null)
				return
			}
			const stats = {
				id: res.ID
			}
			this.id = stats.id
			callback(null, stats)
		})
	}
}

export default new client(ipfs)
