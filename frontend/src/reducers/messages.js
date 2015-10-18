import { createReducer } from 'utils'
import moment from 'moment'
import ipfs from '../ipfs'

const CHANGE_MESSAGE = 'CHANGE_MESSAGE'
const ADD_MESSAGE = 'ADD_MESSAGE'

const localStorageKey = 'ipfs-chat'

let saveLocalStorage = (contents) => {
	localStorage.setItem(localStorageKey, JSON.stringify(contents))
}

let loadLocalStorage = () => {
	let initial_state =  JSON.parse(localStorage.getItem(localStorageKey))
	let messages = initial_state.messages
	Object.keys(messages).forEach((key) => {
		if(messages[key].length > 0) {
			const new_messages = messages[key].map((msg) => {
				return {
					author: msg.author,
					date: moment(msg.date),
					text: msg.text
				}
			})
			messages[key] = new_messages
		}
	})
	initial_state.messages = messages
	//contents = Object.keys(contents).map((key) => {
	//	let channels = contents[key]
	//	Object.keys(channels).forEach((chanKey) => {
	//		let messages = channels[chanKey]
	//		channels[chanKey] = messages.map((message) => {
	//		})
	//	})
	//	return channels
	//})
	console.log(initial_state)
	return initial_state
}

let existsLocalStorage = () => {
	return localStorage.getItem(localStorageKey) !== null
}

let createMessage = (text) => {
	return {
		"author": "VictorBjelkholm",
		"date": moment(),
		"text": text
	}
}

let initialState = {
	messages: {
		"#ipfs": [
			createMessage("Hello World"),
			createMessage("This is the message that appears under that other message")
		],
		"#lasso": [],
		"#howtodoit": [],
		"#crypto": [],
		"#netsec": [],
		"#js": [],
		"#iammyreligion": [],
	},
	current_message: null
}

if(!existsLocalStorage()) {
	saveLocalStorage(initialState)
} else {
	initialState = loadLocalStorage()
}

export default createReducer(initialState, {
	[ADD_MESSAGE] : (state, payload) => {
		let new_state = Object.assign({}, state)

		const new_messages = [
			...state.messages[payload.channel],
			createMessage(payload.text)
		]
		new_state.messages[payload.channel] = new_messages
		saveLocalStorage(new_state)
		return new_state
	},
	[CHANGE_MESSAGE] : (state, payload) => {
		return {
			messages: state.messages,
			current_message: payload.current_message
		}
	}
})
