var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.model');
var Pad = require('../../models/pad.model');

//edit
router.get('/edit/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		if (req.user._id != req.param.id) {
			return res.send(403, {
				error: 'Invalid user edit attempt'
			});
		}
		console.log(req.user);
		res.render('user/edit', {
			user: req.user
		});
	});

router.post('/edit/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res, next) {
		//submit, generate success feedback
		if (req.user._id != req.param.id) {
			return res.send(403, {
				error: 'Invalid user edit attempt'
			});
		}
		User.findOneAndUpdate({
			_id: req.params.id
		}, {
			username: req.body.username,
			email: req.body.email
		}, function(err, doc) {
			if (err) return res.send(500, {
				error: err
			});
			return res.send("Succesfully edited a user");
		});
	});

router.get('/search/:term',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		User.find({
				username: {
					"$regex": req.params.term,
					"$options": "i"
				}
			},
			function(err, users) {
				if (err) res.send(500, err);
				res.render('user/search', {
					users: users
				});
			});
	});


//view (this has to go at end or it will catch all other user pages and treat their paths as an id)
router.get('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		User.findById(req.params.id)
			.populate('pads')
			.exec(function(err, user) {
				if (err) {
					console.log(err);
					return res.send(500, {
						error: err
					});
				}
				if (!user) {
					res.send('No such user');
				}
				User.findById(req.user._id)
					.populate('pads')
					.exec(function(err, clientUser) {
						if (err) return res.send(500, err);
						console.log(req.user);
						let ownProfile = user._id === clientUser._id;
						res.render('user/view', {
							user: user,
							ownProfile: ownProfile,
							clientUser: clientUser,
						});
					});
			});
	});

router.post('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		if (req.body.pad) {
			User.findById(req.param.id)
				.exec(function(err, user) {
					if (err) return res.send(500, err);
					if (!user) return res.send(404, 'No such user');
					Pad.findById(req.body.pad)
						.exec(function(err, pad) {
							if (err) return res.send(500, err);
							pad.users.push(user._id);
							pad.save(function(err) {
								if (err) return res.send(500, err);
								user.pads.push(pad._id);
								user.save(function(err) {
									if (err) return res.send(500, err);
									res.redirect('/app/pad/' + pad._id);
								});
							});
						});
				});
		}
		res.redirect('/app/');
	});

module.exports = router;
