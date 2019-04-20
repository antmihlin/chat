import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import Message from "./message.js";

//import {config} from './config';

import { sendMessageRequest, loginRequest } from "./services/request.handler";
import {
  getAllGroups,
  createGroup,
  getAllUsers
} from "./services/group.handler";
import { getCookie } from "./services/cookie.handler";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      currentMessage: {},
      currentGroup: null,
      groups: [],
      response: false,
      endpoint: "http://127.0.0.1:4001",
      userName: null,
      userNameInput: null,
      password: null,
      passwordInput: null,
      userId: null,
      token: null,
      email: null,
      users: []
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleGroupChoice = this.handleGroupChoice.bind(this);
  }

  componentDidMount() {
    this.checkAuth();
  }

  /*
   * TODO
   * send message by group
   */
  startMessagesSocket() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    this.setState({ socket: socket });
    socket.on("send", data => {
      let messages = this.state.messages;
      messages.push(data.message);
      this.setState({ messages });
      console.log(data);
      if (document.querySelector(".chat__messages"))
        window.scrollTo(
          0,
          document.querySelector(".chat__messages").scrollHeight
        );
    });

    socket.emit("subscribe", this.state.currentGroup);
  }

  getGroups() {
    getAllGroups(this.state.userId, this.state.token)
      .then(res => {
        console.log(res);
        this.setState({ groups: res.value });
      })
      .catch(err => {
        console.log(err);
      });
  }
  getUsers() {
    getAllUsers(this.state.userId, this.state.token)
      .then(res => {
        console.log("Users");
        console.log(res.value);
        console.log("---------------------");
        this.setState({ users: res.value });
      })
      .catch(err => {
        console.log(err);
      });
  }

  createGroup() {}

  chooseGroup() {}

  closeGroup() {}

  sendMessage() {
    let message = this.state.currentMessage.text;
    let time = this.state.currentMessage.time;
    let name = this.state.currentMessage.name;
    let userId = this.state.currentMessage.userId;
    let room = this.state.currentGroup;

    //const { endpoint } = this.state;
    const socket = this.state.socket;
    console.log("Sending message...");
    socket.emit("send", {
      room: room,
      message: {
        text: message,
        time,
        name,
        userId
      }
    });

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

  handleClick() {
    let messages = this.state.messages;

    messages.push(this.state.currentMessage);
    this.setState({ messages: messages });
    console.log(messages);
  }

  handleGroupChoice(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({ currentGroup: value }, () => {
      this.startMessagesSocket();
    });
  }

  handleMessageChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const userName = this.state.userName;
    const userId = this.state.userId;

    let date = Date.now();

    this.setState(
      {
        currentMessage: {
          text: value,
          time: date,
          name: userName,
          userId: userId
        }
      },
      () => {}
    );
  }

  handleNameChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const userNameInput = value;

    this.setState({ userNameInput: userNameInput }, () => {});
  }
  handlePasswordChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const passwordInput = value;

    this.setState({ passwordInput: passwordInput }, () => {});
  }

  authenticate() {
    loginRequest(this.state.userNameInput, this.state.passwordInput)
      .then(res => {
        this.setState(
          {
            userId: res.id,
            userName: res.nickName,
            email: res.username,
            token: res.token
          },
          () => {
            this.getGroups();
            this.getUsers();
            document.cookie = `userId=${res.id}`;
            document.cookie = `userName=${res.nickName}`;
            document.cookie = `email=${res.username}`;
            document.cookie = `token=${res.token}`;
          }
        );
      })
      .catch(err => {
        this.logout();
        console.log(err);
      });
  }

  checkAuth() {
    if (getCookie("token").length > 0 && getCookie("userId").length > 0) {
      this.setState(
        {
          userId: getCookie("userId"),
          userName: getCookie("userName"),
          email: getCookie("email"),
          token: getCookie("token")
        },
        () => {
          this.getGroups();
          this.getUsers();
        }
      );
    }
  }

  logout() {
    this.setState({
      messages: [],
      currentMessage: {},
      currentGroup: null,
      groups: [],
      response: false,
      userName: null,
      userNameInput: null,
      password: null,
      passwordInput: null,
      userId: null,
      token: null,
      email: null,
      socket: null,
      users: []
    });

    document.cookie = `userId=`;
    document.cookie = `userName=`;
    document.cookie = `email=`;
    document.cookie = `token=`;
  }

  render() {
    let messages = this.state.messages;
    let groups = this.state.groups;

    let elements = [];

    for (let m in messages) {
      elements.push(
        <Message
          key={m}
          index={m}
          message={messages[m]}
          user={this.state.userId}
        />
      );
    }

    let groupsElements = [];

    for (let g in groups) {
      groupsElements.push(
        <option key={g} index={g} value={groups[g]._id}>
          {groups[g].title}
        </option>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          {!this.state.userName && (
            <div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={this.handleNameChange}
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="username"
                />
                <input
                  type="password"
                  className="form-control"
                  onChange={this.handlePasswordChange}
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="password"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="send-btn"
                    onClick={() => this.authenticate()}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
          {this.state.userName && !this.state.currentGroup && (
            <div>
              <div className="form-group">
                <label htmlFor="chooseGroup">Select group</label>
                <select
                  className="form-control"
                  onChange={this.handleGroupChoice}
                  id="chooseGroup"
                >
                  <option>Choose group</option>
                  {groupsElements}
                </select>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="logout-btn"
                    onClick={() => this.logout()}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
          {this.state.userName && this.state.currentGroup && (
            <div className="chat container-fluid">
              <div className="chat__messages row align-items-end">
                {elements}
              </div>
              <div className="chat__input">
                <div className="input-group mb-3">
                  <input
                    id="messageInput"
                    type="text"
                    className="form-control"
                    onChange={this.handleMessageChange}
                    placeholder="message"
                    aria-label="message"
                    aria-describedby="send-btn"
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      id="send-btn"
                      onClick={() => this.sendMessage()}
                    >
                      Button
                    </button>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      id="logout-btn"
                      onClick={() => this.logout()}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
