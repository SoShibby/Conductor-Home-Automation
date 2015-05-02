Template.ViewControlUnit.helpers({
    'owner': function() {
        var user = Meteor.users.findOne({ _id: this.owner });
        return Format('{firstName} {lastName} ({emails.0.address})', user); 
    }
});

Template.ViewControlUnit.events({
    'click .js-close': function(event, template) {
        Blaze.remove(template.view);
		$(template.firstNode).remove();
    }
});