Meteor.publish("devices", function() {
    if (this.userId) {
        return Devices.find({
            userAccess: {
                $in: [this.userId]
            }
        });
    }
});

Meteor.publish("locations", function() {
    if (this.userId) {
        return Locations.find({
            creator: this.userId
        });
    }
});

Meteor.publish("controlUnits", function() {
    if (this.userId) {
        return ControlUnits.find({
            owner: this.userId
        });
    }
});

Meteor.reactivePublish("confirmedFriends", function() {
    if (this.userId) {
        var user = Meteor.users.findOne({
            _id: this.userId
        }, {
            reactive: true
        });
        return Meteor.users.find({
            _id: {
                $in: user.friends.confirmed
            }
        }, {
            fields: {
                friends: 0
            }
        });
    }
});

Meteor.reactivePublish("unconfirmedFriends", function() {
    if (this.userId) {
        var user = Meteor.users.findOne({
            _id: this.userId
        }, {
            reactive: true
        });
        return Meteor.users.find({
            _id: {
                $in: user.friends.unconfirmed
            }
        }, {
            fields: {
                friends: 0
            }
        });
    }
});

Meteor.reactivePublish("friendRequests", function() {
    if (this.userId) {
        var user = Meteor.users.findOne({
            _id: this.userId
        }, {
            reactive: true
        });
        return Meteor.users.find({
            _id: {
                $in: user.friends.friendRequests
            }
        }, {
            fields: {
                friends: 0
            }
        });
    }
});

Meteor.publish("myProfile", function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                services: 0
            }
        });
    }
});

Meteor.publish("feeds", function() {
    if (this.userId) {
        return Feeds.find({
            owner: this.userId
        });
    }
});

Meteor.publish("calendarMappings", function() {
    return CalendarMappings.find({
        owner: this.userId
    });
});

Meteor.publish("triggerActions", function() {
    if (this.userId) {
        return TriggerActions.find({
            owner: this.userId
        });
    }
});