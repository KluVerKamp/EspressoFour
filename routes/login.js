// app/routes.js
var cnx_error;


module.exports = function(app,passport) {
	
	require('../config/passport')(passport); // pass passport for configuration		

	app.get('/auth', function(req, res) {
		res.render('auth/index',{errors: cnx_error}); // load the index file
	});

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/auth/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('auth/login', { errors:req.flash('loginMessage')});
	});

	// process the login form
	app.post('/auth/login', passport.authenticate('local-login', {
		successRedirect : '/auth/profile', // redirect to the secure profile section
		failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/auth/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('auth/signup', { erros: req.flash('signupMessage').concat(cnx_error) });
	});

	// process the signup form
	app.post('/auth/signup', passport.authenticate('local-signup', {
		successRedirect : '/auth/profile', // redirect to the secure profile section
		failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/auth/profile', isLoggedIn, function(req, res) {
		var user;
		try{
			user = req.user.dataValues;
		}
		catch(e){
			console.error(e);
		}
		res.render('auth/profile', {
			user : user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.redirect('/auth/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/auth/');
}
