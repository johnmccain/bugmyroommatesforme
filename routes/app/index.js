var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.model');

router.get('/',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		res.send('dont worry be appy');
	});

module.exports = router;
