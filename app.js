/**
 * Module dependencies.
 */

var methodeOverride      =  require("method-override");
var expressSession      =  require("express-session");
var lessMiddelwear     =  require('less-middleware');
var favicon           =  require("serve-favicon");
var cookieParser     =  require("cookie-parser");
var connectJSON     =  require("connect-json");
var flash          =  require('connect-flash');
var bodyParser    =  require('body-parser');
//var multiparty    =  require('multiparty');
var passport     =  require('passport');
var express     =  require('express');
var db         =  require("./models");
var https     =  require("https");
var logger   =  require("morgan");
var http    =  require('http');
//var csurf  =  require("csurf");
var path  =  require('path');
var fs   =  require("fs");
var app =  express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.set ('view engine','hjs')
app.enable ('view cache')
app.engine ('hjs', require('hogan-express') )
app.set('layout', 'layout/default');
app.set('partials', {header: ""});

app.use(favicon("public/favicon.ico"));
app.use(methodeOverride());
app.use(logger('dev')); //logger
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(connectJSON());
app.use(cookieParser());
app.use(expressSession({"key": "","secret": "keyboard cat","cookie": {"path": "/","httpOnly": true,"maxAge": null},"resave": true,"saveUninitialized": true,"proxy": null}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(lessMiddelwear({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

app.param("from",function(req,res,next,from){
	req.from=parseInt(from,0)
	next();
});

app.param("to",function(req,res,next,to){
	req.to=parseInt(to,0)
	next();
});


app.get("/",require('./routes').default);
app.get("/index",require('./routes/').index);

// to use mongo, mongoose must be added to the package.json file
// require('./routes/mongo')(app);


require('./routes/login')(app,passport);
require('./routes/sequelize')(app);
require('./routes/session')(app);
require('./routes/socket')(app);


app.get("/res",function(req,res){
	//res.json({message: "Yo"});
	console.log(req.links)
	res.status(200);
	res.format({
		html: function(){res.send("<h1>Hi</h1>")},
		json: function(){res.json({yo : "hey json"})},
		text: function(){res.send("bbbbody")}
	});	
});


app.get('/f', function(req, res){
  req.flash('info', 'Hi there!')
  req.flash('errors', 'Oh!')  
  res.redirect('/');
});

app.get('/nf', function(req, res){
  res.redirect('/');
});

app.get('/mf', function(req, res){
    req.flash('info', ['Welcome','Please Enjoy']);
    req.flash('errors', ['Snap','Shoo']);
    res.redirect('/');
});


var users=["jeff","Yuta","Jerry","Norman","bell","jones"];

var count=0;

app.get("/hello.txt",function(req,res,next){
	count++;
	res.send("Hello from text")
});

app.get("/count",function(req,res){
	res.send( ""+ count);
});


app.get("/range/:from-:to",function(req,res){
	// var from=parseInt( req.params.from , 0)
	// var to=parseInt( req.params.to , 10)
	// res.json(users.slice(from,to+1))
	res.json(users.slice(req.from,req.to+1))
});

function loadUser(req,res,next){
	console.log("from load users\n");
	req.user=users[parseInt(req.params.id)]
	next();
}

app.get("/users/:id/:ed?",loadUser,function(req,res){
	var ed = req.param("ed",true)

	//  users/1  users/1/edit 

	if(!ed){
		message = "Viewing " + req.params.id;
	}
	else{
		if(ed==="edit") message = "Editing " + req.params.id;
		else message = "Invalid url"
	}

	res.send(message)
	
	//res.json(req.user);
});

app.get(/\/user\/(\d*)\/?(edit)?/,function(req,res){
	console.log("from app get\n");

	var id = req.param(0)
	var ed = req.param(1)

	//  user/1  user/1/edit 

	message = id + " " + ed
	res.send(message)
	
	//res.json(req.user);
});



app.get("/names/:name?",function(req,res){
	res.send( "hello \n")
	res.send( req.acceptsLanguage("ar")?"yes" : "no" );
});

app.get("/stream",function(req,res){
	var cloudReq = http.get("http://www.zachgildersleeve.com/gallery/random/Park-City-Tilt-Focus/Park-City-Tilt-Focus.jpg", function(cloudRes){
		
		var image;
		//res.set("content-type","image/jpeg");
		//cloudRes.pipe(res);

		cloudRes.on("data",function(chunk){
			res.write(chunk)
		})

		cloudRes.on("end",function(chunk){
			res.end();
		})
	});
});





/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// http.createServer(app).listen(app.get('port'), function(){
// 	console.log('Express server listening on port ' + app.get('port'));
// });


var key_file   = "certs/file.pem";
var cert_file  = "certs/file.crt";
var passphrase = "";
var config	   = {
	key: fs.readFileSync(key_file),
	cert: fs.readFileSync(cert_file)
};

if(passphrase) {
  config.passphrase = passphrase;
}

var server = https.createServer(config,app);
server.listen(app.get('port'),"0.0.0.0")

//redirect plain http connections to https
// http.createServer(function(req,res){
// 	res.writeHead(302, {
// 		'Location': "https://" + req.headers.host + ":" + app.get('port') + req.url
// 	});
// 	res.end();
//}).listen(80);

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	socket.on('click', function (socket) {
		io.sockets.emit('good', { username:socket.username,message:socket.message });
	});
	socket.on('startTyping', function (socket) {
		io.sockets.emit('isTyping', { username:socket.username });
	});

	socket.on('endTyping', function (socket) {
		io.sockets.emit('doneTyping', { username:socket.username });
	});
});
