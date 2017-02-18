var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model');

//A pad represents a shared residence or organization to be managed
var Pad = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: '',
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	bills: [{
		type: Schema.ObjectId,
		ref: 'Bill'
	}]
});

module.exports = mongoose.model('Pad', Pad);
