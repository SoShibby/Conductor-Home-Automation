var Messages = new Meteor.Collection(null);

$(document).ready(function() {
    MessageBox.init();
});

MessageBox = {
    init: function(){
        var domRoot = $('body')[0];
        Blaze.render(Template.MessageBox, domRoot);
        console.log('rendered');
        console.log(domRoot);
    },
    displayInfo: function(title, message){
        Messages.insert({ title: title, body: message });
    },
    displayError: function(title, message){
        Messages.insert({ title: title, body: message });
    }
}

Template.MessageBox.message = function(){
    return Messages.findOne();
}

Template.MessageBox.events({
    'click .js-close': function(event){
        Messages.remove(this._id);
    }
});
