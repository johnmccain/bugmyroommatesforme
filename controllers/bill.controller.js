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

module.exports = BillController;
