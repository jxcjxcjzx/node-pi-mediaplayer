(function() {
    require.config({
        'i18n': {
            locale: 'en-EN'
        },
        shim: {
            'jquery': {
                exports: '$'
            },
            'underscore': {
                exports: '_'
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            }
        },
        paths: {
            'requireLib': 'libs/require/require',
            'text': 'libs/require/text',
            'i18n': 'libs/require/i18n',
            'socketio': 'libs/socketio/socket.io',
            'underscore': 'libs/underscore/underscore',
            'backbone': 'libs/backbone/backbone',
            'jquery': 'libs/jquery/jquery'
        }
    });

    define([
        'underscore',
        'backbone',
        'jquery',
        'mediaplayer/models',
        'mediaplayer/views',
        'socketio'
    ], function(
        _,
        Backbone,
        $,
        Models,
        Views
        ) {
        var Mediaplayer, messages;
        return Mediaplayer = (function() {

            function Mediaplayer() {}
            var AppRouter = Backbone.Router.extend({

                routes: {
                    "":                         "start",
                    "*actions":                 "start"
                },

                initialize: function() {

                    window.app = app = {};

                    var socket = app.socket = io.connect( document.location.origin );
                    socket.on('connect', function () {
                        socket.emit('hello', {id: '123'});
                        socket.on('hello', function (data) {
                            console.log("response from hello socket:");
                            console.log(data);
                        });
                    });

                },

                start: function() {
					// more code here in our starting route ...

					$(document).ready(function() {
					
						mediafile = new Models.Mediafile({ uid: 1 });
						var modelView = new Views.MiddleModel({
							model: mediafile
						});
						
						$('#app').append(modelView.render().el);

						mediafile.fetch();
						
/*					
						var mediafiles = new Models.Mediafiles();
						mediafiles.fetch({
							success: function (d) {
								console.log(mediafiles);
							}
						});
*/					
					});
                }

            });

            var app_router = new AppRouter;
            Backbone.history.start();

            Mediaplayer.prototype.say = function() {
                return console.log("say");
            };

            return Mediaplayer;

        })();
    });

}).call(this);
