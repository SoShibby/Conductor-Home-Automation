Template.ViewDevice.events({
    /* Close pop up window */
    'click .js-close': function(event, template) {
        Blaze.remove(template.view);
		$(template.firstNode).remove();
    },
    /* View component information */
    'click .js-info': function(event, template){
		var domRoot = $('body')[0];
		Blaze.renderWithData(Template.ViewComponent, this, domRoot);
	}
});