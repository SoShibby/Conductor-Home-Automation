Template.SettingsMenu.helpers({
    'isCurrentRouteName': function(routeName) {
        return Router.current().route.getName() === routeName ? "selected" : "";
    }
});