define([
    "backbone",
    "text!./templates/About.html",
    "css!app/stylesheets/main.css"

], function(Backbone, template) {

    var AboutView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html(template);
        }
    });

    return AboutView;
});
