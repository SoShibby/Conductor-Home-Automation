Router.route('home', {
	path: '/',
	layoutTemplate: 'DesktopLayout'
});

Router.route('lights', {
	path: '/lights',
	layoutTemplate: 'DesktopLayout',
	data: {
				devices: Devices.find({})
		  }
});