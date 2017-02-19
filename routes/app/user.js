var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.model');

//TODO: verify that accessed user is the requester

//edit
router.get('/edit/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		res.render('user/edit', {
			user: req.user
		});
	});

router.post('/edit/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res, next) {
		//submit, generate success feedback
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

//delete
//TODO

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
				console.log(user);

				res.render('user/view', {
					user: user
				});
			});
	});

module.exports = router;
