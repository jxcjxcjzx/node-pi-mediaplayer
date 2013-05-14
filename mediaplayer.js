var argv = require('optimist').argv,
	_ = require('underscore'),
    sys = require('util'),
	app = require('doxybox'),
	config = require('./conf/config'),
    mediaplayerService = require('./lib/service');

// overwrite config from file by command line arguments	
config = _.extend(config, argv);

// setup application
app.config(config);
app.service(mediaplayerService);
app.static('static');
app.jade('jade');

// run application
app.start();
