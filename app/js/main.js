require.config({
    paths: {
        "jquery": "lib/jquery/dist/jquery",
        "underscore" : "lib/underscore-amd/underscore",
        "backbone" : "lib/backbone-amd/backbone",
        "app": "../.."
    },
    map: {
      '*': {
        'css': 'lib/require-css/css',
        'app': '../..'
      }
    }
});

require(["views/app"], function(AppView) {
    new AppView;
});
