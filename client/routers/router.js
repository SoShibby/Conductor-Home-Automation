Router.route('home', {
	path: '/',
	layoutTemplate: 'DesktopLayout'
});

Router.route('lights', {
	path: '/lights',
	layoutTemplate: 'DesktopLayout',
	data: function() {
			return {
				devices: Devices.find({}).fetch(),
				locationName: this.params.query.locationName 
			}
		  }
});