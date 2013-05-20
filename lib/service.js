var argv = require('optimist').argv,
	sys = require('util'),
	Backbone = require('backbone'),
	Models = require('./models'),
	Raspberry = require('./raspberry');

var Service = {

    version: '0.0.1',
    playList: new Models.PlayList(),
    titleList: new Models.TitleList(),
	options: {},

	initialize: function (callback) {
		sys.log("initialize is called");
		this.initLists();
		if (callback) callback();
	},
	
    getVersion: function () {
        return this.version;
    },

    displayOnScreen: function (filename) {
        if (filename.indexOf('.png')>0 || filename.indexOf('.jpg')>0) {
            Raspberry.showImage(filename); // play with fim
        } else {
            Raspberry.playTitle(filename); // play with omxplayer
        }
    },

    initLists: function (callback) {
        this.initTitleList(callback);
    },

    initTitleList: function (callback) {
        var self = this;

		var finder = require('findit').find(PATH_TO_TRACKS);

		finder.on('directory', function (dir, stat) {
			console.log(dir + '/');
		});

		finder.on('file', function (file, stat) {
			console.log(file);
		});

		finder.on('link', function (link, stat) {
			console.log(link);
		});
		
/*		
		require('findit').find(PATH_TO_TRACKS, function (file) {
			console.log(file);
		});	
*/		
/*		
        dirExists(PATH_TO_TRACKS, function(exists){
            if (exists) {
                walk_parallel(PATH_TO_TRACKS, function(err, results) {
                    if (err) throw err;
                    _.each(results, function(filename){
                        if (filename.indexOf('.log') < 0) {
                            var info = filename.replace(/\\/g,'/').split('/');
                            var name = info.pop();
                            var album = info.pop();
                            var interpret = info.pop();
                            name = name.replace(/\.mp3/g,'');
                            var title = new Title({
                                id: self.titleList.length,
                                name: name,
                                album: album,
                                interpret: interpret,
                                file: filename
                            });
                            self.titleList.add(title);
                        }
                    });
                    if (callback) callback();
                });
            }
        });
*/
    },

    getPlayList: function (params) {
        return this.playList;
    },

    getTitleList: function (params) {
        return this.titleList;
    },

/*
	returns playlist with add timestamps
*/	
	playlist: function (method, id, params) {
		var d = new Date();
		if (method === 'put') {
			// add file with that id to playlist
			return [{uid: id, added: d.getTime()}];
		} else {
			// just return playlist
			return [{uid: id, added: d.getTime()}];
		}
	},
	
	mediafile: function (params) {
		return {
			uid: 1,
			name: 'abc',
			labels: [{id:'kinder', name:'kinder'}],
			mediatype: 'mp3',
			added: null,
			path: '/tmp/hase.mp3'
		};
	},
	
    mediafiles: function (params) {
        return [{
			uid: 1,
			name: 'abc',
			labels: [{id:'kinder', name:'kinder'}],
			mediatype: 'mp3',
			added: null,
			path: '/tmp/hase.mp3'
		},{
			uid: 2,
			name: 'def',
			labels: [{id:'video', name:'video'}],
			mediatype: 'avi',
			added: null,
			path: '/tmp/test.avi'
		}];
    },

    set: function () {
    }

};

module.exports = Service;
/*
function dirExists (d, cb) {
    fs.stat(d, function (er, s) { cb(!er) })
}
*/

// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
/*
function walk_parallel (dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk_parallel(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

function walk_serial (dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk_serial(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
}


*/
