Template.Home.helpers({
    selected: function() {
        //Make the person John Doe selected, just so we can see how the website will look.
        if(this.firstName === "John" && this.lastName === "Doe")
            return "selected";
    }
});