Template.Notifications.helpers({
    oldNotifications: function() {
        //Populate the notifications with dummy data, just so we can see how the website will look
        return [{
                    description: "Overall temperature has been automatically risen to 23°C",
                    date: 1427919995000
                },
                {
                    description: "The washing machine was left on while nobody was home",
                    date: 1420143995000
                },
                {
                    description: "Dishwasher has finished the cycle",
                    date: 1417465595000
                }];
    },
    date: function() {
        return moment(this.date).format('h:mm MM MMMM YYYY');
    }
});

//Show the notifications drop down menu when the user clicks on a dom element
$('html').on('click', '.js-show-notifications', function() {
    $('#notifications').show();
    $('#notifications .background').fadeIn();
    $('#notifications .drop-down').animate({
        top: "0",
    }, 1000);
});

//Hide the notifications drop down menu when the user clicks on a dom element
$('html').on('click', '#notifications .js-close', function() {
    $('#notifications .drop-down').animate({
        top: "-100%",
    }, 1000, function() {
        $('#notifications .background').fadeOut(400, function() {
            $('#notifications').hide();
        });
    });     
});