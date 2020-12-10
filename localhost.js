// https features for development environment/localhost

'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
  key: sslkey,
  cert: sslcert
};

// redirecting to https
const httpsRedirect = (req, res) => {
  res.writeHead(301, { 'Location': 'https://localhost:8000' + req.url });
  res.end();
};

// app listens on both localhost:3000 and localhost:8000. localhost:3000 redirects
// to localhost:8000 which uses https
module.exports = (app, httpsPort, httpPort) => {
  https.createServer(options, app).listen(httpsPort,
      () => console.log(`Smartsoft web app listening on port ${httpsPort}!`));
  http.createServer(httpsRedirect).listen(httpPort,
      () => console.log(`Smartsoft web app listening on port ${httpPort}!`));
};