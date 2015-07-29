Accounts.config({ sendVerificationEmail: true,
                  forbidClientAccountCreation: false });

Accounts.onCreateUser(function(options, user) {
    try {
        user.firstName = options.firstName;
        user.lastName = options.lastName;

        user.friends = {};
        user.friends.confirmed = [];
        user.friends.unconfirmed = [];
        user.friends.requests = [];

        console.log('Creating calendar for user ' + user.firstName + ' ' + user.lastName);
        CalendarFacade.createCalendar(user._id, "Homeautomation", function(error, calendar) {
            CalendarFacade.shareCalendar(calendar.id, Properties.GOOGLE_CALENDAR_EMAIL);
            CalendarFacade.shareCalendar(calendar.id, user.emails[0].address);
        });

        return user;
    } catch(ex) {
        console.log('Error occured when creating new user, error was: ' + ex);
        throw ex;
    }
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