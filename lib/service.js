var argv = require('optimist').argv,
	sys = require('util'),
	Backbone = require('backbone');

var UPLOAD_PATH = argv.uploads || '/home/pi/tmp/uploads';

var Title = Backbone.Model.extend({
    defaults: {
        name: '<unknown>',
        album: null,
        interpret: null,
        id: null,
        file: null
    }
});

var PlayList = Backbone.Collection.extend({
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

var TitleList = Backbone.Collection.extend({
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


var Service = {

    version: '0.0.1',
    playList: new PlayList(),
    titleList: new TitleList(),
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
            show_image(filename); // play with fim
        } else {
            play_title(filename); // play with omxplayer
        }
    },

    initLists: function (callback) {
        this.initTitleList(callback);
    },

    initTitleList: function (callback) {
        var self = this;

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

    },

    getPlayList: function (params) {
        return this.playList;
    },

    getTitleList: function (params) {
        return this.titleList;
    },

    titles: function (params) {
        return {me: "says hello"};
    },

    set: function () {
    }

};

module.exports = Service;

function dirExists (d, cb) {
    fs.stat(d, function (er, s) { cb(!er) })
}

function play_title (filename, callback) {
    try {
    if (filename) {
        sys.log("START playing " + filename + " to " + OUTPUT);
//        sys.log("exec child process: omxplayer -o " + OUTPUT + " " + filename);
//       omxplayer = childProcess.exec('ls -l', function (error, stdout, stderr) {
        omxplayer = childProcess.exec('omxplayer -o ' + OUTPUT + ' "' + filename + '"', function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
            }
//            console.log('Child Process STDOUT: '+stdout);
            console.log('Child Process STDERR: '+stderr);
        });

        omxplayer.on('exit', function (code) {
            sys.log("STOP playing " + filename + " to " + OUTPUT);
//            sys.log('Child process exited with exit code '+code);
            if (callback) {
                callback();
            }
        });
    }
    } catch(e) {
    }
}

function show_image (filename, callback) {
//    This needs fim to display images without startx
//    sudo apt-get install fim
    if (filename) {
        sys.log("SHOW image " + filename + " to " + OUTPUT);
        fim = childProcess.exec('fim -a  "' + filename + '"', function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
            }
//            console.log('Child Process STDOUT: '+stdout);
            console.log('Child Process STDERR: '+stderr);
        });

        fim.on('exit', function (code) {
            sys.log("STOP image " + filename);
//            sys.log('Child process exited with exit code '+code);
            if (callback) {
                callback();
            }
        });
    }
}

function clear_display () {
  // to be done
}

// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search

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


