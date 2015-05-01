var selectedUser = new ReactiveVar(null);

Template.Home.helpers({
    selected: function() {
        var isUserSelected = this._id === selectedUser.get()._id;   //Check if the user we are currently iterating over is the same user that is selected
        return (isUserSelected) ? "selected" : "";
    }
});

Template.Home.onCreated(function() {
    //Set the currently logged in user as the default selected user when the homepage is rendered
    selectedUser.set(Meteor.user());
});

Template.Home.events({
    'click .person': function(event) {
        selectedUser.set(this);
    }
});