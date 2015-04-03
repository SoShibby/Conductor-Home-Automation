var currentDate = new ReactiveVar(moment());

Template.Header.helpers({
	time: function(){
		return currentDate.get().format('hh:mmA');
	},
	date: function(){
		return currentDate.get().format('M MMMM YYYY');
	}
});

setInterval(function() {
	currentDate.set(moment());
}, 1000);