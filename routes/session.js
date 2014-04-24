module.exports = function(app){
	app.get("/cookie/:name",function(req,res){
		res.cookie("name",req.params.name).send("<p>done! to see the name visit <a href='/cookie'>this</a></p>");
	});

	app.get("/cookie",function(req,res){
		res.send(req.cookies.name);
	//res.clearCookie("name");
	});

	app.get("/session/:name",function(req,res,next){
		if(req.params.name === "arbi"){
			next();
		}
		else{
			if(req.params.name === "amenou"){
				err=new Error("u sure ?");
				err.status=404;
				next(err);
			}
			else{
				req.session.name = req.params.name;
				res.send("<p>done! to see the name visit <a href='/session'>this</a></p>");		
			}
		}
	});

	app.get("/session",function(req,res){
		res.send(req.session.name);
	});
}