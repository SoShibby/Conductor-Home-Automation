Template.Home.helpers({
    people: function() {
        //Adding some dummy data just to see how the website will look.
        return [{
                    firstName: "John",
                    lastName: "Doe"
                },
                {
                    firstName: "Jane",
                    lastName: "Doe"
                }];
    },
    selected: function() {
        //Make the person John Doe selected, just so we can see how the website will look.
        if(this.firstName === "John" && this.lastName === "Doe")
            return "selected";
    }
});