Template.CreateControlUnit.events = {
    'click .js-create': function(event, template){
        var form = template.find('form');
        var formData = $(form).serializeObject();
        
        Meteor.call('addControlUnit', formData.controlUnitName, function(error, result){
            if(error){
                MessageBox.displayInfo("Failed to add control unit", "An error occurred when creating a new control unit. The error message was: " + error);
            }else{
                Blaze.remove(template.view);
                $(template.firstNode).remove();
            }
        });
    },
    'click .js-close': function(event, template){
        Blaze.remove(template.view);
        $(template.firstNode).remove();
    }
}