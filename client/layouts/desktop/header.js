Template.Header.time = function(){
	return moment().format('hh:mmA');
}

Template.Header.date = function(){
	return moment().format('M MMMM YYYY');
}