Router.route('home', {
	path: '/',
	layoutTemplate: 'DesktopLayout'
});

Router.route('lights', {
	path: '/lights',
	layoutTemplate: 'DesktopLayout',
	data: function() {
			return {
				devices: DeviceFinder.find({ locationName: this.params.query.locationName }),	//Return only devices that are in the locationNames location
				locationName: this.params.query.locationName 
			}
		  },
	subscriptions: function() {
		return [
					Meteor.subscribe('devices'),
					Meteor.subscribe('locations')
				];
	},
	action: function () {
		if (this.ready()) {
			this.render();
		}
	}
});