var sys = require('util');

var Raspberry = {

	playTitle: function (filename, callback) {
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
	},

	showImage: function (filename, callback) {
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
	},

	clearDisplay: function () {
	  // to be done
	}

};

module.exports = Raspberry;
