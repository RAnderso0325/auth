var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

router.get('/login', function(req,res){
	res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	successFlash: 'Login Successful!',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid Credentials'
}));

router.get('/signup', function(req,res){
	res.render('auth/signup');
});

router.post('/signup', function(req,res, next){
	console.log('req.body is', req.body);
	db.user.findOrCreate({
		where: {username: req.body.username},
		defaults: {
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			password: req.body.password
		}
	}).spread(function(user, wasCreated){
		if(wasCreated){
			//good job, no duplicate nice
			//and we were sucesssssful at creating you
			passport.authenticate('local', {
				successRedirect: '/profile',
				successFlash: 'Signup Successful!'
			})(req, res, next);
		}else{
			//bad job you tried to make a duplicate
			//should have logged in
			req.flash('error', 'Username already exists');
			res.redirect('/auth/login');
		}
	}).catch(function(err){
		req.flash('error', err.message);
		res.redirect('/auth/signup');
	});
});

router.get('/logout', function(req,res){
	req.logout();
	req.flash('success', 'Successfully logged out');
});

module.exports = router;