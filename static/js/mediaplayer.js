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

//                    messages = new Models.Messages();
//                    messages.fetch();
//                    console.log(messages);

                },

                start: function() {
					// more code here in our starting route ...

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
