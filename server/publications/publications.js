Meteor.publish("devices", function () {
    return Devices.find();
});

Meteor.publish("locations", function () {
    return Locations.find();
});

Meteor.publish("controlUnits", function () {
    return ControlUnits.find();
});