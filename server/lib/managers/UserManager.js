User = (function() {
    function isUserLoggedIn(userId){
        return userId !== null;
    }

    function isEmailVerified(userId){
        var user = Meteor.users.findOne({ $and: [
                                                { _id: userId },
                                                { 'emails.verified': true }
                                            ]});
        return user !== undefined;
    }

    function getEmail(userId){
        var user = Meteor.users.findOne(userId);

        if(!user){
            throw new Meteor.Error(500, "No user exists with the userId '" + userId + "'");
        }

        return user.emails[0].address;
    }

    function getUserIdByEmail(email){
        var user = Meteor.users.findOne({ 'emails.address': email });

        if(!user){
            throw new Meteor.Error(500, "No user exists with the email '" + email + "'");
        }

        return user._id;
    }

    function isEmailInUse(email){
        var existingEmail = Meteor.users.findOne({ 'emails.address': email });
        return existingEmail !== undefined;
    }

    function isValidEmailAddress(email){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    return {
        isUserLoggedIn: isUserLoggedIn,
        isEmailVerified: isEmailVerified,
        getEmail: getEmail,
        getUserIdByEmail: getUserIdByEmail,
        isEmailInUse: isEmailInUse,
        isValidEmailAddress: isValidEmailAddress
    }
}());