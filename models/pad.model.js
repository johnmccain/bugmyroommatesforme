var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model');

//A pad represents a shared residence or organization to be managed
var Pad = new Schema({
	name: {
		type: String,
		required: true
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
});

module.exports = mongoose.model('Pad', Pad);
