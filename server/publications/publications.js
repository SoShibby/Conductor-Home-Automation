Meteor.publish("devices", function () {
    return Devices.find();
});

Meteor.publish("locations", function () {
    return Locations.find();
});

Meteor.publish("controlUnits", function () {
    return ControlUnits.find();
});

Meteor.reactivePublish("friends", function () {
	if(this.userId){
		var user = Meteor.users.findOne({ _id: this.userId }, {reactive: true});
        
        var friends = [];
        friends = friends.concat(user.friends.confirmed);
        friends = friends.concat(user.friends.unconfirmed);
        friends = friends.concat(user.friends.requests);        
		
        return Meteor.users.find({ _id: { $in: friends } }, { fields: { friends: 0, services: 0 }});
	}
});

Meteor.publish("myProfile", function () {
	if(this.userId){
		return Meteor.users.find({ _id: this.userId }, { fields: { services: 0 }});
	}
});