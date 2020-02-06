var debug = console.debug || console.log;

module.exports = {
	load: function(_options, callback) {
		var options = Object.assign({
			sync: false,
			libUrl: 'https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js',
			libIntegrity: 'sha384-jhGcGHNZytnBnH1wbEM3KxJYyRDy9Q0QLKjE65xk+aMqXFCdvFuYIjzMWAAWBBtR'
		}, _options);
		
		if (options.sync) {
			return syncMode(options);
		}
		else {
			return asyncMode(options, callback);
		}
	}
};

var LOAD_SUCCESS = +1;
var LOAD_ERROR = -1;
var hasLoaded = false;
var loadResult = 0;

function addScriptTag(url, integrity, loadCallback, errorCallback) {
	if (!hasLoaded) {
		hasLoaded = true;
		var head = global.document.getElementsByTagName('head')[0];
		var script = global.document.createElement('script');
		script.type = 'text/javascript';
		if (integrity) {
			script.integrity = integrity;
			script.crossOrigin = 'anonymous';
		}
		script.async = true;
		script.onload = function() {
			loadResult = LOAD_SUCCESS;
			loadCallback();
		};
		script.onerror = function() {
			loadResult = LOAD_ERROR;
			errorCallback();
		};
		script.src = url;
		head.appendChild(script);
	}
	else {
		if (loadResult === LOAD_SUCCESS) {
			loadCallback();
		}
		else if (loadResult === LOAD_ERROR) {
			errorCallback();
		}
	}
}

var library = null;
function syncMode(options) {
	addScriptTag(options.libUrl, options.libIntegrity, function() {
		debug('zxcvbn loaded');
		library = global.zxcvbn;
	}, function() {
		console.error(new Error('Cannot load zxcvbn'));
	});
	
	return function(password, user_inputs) {
		if (library) {
			return library(password, user_inputs);
		}
		else {
			return {
				password: password,
				user_inputs: user_inputs,
				guesses: -1,
				guesses_log10: -1,
				crack_times_seconds: -1,
				crack_times_display: -1,
				score: -1,
				feedback: {
					suggestions: [],
					warning: '',
				},
				sequence: [],
				calc_time: 0
			};
		}
	};
}

function asyncMode(options, callback) {
	if (typeof(callback) === 'function') {
		addScriptTag(options.libUrl, options.libIntegrity, function() {
			callback(null, global.zxcvbn);
		}, function() {
			callback(new Error('Cannot load zxcvbn'));
		});
	}
	else {
		return new Promise(function(resolve, reject) {
			addScriptTag(options.libUrl, options.libIntegrity, function() {
				resolve(global.zxcvbn);
			}, function() {
				reject(new Error('Cannot load zxcvbn'));
			});
		});
	}
}
