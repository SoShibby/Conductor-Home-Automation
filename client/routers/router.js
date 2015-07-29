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
    only: ['home', 'lights', 'controlUnitSettings']
});

Router.route('home', {
    path: '/',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            people: Meteor.users.find().fetch()
        }
    },
    subscriptions: function() {
        return [
                    Meteor.subscribe('confirmedFriends'),
                    Meteor.subscribe('myProfile')
                ];
    },
    action: function () {
        if (this.ready()) {
            this.render();
        }
    }
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

Router.route('controlUnitSettings', {
    path: '/settings/control-unit',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            controlUnits: ControlUnits.find().fetch(),
            friends: Meteor.users.find({
                                           _id:{
                                              $ne: Meteor.userId()
                                           }
                                       }).fetch(),
            myUserId: Meteor.userId()
        }
    },
    subscriptions: function() {
        return [
                    Meteor.subscribe('controlUnits'),
                    Meteor.subscribe('myProfile'),
                    Meteor.subscribe('confirmedFriends'),
                    Meteor.subscribe('devices')
                ];
    },
    action: function () {
        GoogleMaps.load();

        if (this.ready()) {
            this.render();
        }
    }
});

Router.route('deviceSettings', {
    path: '/settings/devices',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            controlUnits: ControlUnits.find().fetch(),
            friends: Meteor.users.find({
                                           _id:{
                                              $ne: Meteor.userId()
                                           }
                                       }).fetch(),
            myUserId: Meteor.userId()
        }
    },
    subscriptions: function() {
        return [
                    Meteor.subscribe('controlUnits'),
                    Meteor.subscribe('devices'),
                    Meteor.subscribe('myProfile'),
                    Meteor.subscribe('confirmedFriends')
                ];
    },
    action: function () {
        GoogleMaps.load();

        if (this.ready()) {
            this.render();
        }
    }
});

Router.route('deviceAccessSettings', {
    path: '/settings/device-access',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            friends: Meteor.users.find({
                                           _id:{
                                              $ne: Meteor.userId()
                                           }
                                       }).fetch()
        }
    },
    subscriptions: function() {
        return [
                    Meteor.subscribe('controlUnits'),
                    Meteor.subscribe('devices'),
                    Meteor.subscribe('myProfile'),
                    Meteor.subscribe('confirmedFriends'),
                    Meteor.subscribe('unconfirmedFriends'),
                    Meteor.subscribe('friendRequests')
                ];
    },
    action: function () {
        GoogleMaps.load();

        if (this.ready()) {
            this.render();
        }
    }
});

Router.route('deviceLocationSettings', {
    path: '/settings/device-location',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            devices: Devices.find().fetch(),
            locations: Locations.find().fetch(),
            myUserId: Meteor.userId()
        }
    },
    subscriptions: function() {
        return [
                    Meteor.subscribe('controlUnits'),
                    Meteor.subscribe('devices'),
                    Meteor.subscribe('locations'),
                    Meteor.subscribe('myProfile'),
                    Meteor.subscribe('confirmedFriends')
                ];
    },
    action: function () {
        GoogleMaps.load();

        if (this.ready()) {
            this.render();
        }
    }
});

Router.route('sendCommandSettings', {
    path: '/settings/send-command',
    layoutTemplate: 'DesktopLayout',
    action: function () {
        if (this.ready()) {
            this.render();
        }
    }
});

Router.route('calendarSettings', {
    path: '/settings/calendar',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            feed: Feeds.find().fetch()
        }
    },
    subscriptions: function() {
        return [
                    Meteor.subscribe('feeds')
               ];
    },
    action: function () {
       if (this.ready()) {
            this.render();
        }
    }
});

Router.route('calendarMappingSettings', {
    path: '/settings/calendar-mapping',
    layoutTemplate: 'DesktopLayout',
    data: function() {
        return {
            mappings: CalendarMappings.find().fetch()
        }
    },
    subscriptions: function() {
        return [
                    Meteor.subscribe('calendarMappings')
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