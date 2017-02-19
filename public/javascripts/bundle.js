'use strict';

//handle redirect for user search
function userSearch() {
	var searchExpression = $('#user-search-expression').val();
	if (searchExpression) {
		document.location.href = '/app/user/search/' + searchExpression;
	}
}

function billVerify() {
	var sum = 0;
	$('.numeric-check').map(function () {
		sum += $(this).val();
	});

	if (sum > 1.01 || sum < 0.99) {
		alert('The total sum of ratios in a payment scheme must be equal to 1.');
		return false;
	}
	return true;
}