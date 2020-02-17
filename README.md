# zxcvbn-async

[![npm](https://img.shields.io/npm/v/zxcvbn-async.svg)](https://www.npmjs.com/package/zxcvbn-async)
[![GitHub issues](https://img.shields.io/github/issues/xurei/zxcvbn-async.svg)](https://github.com/xurei/zxcvbn-async/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/xurei/zxcvbn-async/master/LICENSE.txt)
[![Codacy grade](https://img.shields.io/codacy/grade/2dd191109774467db47c0dc8afdf605c.svg)](https://www.codacy.com/app/xurei/zxcvbn-async)


[![Donate](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/xurei/donate)

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

`zxcvbn-async` provides two modes of operation : async and mimic sync.

### Async mode (recommended)
This mode is the typical one when working with async code in JS. It's the recommended one for a new 
project or if you don't have to rewrite a lot of code. 
 
#### With Old-school callbacks
```javascript
var zxcvbnAsync = require('zxcvbn-async');

zxcvbnAsync.load({}, function(err, zxcvbn) {
    var results = zxcvbn(password, user_inputs);
});
```

#### With Promises
```javascript
var zxcvbnAsync = require('zxcvbn-async');

zxcvbnAsync.load({})
.then((zxcvbn) => {
    var results = zxcvbn(password, user_inputs);
});
```

### Mimic sync
This mode mimics the synchronous loading of `zxcvbn`. If you try to use it before the library has loaded,
the result object will be filled with `-1` values. 
```javascript
var zxcvbnAsync = require('zxcvbn-async');
var zxcvbn = zxcvbnAsync.load({ sync: true });
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

## API

### `zxcvbnAsync.load(options, cb)`
Loads the library if not done yet.

`options` : 
- `sync` : If `true`, uses the mimic sync mode. (default: `false`)
- `libUrl` : If set, the path of the library (default: the latest version from [CDNJS](https://cdnjs.com/libraries/zxcvbn), currently `4.4.2`)
- `libIntegrity` : If set, the integrity checksum for libUrl. [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)

`cb` : `function(err, zxcvbn)`
- `err` : error object, if any
- `zxcvbn` : the `zxcvbn` function (See the [zxcvbn docs](https://www.npmjs.com/package/zxcvbn) for details) 

## Contributors

- <img alt="xurei" src="https://avatars.githubusercontent.com/xurei"  width="32" style="background: #fff"/> [xurei](https://github.com/xurei): Author, Maintainer
- <img alt="mlogan" src="https://avatars.githubusercontent.com/mlogan" width="32" style="background: #fff"/> [mlogan](https://github.com/mlogan): Contributor

## TODO 
- Write tests
