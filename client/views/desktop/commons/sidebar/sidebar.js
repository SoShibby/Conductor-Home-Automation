Template.Sidebar.helpers({
    title: function() {
        return this.title.toUpperCase();
    },
    selected: function() {
        return this.selected ? "selected" : "";
    }
});