var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model'),
	Pad = require('./pad.model'),
	PaymentScheme = require('./paymentscheme.model'),
	Bill = require('./bill.model');

//A bill represents one of potentially multiple bills to be paid
var TransactionRecord = new Schema({
	//positive for payments, negative for bills
	amount: {
		type: Number,
		require: true
	},
	//user only needed for payments
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		require: false
	},
	date: {
		type: Date,
		require: true,
		default: Date.now()
	},
	//due dates only needed for invoices
	duedate: {
		type: Date,
		require: false
	}
});

module.exports = mongoose.model('TransactionRecord', TransactionRecord);
