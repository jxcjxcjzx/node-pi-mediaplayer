var argv = require('optimist').argv,
	sys = require('util'),
	Backbone = require('backbone');

var UPLOAD_PATH = argv.uploads || '/home/pi/tmp/uploads';

var Models = {};

var Title = Models.Title = Backbone.Model.extend({
    defaults: {
        name: '<unknown>',
        album: null,
        interpret: null,
        id: null,
        file: null
    }
});

var PlayList = Models.PlayList = Backbone.Collection.extend({
    model: Title,
    isPlaying: false,
    startPlaying: function () {
        var nextTitle = this.shift();
        var self = this;
        if (nextTitle && nextTitle.get('file')) {
            self.isPlaying = true;
            play_title(nextTitle.get('file'), function () {
                self.removeTitle(nextTitle);
                self.startPlaying();
            });
        } else {
            self.isPlaying = false;
            sys.log("PLAY LIST EMTPY");
        }
    },
    stopPlaying: function () {
        this.reset();
    },
    addTitle: function (title) {
        sys.log("ADD title " + title[0].get('file') + " to playlist");
        this.add(title);
        if (!this.isPlaying) {
            this.startPlaying();
        }
        return this.playList;
    },
    removeTitle: function (title) {
        this.remove(title);
        return this;
    },
    reset: function () {
        this.reset();
        return this;
    }
});

var TitleList = Models.TitleList = Backbone.Collection.extend({
    model: Title,
    findByName: function(name) {
        var musicTitle = null;
        this.forEach(function(title){
            if (title.get('file').indexOf(name) >= 0) {
                musicTitle = title;
            }
        });
        return musicTitle;
        //return this.where({file: name});
    },
    findById: function(id) {
        return this.where({id: id});
    }
});

module.exports = Models;
