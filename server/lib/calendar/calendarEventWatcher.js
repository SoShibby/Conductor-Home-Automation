CalendarEventWatcher = (function() {

    function start() {
        IntervalHelper.runEveryMinute(function(){
            checkForEvents();
        });
    }

    function checkForEvents() {
        //When searching for calendar events we need to specify a time interval.
        //This is because if an event happens at 15:00:00 and we get the current time as 15:00:01 we would get no results
        //so because of this we specify the interval as current time and 1 minute before. example 14:59:01 and 15:00:01
        var startInterval = moment().subtract(1, 'minutes');
        var endInterval = moment();
        startInterval.seconds(1);
        endInterval.seconds(1);

        //Get all calendar mappings, where every map name corresponds to a google calendar event name (the one that shows up in your google calendar)
        var mappings = CalendarMappings.find().fetch();

        //Loop through all calendar mappings
        mappings.forEach(function(mapping) {
            var userId = mapping.owner;

            console.log('---- Searching for google calendar events that matches "' + mapping.name + '" ------');

            //The timeOffset on the mapping is counted in minutes and is used for when you want something to happend
            //a certain amount of minutes before or after the event is due. Example if you have a google calendar event with
            //the name "work" at 15:00:00 and you want your wake up clock to ring 20 minutes before, you add -20 to the mappings timeoffset
            //and "work" as the map name
            var start = startInterval.clone();
            var end = endInterval.clone();
            start.add(mapping.timeOffset, 'minutes');
            end.add(mapping.timeOffset, 'minutes');

            var events = CalendarFacade.getCalendarEvents(userId);

            // Remove events that isn't in the interval that we are looking for
            events = events.filter(function(event) {
                return (event.start >= start && event.start <= end);
            });

            events.forEach(function(event) {
                //Check if the google calendar event summary is the same as the mapping name
                if(event.summary.toLowerCase() == mapping.name.toLowerCase()){
                    console.log('---- Google calendar event match was found. Sending data to controller ----');
                    Controller.send(mapping.value);     //Send the map value to the controller, which will send the command to the matching control units
                }
            });
        });
    }

    // Return public functions
    return {
        start: start
    }
}());