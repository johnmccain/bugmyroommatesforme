'use strict';

// $(document).ready(() => {
// 	$('.datepicker').datepicker();
// });

//handle redirect for user search
function userSearch() {
	var searchExpression = $('#user-search-expression').val();
	document.location.href = '/app/user/search/' + searchExpression;
}