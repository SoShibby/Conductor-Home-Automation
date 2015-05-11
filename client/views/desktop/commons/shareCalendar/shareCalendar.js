Template.ShareCalendar.events({
    'click .js-share': function(event, template) {
        var email = template.$('input[name="email"]').val();
        
        Meteor.call('shareCalendar', email, function(error, result){
            if(error){
                MessageBox.displayInfo("Failed to share calendar", "An error occurred when trying to share calendar. The error message was: " + error);
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
});