var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	email: {
		type: String,
		required: true
	},

	fbid: {
		type: String,
		required: false
	},
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
