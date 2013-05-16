define([ 'underscore',
    'jquery',
    'backbone'
], function (_, $, Backbone) {
    "use strict";

    var ModelAbstract = Backbone.Model.extend({});
    var CollectionAbstract = Backbone.Collection.extend({});

    var Models = {};

    var Label = Models.Label = ModelAbstract.extend({
		type: 'label',
        defaults: {
            id: null,
            name: null
        }
    });

    var Labels = Models.Labels = CollectionAbstract.extend({
        model: Label,
        getList: function (uid) {
            return this.toJSON();
        },
        addLabel: function (attrs) {
            this.push(new Label(attrs));
        }
    });

    var Mediafile = Models.Mediafile = ModelAbstract.extend({
		type: 'mediafile',
		urlRoot: '/service/mediafile',
        defaults: {
            uid: null,
            name: null,
            labels: new Labels(),
			mediatype: null, // audio | video | image | folder
			added: null,
			path: null
        },
		addToPlaylist: function () {
			var self = this;
			$.ajax({
			  type: "PUT",
			  url: '/service/playlist/' + this.get('uid'),
			  data: {}
			}).done(function successfulAddedToPlaylist (response) {
				var playlist = response.collection;
				var uid = self.get('uid');
				_.each(playlist, function (playlistitem) {
					if (playlistitem.uid === uid) {
						console.log("added to playlist");
						self.set("added", playlistitem.added);
					}
				});
			});
		}
    });

    var Mediafiles = Models.Mediafiles = CollectionAbstract.extend({
        model: Mediafile,
        url: '/service/mediafiles',
		parse: function(response) {
			return response.collection;
		}
    });

    return Models;

});