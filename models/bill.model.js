var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	User = require('./user.model'),
	Pad = require('./pad.model'),
	PaymentScheme = require('./paymentscheme.model'),
	TransactionRecord = require('./transactionrecord.model');

//A bill represents one of potentially multiple bills to be paid
var Bill = new Schema({
	name: {
		type: String,
		required: true
	},
	paymentschemes: [{
		type: Schema.ObjectId,
		ref: 'PaymentScheme',
	}],
	balance: {
		type: Number,
		required: false,
		default: 0
	},
	//note: transactions should be *pushed* onto this array so that TransactionRecords are in chronological order
	transactions: [{
		type: Schema.ObjectId,
		ref: 'TransactionRecord'
	}],
	accountholders: [{
		type: Schema.ObjectId,
		ref: 'User',
		required: false
	}],
});

// /**
//  * Recalculate current bill balance based on all TransactionRecords
//  * @return {Promise} resolves when balance is successfully updated
//  */
// Bill.methods.updateBalance = function() {
// 	return (new Promise(function(resolve, reject) {
// 		this.populate('transactions').exec((err, bill) => {
// 			let balance = 0;
// 			this.transactions.map((transaction) => {
// 				balance += transaction.amount;
// 			});
// 			this.balance = balance;
// 			this.save(function(err) {
// 				if (!err) {
// 					resolve('Balance Updated');
// 				} else {
// 					console.log(err);
// 					reject(Error('Error updating bill balance: ' + err));
// 				}
// 			});
// 		});
// 	}));
// };

module.exports = mongoose.model('Bill', Bill);
