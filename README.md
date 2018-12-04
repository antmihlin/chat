# Simple react chat client

Uses socket.io for sending live messages.
Backend part could be found [here](https://github.com/antmihlin/chat-server)

Username added on page openning. UserId created form user name and random string. 
It does not use database or cookies for saving username.

Open the page and enter your name. That's it, you can start chatting.

## Get started

Clone repository

    git clone https://github.com/antmihlin/chat.git

Change directory

    cd chat

Install dependencies

    npm install

Start server

    npm start

It will be accessible on http://localhost:3006/

## Possible improvements

 - Add authentication
 - Receive only new messages
 - Lazy load previous messages

## References
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
