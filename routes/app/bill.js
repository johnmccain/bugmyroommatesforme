var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.model');
var Bill = require('../../models/bill.model');

//put in bills here
router.get('/',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		res.send('bill time!');
	});

router.get('/newbill',
	function(req, res){
		res.render('newbill');
	});

router.post('/newbill', function(req, res){
	Bill.register(new Bill({
		name: req.body.name,
		paymentscheme: req.body.paymentscheme,
		duedate: req.body.duedate,
		accountholder: req.body.accountholder
	}));
});

module.exports = router;
