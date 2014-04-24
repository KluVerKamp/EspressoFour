module.exports = function(app){

	var Mongoose=require("mongoose");

	Mongoose.connect("mongodb://localhost/helloExpress");

	var UserSchema = new Mongoose.Schema({
		name: String,
		email: String,
		age: Number
	});

	User = Mongoose.model("Users",UserSchema);

	app.get("/monusers",function(req,res){
		User.find({},function(err,docs){
			res.render("users/index",{users:docs});
		});
	//res.render("users/index",{  users: [{ name: "resque" },{ name: "hub" },{ name: "rip" },{ name: "Yo yo " }]});
	});


	app.get("/monusers/new/:name",function(req,res){
		new User({
			name:req.params.name,
			email:req.params.name+"@"+req.params.name+".com",
			age:"28"
		}).save(function(err,user){
			if (err)
				res.json(err)
			else
				res.send(user.name + " CREATED !")
		});
	});

	app.get("/monusers/:name",function(req,res){
		User.find({name:req.params.name},function(err,docs){
			res.json(docs[docs.length-1]);
		})
	});

	app.get("/monusers/rm/:name",function(req,res){
		User.remove({name:req.params.name},function(err,docs){
			res.json(docs, " Deleted");
		});
	});
}