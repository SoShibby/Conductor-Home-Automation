Template.Header.helpers({
	time: function(){
		return moment().format('hh:mmA');
	},
	date: function(){
		return moment().format('M MMMM YYYY');
	}
});