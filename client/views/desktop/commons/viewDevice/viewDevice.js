Template.ViewDevice.events({
    /* Close pop up window */
    'click .js-close': function(event, template) {
        Blaze.remove(template.view);
		$(template.firstNode).remove();
    },
    /* View component information */
    'click .js-info': function(event, template) {
		var domRoot = $('body')[0];
		Blaze.renderWithData(Template.ViewComponent, { componentId: this.id }, domRoot);
	}
});

Template.ViewDevice.helpers({  
    device: function(event, template) {
        return Devices.findOne({ id: this.deviceId });
    }
});