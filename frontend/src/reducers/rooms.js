import { createReducer } from 'utils'

const CHANGE_ROOM = 'CHANGE_ROOM'

const initialState = {
	currentRoom: '#ipfs',
	allRooms: [
		'#lasso',
		'#ipfs',
		"#howtodoit",
		"#crypto",
		"#netsec",
		"#js",
		"#iammyreligion",
	]
}

export default createReducer(initialState, {
	[CHANGE_ROOM] : (state, payload) => {
		console.log(payload)
		return {
			currentRoom: payload.room_name,
			allRooms: state.allRooms
		}
	}
})
