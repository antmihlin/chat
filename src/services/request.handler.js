import RequestPromiseNative from 'request-promise-native';

import {config} from '../config';



/*
 * TODO
 * Retrieve all messages | limit 20
 * Subscribe socket - all group's messages
 *		Socket by group id
 * 
 */


//Send message
export const sendMessageRequest = (message, time, name, userId,groupId) => {
	const options = {
		uri: `http://localhost:4001/send/1`,
		method: 'POST',
		qs: {
			//access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
			message:'',
			time:'',
			name:''
		},
		headers: {
			'User-Agent': 'Request-Promise',
			'Content-Type': 'Application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': 'false'
		},
		json: true ,// Automatically parses the JSON string in the response
		body:{	params:{
			message:'',
			time:'',
			name:''
		}},
	};
	options.qs.message = message;
	options.qs.time = time;
	options.qs.name = name;
	options.qs.userId = userId;
	options.qs.groupId = groupId;
	return RequestPromiseNative(options);
};

export const loginRequest = ( userName,password) => {		
		let reqOptions = {
			uri:`${config.uri}user/login`,
			method:'POST',
			headers: {
				'User-Agent': 'Request-Promise',
				'Content-Type': 'Application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'false'
			},
			json: true ,// Automatically parses the JSON string in the response
			body:{				
				username:userName,
				password:password
			},
		};
		return RequestPromiseNative(reqOptions);
};
