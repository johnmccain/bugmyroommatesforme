var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model'),
	Post = require('./post.model');

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
	}],
	posts: [{
		type: Schema.ObjectId,
		ref: 'Post'
	}],
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
Pad.plugin(deepPopulate);

module.exports = mongoose.model('Pad', Pad);
