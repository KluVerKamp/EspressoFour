var connect = require("connect");
var http = require("http");
var app = connect();

app.use(connect.logger());


// Homepage
app.use(function(request, response, next) {
	if (request.url == "/") {
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.end("Welcome to the homepage!\n");
    // The middleware stops here.
} else {
	next();
}
});

// About page
app.use(function(request, response, next) {
	if (request.url == "/about") {
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.end("Welcome to the about page!\n");
    // The middleware stops here.
} else {
	next();
}
});


// 404'd!
app.use(function(request, response) {
	response.writeHead(404, { "Content-Type": "text/plain" });
	response.end("404 error!\n");
});
console.log("starting server port 1337");
http.createServer(app).listen(1337);