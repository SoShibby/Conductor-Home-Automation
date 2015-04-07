Template.CreateAccount.events({
    'click .js-register': function(event, template){
		var form = template.find('form');
		var formData = $(form).serializeObject();

		Accounts.createUser(formData, function(error){
			if(error){
				alert("Unable to create a new account. Reason: " + ErrorHandler.GetErrorMessage(error.error));
			}else{
				alert("Your account has been created successfully. A verification code has been sent to your email address.");
				Router.go('login');
			}
		});
		
		return false;
	}
});