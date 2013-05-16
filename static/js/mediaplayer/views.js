define([ 'underscore',
    'jquery',
    'backbone'
], function (_, $, Backbone) {
    "use strict";

    var Views = {};

    var ModelView = Backbone.View.extend({

        template: _.template($('#modelbase').html()),

        events: {
            "click p": "open"
        },

        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            this.$el.html(this.template(_.extend(this.model.attributes, {modelType: this.model.type, viewSize: this.viewSize })));
			if (_.isFunction(this.renderFinal)) {
				this.renderFinal();
			}
            return this;
        },
        open: function () {
            console.log(this.model);
        }
    });

    Views.SmallModel = ModelView.extend({
        viewSize: 1
    });

    Views.MiddleModel = ModelView.extend({
        viewSize: 2,
		events: {
			"click .model": "playFile"
		},
		playFile: function () {
			this.model.addToPlaylist();
		},
		renderFinal: function () {
			if (this.model.get("added")) {
				this.$el.find(".model").addClass("playlist");
			} else {
				this.$el.find(".model").removeClass("playlist");
			}
		}
    });

    Views.LargeModel = ModelView.extend({
        viewSize: 3
    });
/*
    var CollectionView = Backbone.View.extend({

        tagName: "div",

        className: "collection",
        template: _.template(''),
        itemViews: {},
        itemView: Views.SmallModel,

        events: {
//            "click .icon": "open"
        },

        initialize: function() {
            this.listenTo(this.collection, "change", this.render);
        },
        render: function () {
            var self = this;
            this.$el.html(this.template(this.lang || {}));
            this.collection.forEach(function(model){
                var itemView = new self.itemView({
                    model: model
                });
                self.itemViews[model.id] = itemView;
                self.$el.append(itemView.render().el);
            });
            return this;
        }
    });

    Views.SmallCollection = CollectionView.extend({
        className: "collection-1",
        itemView: Views.SmallModel,
        template: _.template($('#smallcollection').html())
    });

    Views.MiddleCollection = CollectionView.extend({
        className: "collection-2",
        itemView: Views.MiddleModel,
        template: _.template($('#middlecollection').html())
    });

    Views.LargeCollection = CollectionView.extend({
        className: "collection-3",
        itemView: Views.LargeModel,
        template: _.template($('#largecollection').html())
    });
*/
    return Views;

});