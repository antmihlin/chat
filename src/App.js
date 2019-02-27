import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import Message from './message.js';

import {sendMessageRequest,loginRequest} from './services/request.handler';

class App extends Component {
	
	constructor(props){
		super(props);
		
		this.state = {
			messages: [],
			currentMessage:{},
			response: false,
			endpoint: "http://127.0.0.1:4001",
			userName: null,
			userNameInput: null,
			password:null,
			passwordInput:null,
			userId:null
		};
		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
	componentDidMount() {
		const { endpoint } = this.state;
		const socket = socketIOClient(endpoint);
		socket.on("FromAPI", data => { 
			this.setState({ messages: data });
			if(document.querySelector(".chat__messages"))window.scrollTo(0,document.querySelector(".chat__messages").scrollHeight);
		});
	}
	
	sendMessage(){
		let message = this.state.currentMessage.text;
		let time = this.state.currentMessage.time;
		let name = this.state.currentMessage.name;
		let userId = this.state.currentMessage.userId;
		sendMessageRequest( message, time, name, userId )
			.then( (res)=> {
				console.log(res);
				let input = document.getElementById('messageInput');
				input.value = '';
			})
			.catch( (err)=> {
				console.log(err);
			});
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
				console.log(res);
				//let input = document.getElementById('messageInput');
				//input.value = '';
			})
			.catch( (err)=> {
				console.log(err);
			});
	}
	
	setName(){
		let name = this.state.userNameInput.split('');
		let nameSize = name.length;
		
		if(nameSize> 3)  {
			let userId = this.state.userNameInput+this.makeid();
			this.setState({
				userName:this.state.userNameInput,
				userId: userId
			});
		} 
	}
	
	makeid(){
		let text = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < 5; i++)
		  text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
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
				/*<div>
					<div className="input-group mb-3">
					  <input type="text" className="form-control" onChange={this.handleNameChange} placeholder="Urername" aria-label="Urername" aria-describedby="username"/>
					  <div className="input-group-append">
						<button className="btn btn-outline-secondary" type="button" id="send-btn" onClick={()=> this.setName() }>Save name</button>
					  </div>
					</div>
				</div>*/
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
