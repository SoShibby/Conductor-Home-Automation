Template.ViewDevice.events({
    'click .js-close': function(event, template) {
        Blaze.remove(template.view);
		$(template.firstNode).remove();
    }
});