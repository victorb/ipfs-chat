import React                  from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import ipfs from '../ipfs'

// Normally you'd import your action creators, but I don't want to create
// a file that you're just going to delete anyways!
const actionCreators = {
  increment : () => ({ type : 'COUNTER_INCREMENT' }),
	change_room : (room_name) => ({
		type: 'CHANGE_ROOM',
		payload: {room_name}
	}),
	add_message : (text, channel) => ({
		type: 'ADD_MESSAGE',
		payload: {text, channel}
	})
};

// We define mapStateToProps and mapDispatchToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter : state.counter,
  rooms : state.rooms,
	messages : state.messages
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

class Selector extends React.Component {
	handleClick(clicked_room_name) {
		this.props.onChange(clicked_room_name)
	}
	render() {
		const style = {
			width: '200px',
			backgroundColor: 'lightgrey',
			height: '100%',
			position: 'absolute'
		}
		const row_style = {
			width: '200px',
			backgroundColor: 'grey',
			color: 'rgba(255,255,255,0.5)',
			padding: 5
		}
		const active_row_style = Object.assign({}, row_style, {
			backgroundColor: 'lightgrey',
			textDecoration: 'underline',
			color: 'black',
			fontSize: '120%'
		})
		const options = this.props.options.map((value) => {
			if(value === this.props['selected-option']) {
				return <div style={active_row_style} onClick={() => {
					this.handleClick(value)
				}.bind(this)}>{value}</div>
				//return <option value={value} selected>{value}</option>
			}
				return <div style={row_style} onClick={() => {
					this.handleClick(value)
				}.bind(this)}>{value}</div>
			//return <option value={value}>{value}</option>
		})
		return <div style={style}>
			{options}
		</div>
	}
}

class AddNewMessage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			new_message : ''
		}
	}
	sendMessage(text) {
		console.log('TODO | Send the actual message')
	}
	handleOnClick() {
		this.props.onSend(this.state.new_message.trim())
		this.setState({new_message: ''})
	}
	handleOnChange(ev) {
		const value_to_set = ev.target.value
		this.setState({new_message: value_to_set})
	}
	handleKeyup(ev) {
		const keycode = ev.keyCode || ev.keycode
		if(keycode === 13) {
			this.handleOnClick()
			this.refs.input.focus()
		}
	}
	render() {
		const style = {
			position: 'absolute',
			bottom: 0,
			width: '500px'
		}
		return <div style={style}>
			<input
				type="text"
				placeholder="Write your message here"
				onChange={this.handleOnChange.bind(this)}
				style={{float: 'left', width: '400px'}}
				value={this.state.new_message}
				onKeyUp={this.handleKeyup.bind(this)}
				ref="input"
			/>
			<button
				style={{float: 'left'}}
				onClick={this.handleOnClick.bind(this)}>Send</button>
		</div>
	}
}

class Messages extends React.Component {
	render() {
		const style = {
			left: '200px',
			position: 'absolute',
			top: 0,
			bottom: 0
		}
		const messages_style = {
			position: 'absolute',
			width: '500px',
			bottom: '30px'
		}
		console.log(this.props)
		const messages = this.props.messages.messages[this.props.channel].map((msg) => {
			return <div>{msg.date.format()} | @{msg.author} - {msg.text}</div>
		})
		return <div style={style}>
			<div style={messages_style}>
				{messages}
			</div>
			<AddNewMessage channel={this.props.channel} onSend={this.props.onSend}/>
		</div>
	}
}

console.log('calling for messages')
ipfs.get_new_messages((stats) => {
	console.log('Got stuff')
	console.log(stats)
})

class Loading extends React.Component {
	render() {
		let to_render = null
		let style = {top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			position: 'absolute',
			backgroundColor: '#3D3D3D',
			zIndex: 100000,
			textAlign: 'center',
			fontFamily: 'sans-serif',
			opacity: 0
		}
		if(this.props.show) {
			style.opacity = 1
			to_render = <div style={style}>
				<h1 style={{color: '#00FEFF'}}>Initializing</h1>
				<h3 style={{color: '#008074'}}>Please wait while we load the application and new data</h3>
				<video src="logo.webm" autoPlay></video>
			</div>
		}
		return <div style={{}}>
			{to_render}
		</div>
	}
}

export class HomeView extends React.Component {
  static propTypes = {
    actions  : React.PropTypes.object,
    counter  : React.PropTypes.number
  }

  constructor () {
    super();
		this.state = {loading: true}
		setTimeout(() => {
			this.setState({loading: false})
		}, 1000)
  }

	handleChange (room_name) {
		this.props.actions.change_room(room_name)
	}
	handleSend (message, channel) {
		this.props.actions.add_message(message, this.props.rooms.currentRoom)
		console.log('gonna send message ' + message)
	}

  render () {
    return (
      <div style={{}}>
				<Loading show={this.state.loading}/>
				<Selector
					options={this.props.rooms.allRooms}
					selected-option={this.props.rooms.currentRoom}
					onChange={this.handleChange.bind(this)}
				/>
				<Messages onSend={this.handleSend.bind(this)} channel={this.props.rooms.currentRoom} messages={this.props.messages}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
