var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model'),
  Pad = require('./pad.model');

  var PaymentScheme = new Schema({
    name:{
      type: String,
      required: true
    },
    users:[{
      type: Schema.ObjectId,
      ref: 'User'
    }],
    ratio:{
      type: Number,
      required : true
    }
  });

module.exports = mongoose.model('PaymentScheme', PaymentScheme);
