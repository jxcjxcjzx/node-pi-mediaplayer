define([ 'underscore',
    'jquery',
    'backbone'
], function (_, $, Backbone) {
    "use strict";

    var Views = {};

    var ModelBase = Backbone.View.extend({

        template: _.template($('#modelbase').html()),
//        template: _.template('<div class="model modeltype-<%=modelType%> viewsize-<%=viewSize%>"><p><%=name%></p></div>'),

        events: {
            "click p": "open"
        },

        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        render: function () {
            this.$el.html(this.template(_.extend(this.model.attributes, {modelType: this.model.type, viewSize: this.viewSize })));
            return this;
        },
        open: function () {
            console.log(this.model);
        }
    });

    Views.SmallModel = ModelBase.extend({
        viewSize: 1
    });

    Views.MiddleModel = ModelBase.extend({
        viewSize: 2
    });

    Views.LargeModel = ModelBase.extend({
        viewSize: 3
    });

    var CollectionBase = Backbone.View.extend({

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

    Views.SmallCollection = CollectionBase.extend({
        className: "collection-1",
        itemView: Views.SmallModel,
        template: _.template('<h3>SMALL Collection</h3>')
    });

    Views.MiddleCollection = MessagesBase.extend({
        className: "collection-2",
        itemView: Views.MiddleModel,
        template: _.template('<h3>MIDDLE Collection</h3>')
    });

    Views.LargeCollection = MessagesBase.extend({
        className: "collection-3",
        itemView: Views.LargeModel,
        template: _.template('<h3>LARGE Collection</h3>')
    });

    return Views;

});