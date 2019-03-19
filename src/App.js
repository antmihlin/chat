import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import Message from './message.js';

//import {config} from './config';

import {sendMessageRequest,loginRequest} from './services/request.handler';
import {getAllGroups,createGroup} from './services/group.handler';

class App extends Component {
	
	constructor(props){
		super(props);
		
		this.state = {
			messages: [],
			currentMessage:{},
			currentGroup:null,
			response: false,
			endpoint: "http://127.0.0.1:4001",
			userName: null,
			userNameInput: null,
			password:null,
			passwordInput:null,
			userId:null,
			token:null,
			email:null
		};
		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
	componentDidMount() {

	}
	
	logout(){
		this.setState({
			messages: [],
			currentMessage:{},
			currentGroup:null,
			response: false,
			userName: null,
			userNameInput: null,
			password:null,
			passwordInput:null,
			userId:null,
			token:null,
			email:null,
			socket:null
		});
	}
	
	/*
	 * TODO
	 * send message by group	
	 */
	startMessagesSocket(){
		const { endpoint } = this.state;
		const socket = socketIOClient(endpoint);
		this.setState({socket:socket});
		socket.on("message", data => { 
			this.setState({ messages: data.message });
			if(document.querySelector(".chat__messages"))window.scrollTo(0,document.querySelector(".chat__messages").scrollHeight);
		});
		
		socket.emit('subscribe','1');
	}

	getGroups(){
		
	}
	
	createGroup(){
		
	}
	
	chooseGroup(){
		
	}
	
	closeGroup(){
		
	}
	
	sendMessage(){
		let message = this.state.currentMessage.text;
		let time = this.state.currentMessage.time;
		let name = this.state.currentMessage.name;
		let userId = this.state.currentMessage.userId;
		let room = '1';
		
		//const { endpoint } = this.state;
		const socket = this.state.socket;
		console.log('Sending message...');
		socket.emit('send', { room: room, message: {
			text:message,
			time,
			name,
			userId
		} });
		
		//socket.emit('send', { room: room, message: message });
		/*
		sendMessageRequest( message, time, name, userId )
			.then( (res)=> {
				console.log(res);
				let input = document.getElementById('messageInput');
				input.value = '';
			})
			.catch( (err)=> {
				console.log(err);
			});
		*/
	}
	
	handleClick(){
		let messages = this.state.messages;
		
		messages.push(this.state.currentMessage);
		this.setState({messages:messages});
		console.log(messages);
	}
	
	handleMessageChange(event){
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		
		const userName = this.state.userName;
		const userId = this.state.userId;
		
		let date = Date.now();
						
		this.setState( { currentMessage: { text:value, time:date, name:userName, userId:userId } },()=>{
			
		} );		
	}
	
	handleNameChange(event){
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		
		const userNameInput = value;
								
		this.setState( { userNameInput: userNameInput },()=>{
			console.log('Username',this.state.userNameInput);
		} );		
	}
	handlePasswordChange(event){
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		
		const passwordInput = value;
								
		this.setState( { passwordInput: passwordInput },()=>{
			console.log('Username',this.state.passwordInput);
		} );		
	}
	
	authenticate(){
		loginRequest( this.state.userNameInput,this.state.passwordInput )
			.then( (res)=> {
				this.setState({userId:res.id,userName:res.nickName,email:res.username,token:res.token},()=>{
					this.startMessagesSocket();
				});				
			})
			.catch( (err)=> {
				this.logout();
				console.log(err);
			});
	}

  render() {
	  
	let messages = this.state.messages;
	
	let elements = [];

	for(let m in messages){
		elements.push(<Message key={m} index={m} message={messages[m]} user={this.state.userId} />	);
	}

    return (
      <div className="App">
        <header className="App-header">
				{ !this.state.userName &&
				<div>
					<div className="input-group mb-3">
					  <input type="text" className="form-control" onChange={this.handleNameChange} placeholder="Username" aria-label="Username" aria-describedby="username"/>
					  <input type="password" className="form-control" onChange={this.handlePasswordChange} placeholder="Password" aria-label="Password" aria-describedby="password"/>
					  <div className="input-group-append">
						<button className="btn btn-outline-secondary" type="button" id="send-btn" onClick={()=> this.authenticate() }>Login</button>
					  </div>
					</div>
				</div>
				}
				{ this.state.userName &&
				<div className="chat container-fluid">
				
					<div className="chat__messages row align-items-end">							
						{elements}							
					</div>
					<div className="chat__input">
						<div className="input-group mb-3">
						  <input id="messageInput" type="text" className="form-control" onChange={this.handleMessageChange} placeholder="message" aria-label="message" aria-describedby="send-btn"/>
						  <div className="input-group-append">
							<button className="btn btn-outline-secondary" type="button" id="send-btn" onClick={()=> this.sendMessage() }>Button</button>
						  </div>
						</div>
					</div>
				</div>
				}
        </header>
      </div>
    );
  }
}

export default App;
