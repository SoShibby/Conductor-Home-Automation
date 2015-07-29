MailParser = (function() {
    function parse(from, to, sender, subject, text, html) {
        console.log("Received incomming mail from: " + sender);

        if(sender.indexOf("@calendar-server.bounces.google.com") > 0) {
            calendarMail(subject, text, html);
        }
    }

    function calendarMail(subject, text, html) {
        Fiber(function() {
            try {
                var users = Meteor.users.find().fetch();

                users.forEach(function(user) {
                    CalendarFacade.refreshEvents(user._id);
                });
            } catch(ex) {
                console.log("Error occured in calendar mail parser. Error message was: " + ex);
            }
        }).run();
    }

    // Return public functions
    return {
        parse: parse
    }
}());