var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/user.model');
var Pad = require('../models/pad.model');
var Bill = require('../models/bill.model');
var PaymentScheme = require('../models/paymentscheme.model');

var BillController = {};

/**
 * Recalculate current bill balance based on all TransactionRecords
 * @param {string} id the id of the bill to update the balance of
 * @return {Promise} resolves when balance is successfully updated
 */
BillController.updateBalance = function(id) {
	return (new Promise(function(resolve, reject) {
		Bill.findById(id)
			.populate('transactions')
			.exec((err, bill) => {
				let balance = 0;
				bill.transactions.map((transaction) => {
					balance += transaction.amount;
				});
				bill.balance = balance;
				bill.save(function(err) {
					if (!err) {
						resolve('Balance Updated');
					} else {
						console.log(err);
						reject(Error('Error updating bill balance: ' + err));
					}
				});
			});
	}));
};

//gets how much each user owes (across all bills in the pad)
//precondition: no bills are overpaid (feature to be added later)
//(note: individual users may be overpaid but the pad should not be)
BillController.equalize = function(bills) {
	let users = {};
	bills.map((bill) => {
		let totaldebit = 0;
		bill.transactions.map((transaction) => {
			if(transaction.user) {
				//it's a user
				if(!users[transaction.user]) {
					users[transaction.user] = 0;
				}
				users[transaction.user] += transaction.amount;
			} else {
				//otherwise it's a bill
				totaldebit += transaction.amount; //this should be a negative value
			}
		});
		bill.paymentschemes.map((scheme) => {
			// precondition: scheme ratios add up to 1
			if(!users[scheme.user]) {
				//this user has never paid this bill
				users[scheme.user] = 0;
			}
			//subtract total amount user paid by amount they should have
			//a positive number means the user is ahead and owes nothing.  A
			//negative number implies they are behind (or just that a balance
			//is due and they are not far enough ahead to not pay)
			users[scheme.user] += (totaldebit * scheme.ratio);
		});
	});

	console.log('====================');
	console.log(users);
	console.log('====================');
	return users;
};

/**
//  * Calculates the difference between ideal payment predicted by the paymentscheme and actual payment records and uses the data to calculate what each roomate should pay on what
//  * @return {[type]} [description]
//  */
// BillController.rationalize = function(bills) {
// 	let payshares = [
// 		[]
// 	];
// 	for (var i = 0; i < bills.length; i++) {
// 		payShares.push([]);
// 		currentBill = bills[i];
//
// 		//remainder will never be more than 3 cents so it is just split up between all the members
// 		remainder = Math.round((currentBill.balance * 100) % currentBill.paymentschemes.length);
// 		console.log(remainder + " = " + currentBill.balance + " % " + Users[i].length / 100);
// 		for (var j = 0; j < currentBill.users.length; j++) {
// 			currentUser = currentBill.users[j];
// 			if (remainder > 0) {
// 				payShares[i].push({
// 					"user": currentUser._id,
// 					"amount": Math.floor((currentUser.ratio * currentBill.balance) * 100 + 1) / 100
// 				});
// 				remainder--;
// 			} else {
// 				payShares[i].push({
// 					"user": currentUser.name,
// 					"amount": Math.floor((currentUser.ratio * currentBill.balance) * 100) / 100
// 				});
// 			}
// 		}
// 	}
//
// 	var paymentPlan = {
// 		"Bills": []
// 	}; //Object to hold the bills objects that will list the users that need to pay that bill
// 	for (let i = 0; i < payShares.length - 1; i++) {
// 		paymentPlan.Bills.push({
// 			"BillID": (bills[i]._id),
// 			"Users": []
// 		});
// 		console.log(paymentPlan.Bills[i]);
//
// 		for (let j = 0; j < payShares[i].length; j++) {
// 			paymentPlan.Bills[i].users.push(payShares[i][j]);
// 			console.log(paymentPlan.Bills[i].users[j]);
// 		}
// 	}
// };
//
module.exports = BillController;
