module.exports = function(app){
	app.get("/socket",function(req,res){
  		res.render("chat/chat",{myIP:req.host,username:req.cookies.username});
	})

	app.get("/socket/username/:username",function(req,res){
		res.cookie("username",req.params.username).json();
	})
}
