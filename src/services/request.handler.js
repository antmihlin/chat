import RequestPromiseNative from 'request-promise-native';

const options = {
    uri: `http://localhost:4001/`,
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

export const sendMessageRequest = (message, time, name, userId) => {
		options.qs.message = message;
		options.qs.time = time;
		options.qs.name = name;
		options.qs.userId = userId;
		console.log(options.params);
		return RequestPromiseNative(options);
};

export const loginRequest = ( userName,password) => {		
		let reqOptions = {
			uri:`${options.uri}user/login`,
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
