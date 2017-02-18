var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model'),
  Pad = require('./pad.model');
  PaymentScheme = require('./paymentscheme.model');

  //A bill represents one of potentially multiple bills to be paid
  var Bill = new Schema({
    name: {
      type: String,
      required: true
    },
    paymentscheme : {
      type: Schema.ObjectId,
      ref: 'PaymentScheme'
    },
    //payment record

    //due date
    duedate : {
      type: Date,
      required: true
    },
    //ObjectId for a user? Or string?
    accountholder: {
      type: Schema.ObjectId,
      ref: 'User',
      required: false
    },

  });

  module.exports = mongoose.model('Bill', Bill);
