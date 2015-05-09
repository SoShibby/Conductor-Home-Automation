Template.AddFriend.events = {
    'click .js-add': function(event, template){
        var form = template.find('form');
        var formData = $(form).serializeObject();
        
        Meteor.call('addFriend', formData.email, function(error, result){
            if(error){
                MessageBox.displayInfo("Failed to add a new friend", "An error occurred when adding a new friend. The error message was: " + error);
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