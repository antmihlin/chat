import RequestPromiseNative from 'request-promise-native';

import {config} from '../config';

export const getAllGroups = (userId,token)=>{
	const options = {
		uri: `${config.uri}group/`,
		method: 'GET',
		qs: {
			access_token: token,
			userId
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
	return RequestPromiseNative(options);
};

export const createGroup = (usersList,groupTitle,publicAccess,token)=>{
	const options = {
		uri: `${config.uri}group/`,
		method: 'POST',
		qs: {
			access_token: token,
			usersList,
			groupTitle,
			public:publicAccess
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
	return RequestPromiseNative(options);
};

