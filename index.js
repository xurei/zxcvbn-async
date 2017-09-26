var debug = console.debug || console.log;

module.exports = {
	load(_options, callback) {
		var options = Object.assign({
			sync: false,
			libUrl: 'https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js'
		}, _options);
		
		if (options.sync) {
			return syncMode(options);
		}
		else {
			return asyncMode(options, callback);
		}
	}
};

function addScriptTag(url, loadCallback, errorCallback) {
	var head = global.document.getElementsByTagName('head')[0];
	var script = global.document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.onload = function() {
		loadCallback();
	};
	script.onerror = function() {
		errorCallback();
	};
	script.src = url;
	head.appendChild(script);
}

var library = null;
function syncMode(options) {
	addScriptTag(options.libUrl, function() {
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
		addScriptTag(options.libUrl, function() {
			callback(null, global.zxcvbn);
		}, function() {
			callback(new Error('Cannot load zxcvbn'));
		});
	}
	else {
		return new Promise(function(resolve, reject) {
			addScriptTag(options.libUrl, function() {
				resolve(global.zxcvbn);
			}, function() {
				reject(new Error('Cannot load zxcvbn'));
			});
		});
	}
}
