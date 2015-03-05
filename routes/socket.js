module.exports = function(app){
	app.get("/socket",function(req,res){
  		res.render("chat/chat",{title:"Chat",myIP:req.hostname+":"+app.get('port'),username:req.cookies.username});
	})

	app.get("/socket/username/:username",function(req,res){
		res.cookie("username",req.params.username).json();
	})
}
