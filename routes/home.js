
/*
* GET home page.
*/

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.default = function(req, res){
	var authors = [{name :"Arbouch"},{name :"Amen"},{name :"Arabeque"},{name :"Arbi"},{name :"amen"}];
	messages = req.flash('info');
	errors = req.flash('errors');

	res.render('index', 
		{ 
			title: 'Express',contents:"Hello" ,
			messages: messages, 
			errors: errors,
			authors : authors
		}
	);
};