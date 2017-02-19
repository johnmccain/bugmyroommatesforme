//handle redirect for user search
function userSearch() {
	let searchExpression = $('#user-search-expression').val();
	if(searchExpression) {
		document.location.href = '/app/user/search/' + searchExpression;
	}
}
