var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user.model');

// Define routes.
router.get('/',
	function(req, res) {
		res.locals.access = true;
		res.render('index', {

		});
	});

//login & logout
router.get('/login/',
	function(req, res) {
		res.locals.access = true;
		res.render('login',{access:true});
	});

router.post('/login/',
	passport.authenticate('local', {
		successRedirect: '/app/',
		failureRedirect: '/login',
		message: 'invaild credentials'
	}),
	function(req, res, err) {

	});

router.get('/logout/',
	function(req, res) {
		req.logout();
		res.redirect('/');
	});

router.get('/signup',
	function(req, res) {
		res.render('signup',{access:true});
	});

router.post('/signup', function(req, res) {
	User.register(new User({
		username: req.body.username,
		email: req.body.email,
	}), req.body.password, function(err, user) {
		if (err) {
			console.log(err);
		}
		passport.authenticate('local', {
			failureFlash: true
		})(req, res, function() {
			res.redirect('/app/');
		});
	});
});

module.exports = router;
