var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.model');
var Pad = require('../../models/pad.model');


//create
router.get('/new',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		res.render('pad/new');
	});

router.post('/new',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		var pad = new Pad({
			name: req.body.name,
			description: req.body.description
		});
		pad.users.push(req.user);
		pad.save(function(err, pad) {
			if (err) {
				// req.flash('info', 'Error in creating a pad ' + req.body.name);
				return console.error(err);
			}
			console.log(pad);
			// req.flash('info', 'Succesfully created a pad ' + req.body.name);
		});
	});

//edit
router.get('/edit/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		Pad.findById(req.params.id)
		.exec(function(err, pad) {
			if (err) return res.send(500, {
				error: err
			});
			res.render('pad/edit', {
				pad: pad
			});
		});
	});

router.post('/edit/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res, next) {
		//submit, generate success feedback
		Pad.findOneAndUpdate({
			_id: req.params.id
		}, {
			name: req.body.name,
			description: req.body.description
		}, function(err, pad) {
			if (err) return res.send(500, {
				error: err
			});
			return res.send("Succesfully edited a pad");
		});
	});

//delete
//TODO

//view (this has to go at end or it will catch all other pads and treat their paths as an id)
router.get('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		Pad.findById(req.params.id)
		.populate('users')
		.exec(function(err, pad) {
			if (err) {
				console.log(err);
				return res.send(500, {
					error: err
				});
			}
			console.log(pad);

			res.render('pad/view', {
				pad: pad
			});
		});


	});

module.exports = router;
