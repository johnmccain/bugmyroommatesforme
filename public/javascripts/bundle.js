'use strict';

//handle redirect for user search
function userSearch() {
	var searchExpression = $('#user-search-expression').val();
	if (searchExpression) {
		document.location.href = '/app/user/search/' + searchExpression;
	}
}