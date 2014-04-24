
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


// var fs = require('fs');

// module.exports = function(app) {
//     fs.readdirSync(__dirname).forEach(function(file) {
//         if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
//             return;
//         var name = file.substr(0, file.indexOf('.'));
//         require('./' + name)(app);
//     });
// }

// //in app.js
// require('./routes')(app);