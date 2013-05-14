module.exports = {
	port: 5555,
    title: 'Mediaplayer',
	env: 'public', // public | local
    secret: 'expressSecretMediaPlayer',
	remoteServiceUrl: null,
    routes: {
        get: [{
            route: '/mediaplayer',
            view: 'mediaplayer',
            callback: function (req, res) {
                return {title: 'Mediaplayer'};
            }
        }],
        post: [{
			route: '/mediaplayer',
			view: 'mediaplayer',
			callback: function (req, res) {
				// save uploaded file
				var start = new Date();
				fs.readFile(req.files.uploadFile.path, function (err, data) {
					var newPath = "/tmp/" + req.files.uploadFile.name;
					fs.writeFile(newPath, data, function (err) {
						var end = new Date();
						var duration = end.getTime() - start.getTime();
						var mbSize = Math.round(100*req.files.uploadFile.size/(1024*1024))/100;
						tm.displayOnScreen(newPath);
						refreshPlaylist();
						res.render('titlelist', { title: 'Mediaplayer', uploadStatus: 'Datei mit ' + mbSize + 'MB hochgeladen in ' + duration + ' seconds' });
					});
				});
            }
		}],
        redirect: [{
            route: '/',
            view: 'mediaplayer',
            callback: function (req, res) {
                return {title: ''};
            }
        }]
    }
};
