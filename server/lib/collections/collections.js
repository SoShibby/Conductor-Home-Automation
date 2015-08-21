Devices = new Meteor.Collection("devices");
Locations = new Meteor.Collection("locations");
ApiKeys = new Meteor.Collection("apiKeys");
ControlUnits = new Meteor.Collection("controlUnits");
Feeds = new Meteor.Collection("feeds");
CalendarMappings = new Meteor.Collection("calendarMappings");
TriggerActions = new Meteor.Collection("triggerActions");

Devices.allow({
    insert: function(userId, device) {
        return false;
    },
    update: function(userId, device, fields, modifier) {
        return false;
    },
    remove: function(userId, device) {
        return false;
    }
});

Locations.allow({
    insert: function(userId, location) {
        return false;
    },
    update: function(userId, location, fields, modifier) {
        return false;
    },
    remove: function(userId, location) {
        return false;
    }
});

ApiKeys.allow({
    insert: function(userId, apiKey) {
        return false;
    },
    update: function(userId, apiKey, fields, modifier) {
        return false;
    },
    remove: function(userId, apiKey) {
        return false;
    }
});

ControlUnits.allow({
    insert: function(userId, controlUnit) {
        return false;
    },
    update: function(userId, controlUnit, fields, modifier) {
        return false;
    },
    remove: function(userId, controlUnit) {
        return false;
    }
});

Feeds.allow({
    insert: function(userId, feed) {
        return false;
    },
    update: function(userId, feed, fields, modifier) {
        return false;
    },
    remove: function(userId, feed) {
        return false;
    }
});

CalendarMappings.allow({
    insert: function(userId, calendarMapping) {
        return false;
    },
    update: function(userId, calendarMapping, fields, modifier) {
        return false;
    },
    remove: function(userId, calendarMapping) {
        return false;
    }
});

TriggerActions.allow({
    insert: function(userId, triggerAction) {
        return false;
    },
    update: function(userId, triggerAction, fields, modifier) {
        return false;
    },
    remove: function(userId, triggerAction) {
        return false;
    }
});