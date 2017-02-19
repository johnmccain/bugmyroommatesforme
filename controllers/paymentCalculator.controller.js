//paymentCalculator.controller.js
//Logic for calculating how much each roommate owes towards each bill
//(currently unused file, refactored into bill.controller.js)


class Bill {
	constructor(_id, name, balance, Users, paymentFees) {
		this._id = _id;
		this.name = name;
		this.balance = balance; //remaining balance to pay on the bill
		this.Users = Users;
		this.paymentFees = paymentFees;
	}
}


//User = Name, Amount already paid towards this bill, ratio or share of the debt
var Users = [
	[{
		"name": "John",
		"paid": 0.00,
		"ratio": 0.4
	}, {
		"name": "Matt",
		"paid": 0.00,
		"ratio": 0.2
	}, {
		"name": "Liia",
		"paid": 0.00,
		"ratio": 0.2
	}, {
		"name": "Ryan",
		"paid": 0.00,
		"ratio": 0.2
	}],
	[{
		"name": "John",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Matt",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Liia",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Ryan",
		"paid": 0.00,
		"ratio": 0.25
	}],
	[{
		"name": "John",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Matt",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Liia",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Ryan",
		"paid": 0.00,
		"ratio": 0.25
	}],
	[{
		"name": "John",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Matt",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Liia",
		"paid": 0.00,
		"ratio": 0.25
	}, {
		"name": "Ryan",
		"paid": 0.00,
		"ratio": 0.25
	}]
];

var localRatios = false;

var water = new Bill(1, "Water", 150.11, Users[0], 3.00);
var electric = new Bill(2, "Electric", 120.05, Users[1], 4.00);
var gas = new Bill(3, "Gas", 75.00, Users[2], 0);
var cable = new Bill(4, "Cable", 50.00, Users[3], 0);
var bills = []; //placeholder bills, get list of bills from model
bills.push(water);
bills.push(electric);
bills.push(gas);
bills.push(cable);

//sort the bills in descending order of additional payment fees.
//e.g. the water bill has a 3.00 credit card fee
//     the electric bill has a 4.00 credit card fee
//     no other bills have fees
//     The bills list will be sorted as [electric, water, gas, cable]
bills.sort(function(a, b) {
	return parseFloat(b.paymentFees) - parseFloat(a.paymentFees);
});


var payShares = [
	[]
];
var currentBill;
var currentUser;
var remainder;
if (localRatios) {
	for (var i = 0; i < bills.length; i++) {
		payShares.push([]);
		currentBill = bills[i];

		//remainder will never be more than 3 cents so it is just split up between all the members
		remainder = Math.round((currentBill.balance * 100) % Users[i].length);
		console.log(remainder + " = " + currentBill.balance + " % " + Users[i].length / 100);
		for (var j = 0; j < bills[i].Users.length; j++) {
			currentUser = currentBill.Users[j];
			if (remainder > 0) {
				payShares[i].push({
					"User": currentUser.name,
					"amount": Math.floor((currentUser.ratio * currentBill.balance) * 100 + 1) / 100
				});
				remainder--;
			} else {
				payShares[i].push({
					"User": currentUser.name,
					"amount": Math.floor((currentUser.ratio * currentBill.balance) * 100) / 100
				});
			}
		}
	}
} else {
	//Splitting all bill debts evenly

	//add up the total remaining balance for all the bills
	var billsTotal = 0;
	for (var i = 0; i < bills.length; i++) {
		billsTotal += bills[i].balance;
	}

	var maxPayBillIndex = 0;
	var maxPayers = 1;
	for (var i = 0; i < Users.length; i++) {
		if (Users[i].length > maxPayers) {
			maxPayers = Users[i].length;
			maxPayBillIndex = i;
		}
	}

	var UserPayRecords = Users[maxPayBillIndex];


	//If there is no way to split the total evenly,
	//$0.01 will be distributed to roommates till it can be evenly split
	remainder = Math.round((billsTotal * 100) % maxPayers);
	var evenSplitPayment = (billsTotal - remainder) / maxPayers;
	var currentBillBalance = 0;
	var userIterator = 0;
	console.log("evenSplitPayment = " + evenSplitPayment);

	for (var i = 0; i < bills.length; i++) {
		payShares.push([]);
		currentBill = bills[i];
		currentBillBalance = bills[i].balance;

		while (currentBillBalance > 0 && userIterator < maxPayers) {
			currentUser = UserPayRecords[userIterator];
			if (currentUser.paid >= evenSplitPayment) { //current user has paid their share already
				userIterator++;
			} else if (evenSplitPayment - currentUser.paid >= currentBillBalance) { //current user can pay the rest of this bill's balance
				currentUser.paid += currentBillBalance;
				if (remainder > 0) {
					payShares[i].push({
						"User": currentUser.name,
						"amount": Math.round(currentBillBalance * 100 + 1) / 100
					});
					remainder--;
				} else {
					payShares[i].push({
						"User": currentUser.name,
						"amount": Math.round(currentBillBalance * 100) / 100
					});
				}
				currentBillBalance = 0;
			} else { //currentUser still needs to pay some money, but not the entire remaining balance of this bill
				if (remainder > 0) {
					payShares[i].push({
						"User": currentUser.name,
						"amount": Math.round((evenSplitPayment - currentUser.paid) * 100 + 1) / 100
					});
					remainder--;
				} else {
					payShares[i].push({
						"User": currentUser.name,
						"amount": Math.round((evenSplitPayment - currentUser.paid) * 100) / 100
					});
				}
				currentBillBalance -= evenSplitPayment - currentUser.paid;
				currentUser.paid = evenSplitPayment;
			}
		}

		if (currentBillBalance > 0) {
			console.log("Error! Not all bills were able to be paid!");
		}
	}
}


var paymentPlan = {
	"Bills": []
}; //Object to hold the bills objects that will list the users that need to pay that bill
for (var i = 0; i < payShares.length - 1; i++) {
	paymentPlan.Bills.push({
		"BillID": (bills[i]._id),
		"Users": []
	});
	console.log(paymentPlan.Bills[i]);



	for (var j = 0; j < payShares[i].length; j++) {
		paymentPlan.Bills[i].Users.push(payShares[i][j]);
		console.log(paymentPlan.Bills[i].Users[j]);
	}
}
