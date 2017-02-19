var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../../models/user.model');
var Pad = require('../../models/pad.model');
var Bill = require('../../models/bill.model');
var BillController = require('../../controllers/bill.controller');
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
				for (let i = 0; i < pad.users.length; ++i) {
					let ratio = {};
					ratio.user = pad.users[i]._id;
					ratio.ratio = req.body[pad.users[i]._id];
					ratios.push(ratio);
				}
				let accountholders = (typeof req.body.accountholders !== "object") ? [req.body.accountholders] : req.body.accountholders;
				let bill = new Bill({
					name: name,
					accountholders: accountholders
				});
				//TODO: save paymentschemes
				var schemecounter = ratios.length;
				ratios.map(function(ratio) {
					let paymentscheme = new PaymentScheme({
						user: ratio.user,
						ratio: ratio.ratio
					});
					paymentscheme.save(function(err) {
						if (err) {
							//oh no
							console.log(err);
							return res.send(500, {
								error: err
							});
						}
						bill.paymentschemes.push(paymentscheme);
						if (--schemecounter <= 0) {
							//time to save the bill
							bill.save(function(err) {
								if (err) {
									//oh no
									console.log(err);
									return res.send(500, {
										error: err
									});
								} else {
									//5 callbacks later...
									//time to add the bill to the pad
									pad.bills.push(bill._id);
									pad.save(function(err) {
										res.redirect('/app/bill/' + bill._id);
									});
								}
							});
						}
					});
				});
			});
	});

//this is for viewing a scheme
router.get('/scheme/:id', function(req, res) {
	PaymentScheme.findById(req.params.id)
	.populate('user')
	.exec(function(err, scheme) {
		if (err) {
			//oh no
			console.log(err);
			return res.send(500, {
				error: err
			});
		}
		res.render('bill/scheme/view', {
			scheme: scheme
		});
	});
});

router.get('/scheme/edit/:id', function(req, res) {
	PaymentScheme.findById(req.params.id)
	.populate('user')
	.exec(function(err, scheme) {
		if (err) {
			//oh no
			console.log(err);
			return res.send(500, {
				error: err
			});
		}
		res.render('bill/scheme/edit', {
			scheme: scheme
		});
	});
});

router.post('/scheme/edit/:id', function(req, res) {
	PaymentScheme.findById(req.params.id)
	.exec(function(err, scheme) {
		if (err) {
			//oh no
			console.log(err);
			return res.send(500, {
				error: err
			});
		}
		scheme.ratio = req.body.ratio;
		scheme.save(function(err) {
			if(err) {
				console.log(err);
			}
			res.redirect('/app/bill/scheme/' + req.params.id);
		});
	});
});

router.get('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		Bill.findById(req.params.id)
			.populate('transactions paymentschemes accountholders')
			.exec(function(err, bill) {
				console.log(bill);
				if (err) {
					//oh no
					console.log(err);
					return res.send(500, {
						error: err
					});
				}
				BillController.updateBalance(bill._id).then(() => {
					res.render('bill/view', {
						bill: bill
					});
				}).catch((msg) => {
					console.log(msg);
				});
			});
	});

module.exports = router;
