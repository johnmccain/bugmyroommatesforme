var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.model');
var Pad = require('../../models/pad.model');
// var async = require('async');

router.get('/',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		User.findById(req.user._id)
		.populate('pads')
		.exec(function(err, user) {
			console.log(user);
			if (err) return res.send(500, {
				error: err
			});
			res.render('app/index', {
				user: user
			});
		});
	});

module.exports = router;
