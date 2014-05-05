module.exports = function(app){
	app.get("/socket",function(req,res){
  		res.render("chat/chat",{myIP:req.host});
	})
}
