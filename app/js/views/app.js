define([
    "backbone",
    "./home",
    "./projects",
    "css!app/stylesheets/main.css"

], function(Backbone, HomeView, ProjectsView) {

    var AppView = Backbone.View.extend({
        initialize: function(){
            console.log("Yaayy");
        }
    });


    /** router **/
    var AppRouter = Backbone.Router.extend({
        routes: {
            "home": "showHome",
            "projects": "showProjects"
        }
    });
    var appRouter = new AppRouter();


    /** views **/
    var AppView = Backbone.View.extend({
        events: {
            'click button' : 'navigateMenu'
        },

        initialize: function() {
            // this.listenTo(this.model, "change", this.render);
            this.render();
            this.initializeRoutes();
        },

        navigateMenu: function(e) {

            appRouter.navigate(e.target.dataset.nav, {trigger: true});

        },

        initializeRoutes: function() {

            appRouter.on("route:showHome", function(param1, param2){
                new HomeView({
                    el: this.$('#content')
                })
            }.bind(this));

            appRouter.on("route:showProjects", function(param1, param2){
                new ProjectsView({
                    el: this.$('#content')
                })
            }.bind(this));
        },

        render: function() {
            this.$el.html(
                '<header class="header" id="header"></header>'                      +
                '<nav class="nav"><button data-nav="#home">Home1</button><button data-nav="#projects">Projects</button> </nav>' +
                '<main class="content" id="content"></main>'                        +
                '<footer class="footer" id="footer"></footer>'
            );
        }
    });




    // Start Backbone history a necessary step for bookmarkable URL's
    new AppView({
            el: document.getElementById('appContainer')
    });

    Backbone.history.start();

    return AppView;
});
