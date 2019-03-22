import React, { Component } from 'react';

class Message extends Component {
	
	constructor(props){
		super(props);
		
		this.state = {
			message: props.message
		};	
	}
	
	componentDidMount() {
		this.convertDate();
	}
	
	convertDate(){
		
		let message = this.state.message;
		let miliseconds = + message.time;
		let d = new Date(miliseconds);
		message.time = `${d.getHours()}:${d.getMinutes()} - ${d.getDate()}/${d.getMonth()}/${d.getFullYear()} `;
		
		this.setState({ message:message });
	}
	
	  render() {
		  return(
			<div className="chat__message-container" >
				<div className={"chat__message " + (this.props.user === this.state.message.userId ? 'chat__message_right' : '' )} >
					<div  role="alert">
						<div className={"alert " + (this.props.user === this.state.message.userId ? 'alert-warning' : 'alert-secondary' )} role="alert">
							<div className="row justify-content-between">
								<div className="col text-left">
									<span className="badge badge-secondary">{this.state.message.name}</span>
								</div>	
								<div className="col text-right">
									<span className="badge badge-secondary">{this.state.message.time}</span>
								</div>
							</div>
							<div className="text-left">
								{this.state.message.text}
							</div>

						</div>		
					</div>	
				</div>
			</div>
		);
	  }
	
};

export default Message;