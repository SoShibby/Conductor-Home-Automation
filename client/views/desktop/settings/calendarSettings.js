Template.CalendarSettings.helpers({
    events: function() {
        // If this user doesn't got a calendar then just exit
        if(!this.feed || !this.feed[0].calendar)
            return;

        var events = this.feed[0].calendar.events;

        // Sort events after their start date
        events.sort(function(event1, event2) {
            return (event1.start > event2.start) ? 1 : -1
        });

        return events;
    },
    start: function() {
        var startDate = moment(this.start);
        return Format("{0} ({1})", startDate.format("YYYY-MM-DD HH:mm"), startDate.fromNow());
    },
    end: function() {
        return moment(this.end).format("YYYY-MM-DD HH:mm");
    }
});

Template.CalendarSettings.events({
    'click .js-share-calendar': function() {
        var body = $('body')[0];
        Blaze.render(Template.ShareCalendar, body);
    },
    'click .js-refresh': function() {
        Meteor.call('refreshEvents', function(error, result){
            if(error){
                MessageBox.displayError("Failed to update events", "An error occurred updating events. The error message was: " + error);
            }else{
                MessageBox.displayInfo("Success", "Events updated successfully.");
            }
        });
    }
});