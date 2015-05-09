Meteor.publish("devices", function () {
    if(this.userId){
        return Devices.find({ userAccess: { $in: [ this.userId ] } });
    }
});

Meteor.publish("locations", function () {
    return Locations.find();
});

Meteor.publish("controlUnits", function () {
    return ControlUnits.find();
});

Meteor.reactivePublish("confirmedFriends", function () {
    if(this.userId){
        var user = Meteor.users.findOne({ _id: this.userId }, {reactive: true});
        return Meteor.users.find({ _id: { $in: user.friends.confirmed } }, { fields: { friends: 0 }});
    }
});

Meteor.reactivePublish("unconfirmedFriends", function () {
    if(this.userId){
        var user = Meteor.users.findOne({ _id: this.userId }, {reactive: true});
        return Meteor.users.find({ _id: { $in: user.friends.unconfirmed } }, { fields: { friends: 0 }});
    }
});

Meteor.reactivePublish("friendRequests", function () {
    if(this.userId){
        var user = Meteor.users.findOne({ _id: this.userId }, {reactive: true});
        return Meteor.users.find({ _id: { $in: user.friends.requests } }, { fields: { friends: 0 }});
    }
});

Meteor.publish("myProfile", function () {
    if(this.userId){
        return Meteor.users.find({ _id: this.userId }, { fields: { services: 0 }});
    }
});