var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model'),
  Pad = require('./pad.model');

  var Post = new Schema({
    content: {
      type: String,
      required: true
    },
    user:{
  		type: Schema.ObjectId,
  		ref: 'User'
  	},
  /*  pad: {
  		type: Schema.ObjectId,
  		ref: 'Pad'
  	},*/
  });

module.exports = mongoose.model('Post', Post);
