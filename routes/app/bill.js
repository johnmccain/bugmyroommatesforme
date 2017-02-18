var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../../models/user.model');
var Pad = require('../../models/pad.model');
var Bill = require('../../models/bill.model');
var PaymentScheme = require('../../models/paymentscheme.model');
var router = express.Router();


router.get('/new/:id',
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

			res.render('bill/new', {
				users: pad.users
			});
		});
	});

router.post('/new/:id',
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
			console.log(req.body);

			let name = req.body.name;
			let ratios = [];
			for(let i = 0; i < pad.users.length; ++i) {
				let ratio = {};
				ratio.user = pad.users[i]._id;
				ratio.ratio = req.body[pad.users[i]._id];
				ratios.push(ratio);
			}
			let accountholders = (typeof req.body.accountholders !== "object") ? [req.body.accountholders] : req.body.accountholders;
			let bill = new Bill({name: name, accountholders: accountholders});
			//TODO: save paymentschemes
			var schemecounter = ratios.length;
			ratios.map(function(ratio) {
				let paymentscheme = new PaymentScheme({user: ratio.user, ratio: ratio.ratio});
				paymentscheme.save(function(err) {
					if(err) {
						//oh no
						console.log(err);
						return res.send(500, {error: err});
					}
					bill.paymentschemes.push(paymentscheme);
					if(--schemecounter <= 0) {
						//time to save the bill
						bill.save(function(err) {
							if(err) {
								//oh no
								console.log(err);
								return res.send(500, {error: err});
							}
							else res.send('yay!');

						});
					}
				});
			});
		});
	});

//put in bills here
router.get('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		Bill.findById(req.params.id).populate('bills');
		res.render('bill/view');
	});

module.exports = router;
