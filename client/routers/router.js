Router.route('home', {
	path: '/',
	layoutTemplate: 'DesktopLayout'
});

Router.route('Lights', {
	path: '/lights',
	layoutTemplate: 'DesktopLayout',
	data: {
				devices: Devices.find({})
		  }
});