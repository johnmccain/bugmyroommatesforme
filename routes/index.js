var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user.model');

// Define routes.
router.get('/',
	function(req, res) {
		res.render('index', {
			user: req.user
		});
	});

//login & logout
router.get('/login/',
	function(req, res) {
		res.render('login');
	});

router.post('/login/',
	passport.authenticate('local', {
		successRedirect: '/app/',
		failureRedirect: '/login',
		failureFlash: true
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
		res.render('signup');
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
