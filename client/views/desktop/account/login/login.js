Template.Login.events = {
    'click .js-login': function(event, template){
        var form = template.find('form');
        var formData = $(form).serializeObject();

        Meteor.loginWithPassword(formData.email, formData.password, function(error){
            if(error){
                alert("Unable to login. Reason: " + error.reason);
            }else{
                Router.go('home');
            }
        });

        return false;
    }
}