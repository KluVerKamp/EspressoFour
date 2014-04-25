/**
 * Module dependencies.
 */
var flash     = require('connect-flash');
var passport = require('passport');
var express = require('express');
var db     = require("./models");
var http  = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.set ('view engine', 'hjs'  )
app.enable ('view cache')
app.engine ('hjs', require('hogan-express') )

app.set('layout', 'layout/default');
app.set('partials', {header: ""});

app.use(require("static-favicon")());
app.use(require("method-override")());
app.use(require("morgan")('dev')); //logger
app.use(require("body-parser")());
//app.use(express.urlencoded());
app.use(require("connect-json")());
app.use(require("cookie-parser")());
app.use(require("express-session")({secret: 'mysecretword!'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// catch htpp errors into pages
app.use(function(err,req,res,next){
	res.status(err.status||404);
	res.send(err.message);	
});

app.use(function(err,req,res,next){
	res.status(err.status||500);
	res.send(err.message);
});

app.param("from",function(req,res,next,from){
	req.from=parseInt(from,0)
	next();
});

app.param("to",function(req,res,next,to){
	req.to=parseInt(to,0)
	next();
});


app.get("/",require('./routes').default);

// to use mongo, mongoose must be added to the package.json file
// require('./routes/mongo')(app);

require('./routes/login')(app,passport);
require('./routes/session')(app);
//require('./routes/sequelize')(app);


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
	next();
});

app.get("/count",function(req,res){
	res.send( ""+ count);
});


app.get("/range/:from-:to",function(req,res){
	// var from=parseInt( req.params.from , 0)
	// var to=parseInt( req.params.to , 10)
	//res.json(users.slice(from,to+1))
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


function getAllMethods(object) {
	return Object.getOwnPropertyNames(object);
}


// catch all the 404 uris
app.use(function(req,res){
	res.send(404,"Fuurr oh furrr");
});

// http.createServer(app).listen(app.get('port'), function(){
// 	console.log('Express server listening on port ' + app.get('port'));
// });


var server = app.listen(app.get('port'));
var io = require('socket.io').listen(server);
io.set('loglevel',10) // set log level to get all debug messages
io.on('connection',function(socket){
  socket.emit('init',{msg:"test"})
})
