define([
    "backbone",
    "css!app/stylesheets/main.css"

], function(Backbone) {

    var ProjectsView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html("Projects");
        }
    });

    return ProjectsView;
});
