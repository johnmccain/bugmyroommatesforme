var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose'),
	Pad = require('./pad.model');

var User = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	pads: [{
		type: Schema.ObjectId,
		ref: 'Pad'
	}],
	fbid: {
		type: String,
		required: false,
		unique: true
	},
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
