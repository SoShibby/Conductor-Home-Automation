/*  Redirect logged out users to the login page    */
var OnBeforeActions = {
    loginRequired: function(pause) {
        if (!Meteor.userId()) {
            Router.go('login')
        } else {
            this.next();
        }
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    only: ['home', 'lights']
});

Router.route('home', {
    path: '/',
    layoutTemplate: 'DesktopLayout'
});

Router.route('lights', {
    path: '/lights',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            devices: DeviceFinder.find({ locationName: this.params.query.locationName }),    //Return only devices that are in the locationNames location
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

Router.route('create-account', {
    path: '/create-account'
});

Router.route('login', {
    path: '/login'
});