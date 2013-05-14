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
        getList: function (id) {
            return this.toJSON();
        },
        addLabel: function (attrs) {
            this.push(new Label(attrs));
        }
    });

    var Mediafile = Models.Mediafile = ModelAbstract.extend({
		type: 'mediafile',
        defaults: {
            id: null,
            name: null,
            labels: new Labels(),
			mediatype: null,
			path: null
        }
    });

    var Mediafiles = Models.Mediafiles = CollectionAbstract.extend({
        model: Mediafile,
        url: 'service/mediafiles'
    });

    return Models;

});