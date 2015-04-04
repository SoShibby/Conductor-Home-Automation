Meteor.publish("devices", function () {
    return Devices.find();
});

Meteor.publish("locations", function () {
    return Locations.find();
});