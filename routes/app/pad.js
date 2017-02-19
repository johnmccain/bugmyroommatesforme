var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.model');
var Pad = require('../../models/pad.model');
var Post = require('../../models/post.model');


//create
router.get('/new',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		res.render('pad/new');
	});


router.post('/new',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		console.log('creating a pad...');
		var pad = new Pad({
			name: req.body.name,
			description: req.body.description
		});
		pad.users.push(req.user._id);
		pad.save(function(err, pad) {
			if (err) {
				// req.flash('info', 'Error in creating a pad ' + req.body.name);
				return console.error(err);
			}
			console.log(pad);
			User.findById(req.user._id, function(err, user) {
				user.pads.push(pad._id);
				user.save(function() {
					res.redirect('/app/');
				});
			});
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


router.post('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req,res){
		let post = new Post({
			user : req.user._id,
			content : req.body.poststuff,
		});
		post.save(function(err) {
			if(err) return res.send(500, err);
			Pad.findById(req.params.id)
			.exec(function(err, pad){
				pad.posts.push(post._id);
				pad.save(function(err){
					if(err) return res.send(500, err);
					console.log(post.content);
					console.log(pad.posts.length);
					res.redirect('#');
				});
			});
	});

});
//delete
//TODO

//view (this has to go at end or it will catch all other pads and treat their paths as an id)
router.get('/:id',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res) {
		Pad.findById(req.params.id)
		.populate('users posts')
		.exec(function(err, pad) {
			if (err) {
				console.log(err);
				return res.send(500, {
					error: err
				});
			}


			console.log(pad);
			//add in username
			var html = '<br><br><form method="post">' +
						 '<input type="hidden" name="pad" placeholder="{{pad}}" />' +
						 '<input type="hidden" name="userName" placeholder="{{user.username}}" />' +
						 '<br><br><br>' +
						 'Enter your Post:' +
						 '<input type="textarea" name="poststuff" id="poststuff" rows="4" cols="50">  </input>' +
						 '<br>' +
						 '<button type="submit">Submit</button>' +
					'</form>';


			res.render('pad/view', {
				pad: pad,
				myform: html,
			});
		});

	});

module.exports = router;
