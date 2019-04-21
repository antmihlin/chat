/*
 * Entry point to nodejs application
 * @type Module express|Module express
 */

/* Connect all required services */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// Config
global.appRoot = path.resolve(__dirname);


// Parsers
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb' }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/refurb')));

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Pragma,Cache-Control");
    res.header("Pragma", "no-cache");
    res.header("Cache-Control", "public, no-store, no-cache,must-revalidate, post-check=0,pre-check=0");
    res.header("Expires", "-1");
    res.header("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
    next();
});

// Send all other requests to the Angular app
/**/
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/refurb/index.html'));
});

app.disable('etag');

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
