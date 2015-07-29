var selectedUser = new ReactiveVar(undefined);

Template.ControlUnitSettings.controlUnits = function(){
    var selectedUserId = selectedUser.get();
    var filter = {};

    if(selectedUserId){     //Filter by user id
        filter.owner = selectedUserId;
    }

    //Fetch all devices that matches the filter
    return ControlUnits.find(filter).fetch();
}

Template.ControlUnitSettings.events({
    'click .js-create': function(event, template){
        var domRoot = $('body')[0];
        Blaze.renderWithData(Template.CreateControlUnit, undefined, domRoot);
    },
    'click .js-info': function(event, template){
        var domRoot = $('body')[0];
        Blaze.renderWithData(Template.ViewControlUnit, this, domRoot);
    },
    'click .control-unit .js-remove': function(event, template){
        Meteor.call('removeControlUnit', this.controlUnitId, function(error, result){
            if(error){
                MessageBox.displayError("Failed to remove control unit", "An error occurred when removing control unit. The error message was: " + error);
            }else{
                MessageBox.displayInfo("Success", "Successfully removed control unit");
            }
        });
    },
    'change .filter-user select': function(event, template) {
        var select = template.find('.filter-user select');
        var userId = select.value;

        if(userId === "")
            selectedUser.set(undefined);
        else
            selectedUser.set(userId);
    },
    'click .control-unit .js-remove': function(event, template) {
        Meteor.call('removeControlUnit', this.controlUnitId, function(error, result){
            if(error){
                MessageBox.displayError("Failed to remove control unit", "An error occurred when removing control unit. The error message was: " + error);
            }else{
                MessageBox.displayInfo("Success", "Successfully removed control unit");
            }
        });
    }
});