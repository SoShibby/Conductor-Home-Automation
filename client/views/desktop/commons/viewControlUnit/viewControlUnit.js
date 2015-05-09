Template.ViewControlUnit.helpers({
    'owner': function() {
        var user = Meteor.users.findOne({ _id: this.owner });
        return Format('{firstName} {lastName} ({emails.0.address})', user); 
    },
    devices: function() {
        return Devices.find({ controlUnitId: this.controlUnitId });
    }
});

Template.ViewControlUnit.events({
    'click .js-close': function(event, template) {
        Blaze.remove(template.view);
        $(template.firstNode).remove();
    },
    /* View device information */
    'click .js-info': function(event, template){
        var domRoot = $('body')[0];
        Blaze.renderWithData(Template.ViewDevice, this, domRoot);
    }
});