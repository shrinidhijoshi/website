define([
    "backbone",
    "css!app/stylesheets/main.css"

], function(Backbone) {

    var HomeView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html("Home");
        }
    });

    return HomeView;
});
