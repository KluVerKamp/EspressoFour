var db = require('../models')

module.exports= function(app){
	app.get("/authors",function(req,res){
		db.Author.findAll({}).success(function(authors) {
			res.render("index",{
				title: 'Express',
				authors: authors
			});
		})
	});

	app.get("/users",function(req,res){
		db.Client.find(  {where: {email:"amen@emworks.com"}}).success(function(user){
			res.json(user)
		})  ;
	
	});
}