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
        post: [],
        redirect: [{
            route: '/',
            view: 'mediaplayer',
            callback: function (req, res) {
                return {title: ''};
            }
        }]
    }
};

