Accounts.config({ sendVerificationEmail: true, 
				  forbidClientAccountCreation: false });

Accounts.onCreateUser(function(options, user) {
	user.firstName = options.firstName;
	user.lastName = options.lastName;

	user.friends = {};
	user.friends.confirmed = [];
	user.friends.unconfirmed = [];
	user.friends.requests = [];
	
	return user;
});

Accounts.validateNewUser(function(user){
	if(user.emails === undefined || !User.isValidEmailAddress(user.emails[0].address))
		throw new Meteor.Error(ErrorCode.INVALID_EMAIL_ADDRESS);
		
	if(User.isEmailInUse(user.emails[0].address))
		throw new Meteor.Error(ErrorCode.EMAIL_ALREADY_IN_USE);
	
	if(user.firstName === undefined || user.firstName.length === 0)
		throw new Meteor.Error(ErrorCode.INVALID_FIRST_NAME);
	
	if(user.lastName === undefined || user.lastName.length === 0)
		throw new Meteor.Error(ErrorCode.INVALID_LAST_NAME);
	
	return true;
});				  