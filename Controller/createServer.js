const { response } = require('express');
const { request } = require('http');
const http = require('https');
http.createServer((request,response) => {
    let array = [request.method, request.url];
    response.writeHead(200, {"Content-Type": "Application/json"});
    response.write(JSON.stringify(array));
    response.end();
}).listen(8080);

console.log('Lytter på port 8080...');