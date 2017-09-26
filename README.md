# zxcvbn-async

A Webpack/Browserify/... asynchronous loader for [zxcvbn](https://www.npmjs.com/package/zxcvbn)

## Motivation 

As the [zxcvbn docs](https://www.npmjs.com/package/zxcvbn#browserify--webpack) states, 
the `zxcvbn` package should not be included in your bundle. 

This modules loads the library from CDNJS (by default) when it is required by your application.   

## Installation

```bash
$ npm install zxcvbn
```

## Usage

`zxcvbn-async` provides two modes of operation : async and mimic sync

### Async mode (recommended)
This mode is the typical one when working with async code in JS. It's the recommended one for a new 
project or if you don't have to rewrite a lot of code. 
 
#### With Old-school callbacks
```javascript
var zxcvbnAsync = require('zxcvbn-async');

zxcvbnAsync.load(function(err, zxcvbn) {
    var results = zxcvbn(password, user_inputs);
});
```

#### With Promises
```javascript
var zxcvbnAsync = require('zxcvbn-async');

zxcvbnAsync.load()
.then((zxcvbn) => {
    var results = zxcvbn(password, user_inputs);
});
```

### Mimic sync
This mode mimics the synchronous loading of `zxcvbn`. If you try to use it before the library has loaded,
the result object will be filled with `-1` values. 
```javascript
var zxcvbnAsync = require('zxcvbn-async');
var zxcvbn = zxcvbnAsync.load({ global: true });
```

If the library hasn't loaded yet, the result will be :
```javascript
result = {
	guesses: -1,
	guesses_log10: -1,
	crack_times_seconds: -1,
	crack_times_display: -1,
	score: -1,
	feedback: null,
	sequence: [],
	calc_time: 0
}
```  
