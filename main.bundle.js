/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	pry = __webpack_require__(1);
	_ = __webpack_require__(113);
	// eval(pry.it)

	var locationForecast = function locationForecast() {
	  var location = document.getElementById('search-input').value;
	  var url = 'https://sweater-weather-288.herokuapp.com/api/v1/forecast?location=' + location;
	  fetch(url).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    displayCurrentWeather(data["data"]["attributes"]["current_weather"]);
	  }).catch(function (error) {
	    return console.error(error);
	  });
	};

	var login = function login() {
	  var url = 'https://sweater-weather-288.herokuapp.com/api/v1/sessions';
	  fetch(url, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      email: 'whatever@example.com',
	      password: 'password'
	    })
	  }).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    sessionStorage.setItem("user_id", data["data"]["id"]);
	    sessionStorage.setItem("api_key", data["data"]["attributes"]["api_key"]);
	  }).catch(function (error) {
	    return console.error(error);
	  });
	  listFavorites();
	};

	var postFavorite = function postFavorite() {
	  var loc = "denver,co";
	  var key = sessionStorage.getItem("api_key");
	  var url = 'https://sweater-weather-288.herokuapp.com/api/v1/favorites';
	  fetch(url, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      location: loc,
	      api_key: key
	    })
	  }).catch(function (error) {
	    return console.error(error);
	  });
	  listFavorites();
	};

	var listFavorites = function listFavorites() {
	  var api_key = sessionStorage.getItem("api_key");
	  var url = 'https://sweater-weather-288.herokuapp.com/api/v1/favorites?api_key=' + api_key;
	  fetch(url).then(function (response) {
	    return response.json();
	  }).then(function (data) {
	    return console.log(data);
	  }).catch(function (error) {
	    return console.error(error);
	  });
	};

	var displayCurrentWeather = function displayCurrentWeather(data) {
	  _.each(data, function (key, value) {
	    $('#' + key).text(value);
	  });
	  // $("#summary").text(data["summary"]);
	};

	$('#search-input').keypress(function (e) {
	  if (e.keyCode === 13) {
	    $('#search-btn').click();
	  }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var App, Pry;

	  App = __webpack_require__(2);

	  Pry = (function() {
	    function Pry() {
	      this.it = "(" + (this._pry.toString()) + ").call(this)";
	    }

	    Pry.prototype._pry = function() {
	      var pry, _;
	      pry = __webpack_require__(1);
	      _ = null;
	      return pry.open((function(input) {
	        return _ = eval(input);
	      }).bind(this));
	    };

	    Pry.prototype.open = function(scope) {
	      var app;
	      app = new App(scope);
	      return app.open();
	    };

	    return Pry;

	  })();

	  module.exports = new Pry;

	}).call(this);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var App, Output, SyncPrompt, commands,
	    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	  SyncPrompt = __webpack_require__(3);

	  Output = __webpack_require__(114);

	  commands = __webpack_require__(115);

	  App = (function() {
	    App.prototype._commands = [];

	    function App(scope) {
	      this.scope = scope;
	      this.find_command = __bind(this.find_command, this);
	      this.typeahead = __bind(this.typeahead, this);
	      this.output = new Output();
	      this.prompt = new SyncPrompt({
	        typeahead: this.typeahead
	      });
	      this.prompt.on('data', this.find_command);
	    }

	    App.prototype.commands = function() {
	      var command, i;
	      if (this._commands.length === 0) {
	        for (i in commands) {
	          command = commands[i];
	          this._commands.push(new command({
	            output: this.output,
	            scope: this.scope
	          }));
	        }
	      }
	      return this._commands;
	    };

	    App.prototype.typeahead = function(input) {
	      var command, items, _i, _len, _ref;
	      if (input == null) {
	        input = '';
	      }
	      items = [];
	      _ref = this.commands();
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        command = _ref[_i];
	        items = items.concat(command.typeahead(input));
	      }
	      if (input) {
	        items = items.filter(function(item) {
	          return item.indexOf(input) === 0;
	        });
	      }
	      return [items, input];
	    };

	    App.prototype.find_command = function(input, chain) {
	      var args, command, match, _i, _len, _ref;
	      _ref = this.commands();
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        command = _ref[_i];
	        if (match = command.match(input.trim())) {
	          args = String(match[1]).trim().split(' ');
	          return command.execute.call(command, args, chain);
	        }
	      }
	      return false;
	    };

	    App.prototype.open = function() {
	      this.prompt.type('whereami');
	      return this.prompt.open();
	    };

	    return App;

	  })();

	  module.exports = App;

	}).call(this);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  var EventEmitter, MultilineState, SinglelineState, SyncPrompt, deasync, readline, _,
	    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  readline = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"readline\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  EventEmitter = __webpack_require__(5).EventEmitter;

	  deasync = __webpack_require__(6);

	  _ = __webpack_require__(113);

	  MultilineState = (function() {
	    function MultilineState() {}

	    MultilineState.prototype.data = '';

	    MultilineState.prototype.keypress = function(input, chars) {
	      this.data += chars;
	      if (this.data.match(/(\r|\n)\1$/)) {
	        this.data = '';
	        input.state('single');
	        return input.send_data();
	      } else if (chars.match(/(\r|\n)$/)) {
	        return input.prompt();
	      }
	    };

	    MultilineState.prototype.prompt = function(input, prompt) {
	      if (this.data === '') {
	        input.cli.setPrompt(prompt.replace(/[^>](?!$)/g, '-'));
	      } else {
	        input.cli.setPrompt(prompt.replace(/.(?!$)/g, '.'));
	      }
	      return input.cli.prompt();
	    };

	    return MultilineState;

	  })();

	  SinglelineState = (function() {
	    function SinglelineState() {}

	    SinglelineState.prototype.keypress = function(input, chars) {
	      if (chars === '\u0016') {
	        input.state('multi');
	        return input.prompt();
	      } else if (chars.match(/(\r|\n)$/)) {
	        return input.send_data();
	      }
	    };

	    SinglelineState.prototype.prompt = function(input, prompt) {
	      input.cli.setPrompt(prompt);
	      return input.cli.prompt();
	    };

	    return SinglelineState;

	  })();

	  SyncPrompt = (function(_super) {
	    __extends(SyncPrompt, _super);

	    SyncPrompt.prototype.lines = '';

	    SyncPrompt.prototype.count = 0;

	    SyncPrompt.prototype.states = {
	      multi: new MultilineState,
	      single: new SinglelineState
	    };

	    SyncPrompt.prototype._state = 'single';

	    SyncPrompt.prototype.done = false;

	    function SyncPrompt(options) {
	      this.options = options != null ? options : {};
	      this.close = __bind(this.close, this);
	      this.type = __bind(this.type, this);
	      this.prompt = __bind(this.prompt, this);
	      this.send_data = __bind(this.send_data, this);
	      this.keypress = __bind(this.keypress, this);
	      this.line = __bind(this.line, this);
	      this.state = __bind(this.state, this);
	      this.options = _.extend(_.pick(process, 'stdin', 'stdout'), this.options);
	      this.cli = readline.createInterface({
	        input: this.options.stdin,
	        output: this.options.stdout,
	        completer: this.options.typeahead
	      });
	      this.cli.on('line', this.line);
	      this.options.stdin.on('data', this.keypress);
	    }

	    SyncPrompt.prototype.state = function(state) {
	      if (state) {
	        this._state = state;
	      }
	      return this.states[this._state];
	    };

	    SyncPrompt.prototype.line = function(line) {
	      if (line.charCodeAt(0) === 22) {
	        line = line.slice(1);
	      }
	      return this.lines += '\n' + line;
	    };

	    SyncPrompt.prototype.keypress = function(chars) {
	      return this.state().keypress(this, chars.toString());
	    };

	    SyncPrompt.prototype.send_data = function() {
	      this.count++;
	      this.emit('data', this.lines.trim(), {
	        next: this.prompt,
	        stop: this.close
	      });
	      return this.lines = '';
	    };

	    SyncPrompt.prototype.prompt = function() {
	      return this.state().prompt(this, "[" + this.count + "] pryjs> ");
	    };

	    SyncPrompt.prototype.open = function() {
	      var _results;
	      this.done = false;
	      this.prompt();
	      _results = [];
	      while (!this.done) {
	        _results.push(deasync.runLoopOnce());
	      }
	      return _results;
	    };

	    SyncPrompt.prototype.type = function(input) {
	      this.lines = input;
	      return this.send_data();
	    };

	    SyncPrompt.prototype.close = function() {
	      this.done = true;
	      this.options.stdin.removeListener('data', this.keypress);
	      return this.cli.close();
	    };

	    return SyncPrompt;

	  })(EventEmitter);

	  module.exports = SyncPrompt;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, __dirname) {/*!
	 * deasync
	 * https://github.com/abbr/deasync
	 *
	 * Copyright 2014-present Abbr
	 * Released under the MIT license
	 */

	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
		path = __webpack_require__(7),
		binding

	// Seed random numbers [gh-82] if on Windows. See https://github.com/laverdet/node-fibers/issues/82
	if (process.platform === 'win32') Math.random()


	// Look for binary for this platform
	var nodeV = 'node-' + /[0-9]+\.[0-9]+/.exec(process.versions.node)[0]
	var nodeVM = 'node-' + /[0-9]+/.exec(process.versions.node)[0]
	var modPath = path.join(__dirname, 'bin', process.platform + '-' + process.arch + '-' + nodeV, 'deasync')
	try {
		try {
			fs.statSync(modPath + '.node')
		} catch (ex) {
			modPath = path.join(__dirname, 'bin', process.platform + '-' + process.arch + '-' + nodeVM, 'deasync')
			fs.statSync(modPath + '.node')
		}
		binding = __webpack_require__(8)(modPath)
	} catch (ex) {
		binding = __webpack_require__(109)('deasync')
	}

	function deasync(fn) {
		return function () {
			var done = false
			var args = Array.prototype.slice.apply(arguments).concat(cb)
			var err
			var res

			fn.apply(this, args)
			module.exports.loopWhile(function () {
				return !done
			})
			if (err)
				throw err

			return res

			function cb(e, r) {
				err = e
				res = r
				done = true
			}
		}
	}

	module.exports = deasync

	module.exports.sleep = deasync(function (timeout, done) {
		setTimeout(done, timeout)
	})

	module.exports.runLoopOnce = function () {
		process._tickCallback()
		binding.run()
	}

	module.exports.loopWhile = function (pred) {
		while (pred()) {
			process._tickCallback()
			if (pred()) binding.run()
		}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), "/"))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./index": 6,
		"./index.js": 6,
		"./quick-test": 69,
		"./quick-test.js": 69,
		"./test": 71,
		"./test.js": 71
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 8;


/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var ret, deasync = __webpack_require__(6);
	setTimeout(function () {
	  ret = 'pass';
	}, 100);

	while(ret === undefined) deasync.sleep(10);
	process.stdout.write(ret);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 70 */,
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var deasync = __webpack_require__(6)
	var cp = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	var https = __webpack_require__(72)

	var exec = deasync(cp.exec)

	var sleep = deasync(function (timeout, done) {
	  setTimeout(done, timeout)
	})

	var request = deasync(function (url, done) {
	  https.get(url, function (res) {
	    res.on('error', done)

	    res.setEncoding('utf8')

	    var result = ''

	    res.on('data', function (data) {
	      result += data
	    })
	    res.on('end', function () {
	      done(null, result)
	    })
	  }).on('error', done)
	})


	setTimeout(function () {
	  console.log('async')
	}, 1000)

	console.log(exec('ls -la'))
	sleep(2000)
	console.log(request('https://nodejs.org/en/'))

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	var http = __webpack_require__(73);

	var https = module.exports;

	for (var key in http) {
	    if (http.hasOwnProperty(key)) https[key] = http[key];
	};

	https.request = function (params, cb) {
	    if (!params) params = {};
	    params.scheme = 'https';
	    params.protocol = 'https:';
	    return http.request.call(this, params, cb);
	}


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var ClientRequest = __webpack_require__(74)
	var IncomingMessage = __webpack_require__(81)
	var extend = __webpack_require__(100)
	var statusCodes = __webpack_require__(101)
	var url = __webpack_require__(102)

	var http = exports

	http.request = function (opts, cb) {
		if (typeof opts === 'string')
			opts = url.parse(opts)
		else
			opts = extend(opts)

		// Normally, the page is loaded from http or https, so not specifying a protocol
		// will result in a (valid) protocol-relative url. However, this won't work if
		// the protocol is something else, like 'file:'
		var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

		var protocol = opts.protocol || defaultProtocol
		var host = opts.hostname || opts.host
		var port = opts.port
		var path = opts.path || '/'

		// Necessary for IPv6 addresses
		if (host && host.indexOf(':') !== -1)
			host = '[' + host + ']'

		// This may be a relative url. The browser should always be able to interpret it correctly.
		opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
		opts.method = (opts.method || 'GET').toUpperCase()
		opts.headers = opts.headers || {}

		// Also valid opts.auth, opts.mode

		var req = new ClientRequest(opts)
		if (cb)
			req.on('response', cb)
		return req
	}

	http.get = function get (opts, cb) {
		var req = http.request(opts, cb)
		req.end()
		return req
	}

	http.ClientRequest = ClientRequest
	http.IncomingMessage = IncomingMessage

	http.Agent = function () {}
	http.Agent.defaultMaxSockets = 4

	http.STATUS_CODES = statusCodes

	http.METHODS = [
		'CHECKOUT',
		'CONNECT',
		'COPY',
		'DELETE',
		'GET',
		'HEAD',
		'LOCK',
		'M-SEARCH',
		'MERGE',
		'MKACTIVITY',
		'MKCOL',
		'MOVE',
		'NOTIFY',
		'OPTIONS',
		'PATCH',
		'POST',
		'PROPFIND',
		'PROPPATCH',
		'PURGE',
		'PUT',
		'REPORT',
		'SEARCH',
		'SUBSCRIBE',
		'TRACE',
		'UNLOCK',
		'UNSUBSCRIBE'
	]
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global, process) {var capability = __webpack_require__(79)
	var inherits = __webpack_require__(80)
	var response = __webpack_require__(81)
	var stream = __webpack_require__(82)
	var toArrayBuffer = __webpack_require__(99)

	var IncomingMessage = response.IncomingMessage
	var rStates = response.readyStates

	function decideMode (preferBinary, useFetch) {
		if (capability.fetch && useFetch) {
			return 'fetch'
		} else if (capability.mozchunkedarraybuffer) {
			return 'moz-chunked-arraybuffer'
		} else if (capability.msstream) {
			return 'ms-stream'
		} else if (capability.arraybuffer && preferBinary) {
			return 'arraybuffer'
		} else if (capability.vbArray && preferBinary) {
			return 'text:vbarray'
		} else {
			return 'text'
		}
	}

	var ClientRequest = module.exports = function (opts) {
		var self = this
		stream.Writable.call(self)

		self._opts = opts
		self._body = []
		self._headers = {}
		if (opts.auth)
			self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
		Object.keys(opts.headers).forEach(function (name) {
			self.setHeader(name, opts.headers[name])
		})

		var preferBinary
		var useFetch = true
		if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
			// If the use of XHR should be preferred. Not typically needed.
			useFetch = false
			preferBinary = true
		} else if (opts.mode === 'prefer-streaming') {
			// If streaming is a high priority but binary compatibility and
			// the accuracy of the 'content-type' header aren't
			preferBinary = false
		} else if (opts.mode === 'allow-wrong-content-type') {
			// If streaming is more important than preserving the 'content-type' header
			preferBinary = !capability.overrideMimeType
		} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
			// Use binary if text streaming may corrupt data or the content-type header, or for speed
			preferBinary = true
		} else {
			throw new Error('Invalid value for opts.mode')
		}
		self._mode = decideMode(preferBinary, useFetch)

		self.on('finish', function () {
			self._onFinish()
		})
	}

	inherits(ClientRequest, stream.Writable)

	ClientRequest.prototype.setHeader = function (name, value) {
		var self = this
		var lowerName = name.toLowerCase()
		// This check is not necessary, but it prevents warnings from browsers about setting unsafe
		// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
		// http-browserify did it, so I will too.
		if (unsafeHeaders.indexOf(lowerName) !== -1)
			return

		self._headers[lowerName] = {
			name: name,
			value: value
		}
	}

	ClientRequest.prototype.getHeader = function (name) {
		var header = this._headers[name.toLowerCase()]
		if (header)
			return header.value
		return null
	}

	ClientRequest.prototype.removeHeader = function (name) {
		var self = this
		delete self._headers[name.toLowerCase()]
	}

	ClientRequest.prototype._onFinish = function () {
		var self = this

		if (self._destroyed)
			return
		var opts = self._opts

		var headersObj = self._headers
		var body = null
		if (opts.method !== 'GET' && opts.method !== 'HEAD') {
			if (capability.arraybuffer) {
				body = toArrayBuffer(Buffer.concat(self._body))
			} else if (capability.blobConstructor) {
				body = new global.Blob(self._body.map(function (buffer) {
					return toArrayBuffer(buffer)
				}), {
					type: (headersObj['content-type'] || {}).value || ''
				})
			} else {
				// get utf8 string
				body = Buffer.concat(self._body).toString()
			}
		}

		// create flattened list of headers
		var headersList = []
		Object.keys(headersObj).forEach(function (keyName) {
			var name = headersObj[keyName].name
			var value = headersObj[keyName].value
			if (Array.isArray(value)) {
				value.forEach(function (v) {
					headersList.push([name, v])
				})
			} else {
				headersList.push([name, value])
			}
		})

		if (self._mode === 'fetch') {
			var signal = null
			if (capability.abortController) {
				var controller = new AbortController()
				signal = controller.signal
				self._fetchAbortController = controller

				if ('requestTimeout' in opts && opts.requestTimeout !== 0) {
					global.setTimeout(function () {
						self.emit('requestTimeout')
						if (self._fetchAbortController)
							self._fetchAbortController.abort()
					}, opts.requestTimeout)
				}
			}

			global.fetch(self._opts.url, {
				method: self._opts.method,
				headers: headersList,
				body: body || undefined,
				mode: 'cors',
				credentials: opts.withCredentials ? 'include' : 'same-origin',
				signal: signal
			}).then(function (response) {
				self._fetchResponse = response
				self._connect()
			}, function (reason) {
				self.emit('error', reason)
			})
		} else {
			var xhr = self._xhr = new global.XMLHttpRequest()
			try {
				xhr.open(self._opts.method, self._opts.url, true)
			} catch (err) {
				process.nextTick(function () {
					self.emit('error', err)
				})
				return
			}

			// Can't set responseType on really old browsers
			if ('responseType' in xhr)
				xhr.responseType = self._mode.split(':')[0]

			if ('withCredentials' in xhr)
				xhr.withCredentials = !!opts.withCredentials

			if (self._mode === 'text' && 'overrideMimeType' in xhr)
				xhr.overrideMimeType('text/plain; charset=x-user-defined')

			if ('requestTimeout' in opts) {
				xhr.timeout = opts.requestTimeout
				xhr.ontimeout = function () {
					self.emit('requestTimeout')
				}
			}

			headersList.forEach(function (header) {
				xhr.setRequestHeader(header[0], header[1])
			})

			self._response = null
			xhr.onreadystatechange = function () {
				switch (xhr.readyState) {
					case rStates.LOADING:
					case rStates.DONE:
						self._onXHRProgress()
						break
				}
			}
			// Necessary for streaming in Firefox, since xhr.response is ONLY defined
			// in onprogress, not in onreadystatechange with xhr.readyState = 3
			if (self._mode === 'moz-chunked-arraybuffer') {
				xhr.onprogress = function () {
					self._onXHRProgress()
				}
			}

			xhr.onerror = function () {
				if (self._destroyed)
					return
				self.emit('error', new Error('XHR error'))
			}

			try {
				xhr.send(body)
			} catch (err) {
				process.nextTick(function () {
					self.emit('error', err)
				})
				return
			}
		}
	}

	/**
	 * Checks if xhr.status is readable and non-zero, indicating no error.
	 * Even though the spec says it should be available in readyState 3,
	 * accessing it throws an exception in IE8
	 */
	function statusValid (xhr) {
		try {
			var status = xhr.status
			return (status !== null && status !== 0)
		} catch (e) {
			return false
		}
	}

	ClientRequest.prototype._onXHRProgress = function () {
		var self = this

		if (!statusValid(self._xhr) || self._destroyed)
			return

		if (!self._response)
			self._connect()

		self._response._onXHRProgress()
	}

	ClientRequest.prototype._connect = function () {
		var self = this

		if (self._destroyed)
			return

		self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode)
		self._response.on('error', function(err) {
			self.emit('error', err)
		})

		self.emit('response', self._response)
	}

	ClientRequest.prototype._write = function (chunk, encoding, cb) {
		var self = this

		self._body.push(chunk)
		cb()
	}

	ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
		var self = this
		self._destroyed = true
		if (self._response)
			self._response._destroyed = true
		if (self._xhr)
			self._xhr.abort()
		else if (self._fetchAbortController)
			self._fetchAbortController.abort()
	}

	ClientRequest.prototype.end = function (data, encoding, cb) {
		var self = this
		if (typeof data === 'function') {
			cb = data
			data = undefined
		}

		stream.Writable.prototype.end.call(self, data, encoding, cb)
	}

	ClientRequest.prototype.flushHeaders = function () {}
	ClientRequest.prototype.setTimeout = function () {}
	ClientRequest.prototype.setNoDelay = function () {}
	ClientRequest.prototype.setSocketKeepAlive = function () {}

	// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
	var unsafeHeaders = [
		'accept-charset',
		'accept-encoding',
		'access-control-request-headers',
		'access-control-request-method',
		'connection',
		'content-length',
		'cookie',
		'cookie2',
		'date',
		'dnt',
		'expect',
		'host',
		'keep-alive',
		'origin',
		'referer',
		'te',
		'trailer',
		'transfer-encoding',
		'upgrade',
		'user-agent',
		'via'
	]

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(75).Buffer, (function() { return this; }()), __webpack_require__(4)))

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(76)
	var ieee754 = __webpack_require__(77)
	var isArray = __webpack_require__(78)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 76 */
/***/ (function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return (b64.length * 3 / 4) - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr((len * 3 / 4) - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0; i < l; i += 4) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ }),
/* 77 */
/***/ (function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ }),
/* 78 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 79 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

	exports.writableStream = isFunction(global.WritableStream)

	exports.abortController = isFunction(global.AbortController)

	exports.blobConstructor = false
	try {
		new Blob([new ArrayBuffer(1)])
		exports.blobConstructor = true
	} catch (e) {}

	// The xhr request to example.com may violate some restrictive CSP configurations,
	// so if we're running in a browser that supports `fetch`, avoid calling getXHR()
	// and assume support for certain features below.
	var xhr
	function getXHR () {
		// Cache the xhr value
		if (xhr !== undefined) return xhr

		if (global.XMLHttpRequest) {
			xhr = new global.XMLHttpRequest()
			// If XDomainRequest is available (ie only, where xhr might not work
			// cross domain), use the page location. Otherwise use example.com
			// Note: this doesn't actually make an http request.
			try {
				xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
			} catch(e) {
				xhr = null
			}
		} else {
			// Service workers don't have XHR
			xhr = null
		}
		return xhr
	}

	function checkTypeSupport (type) {
		var xhr = getXHR()
		if (!xhr) return false
		try {
			xhr.responseType = type
			return xhr.responseType === type
		} catch (e) {}
		return false
	}

	// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
	// Safari 7.1 appears to have fixed this bug.
	var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
	var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

	// If fetch is supported, then arraybuffer will be supported too. Skip calling
	// checkTypeSupport(), since that calls getXHR().
	exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

	// These next two tests unavoidably show warnings in Chrome. Since fetch will always
	// be used if it's available, just return false for these to avoid the warnings.
	exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
	exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
		checkTypeSupport('moz-chunked-arraybuffer')

	// If fetch is supported, then overrideMimeType will be supported too. Skip calling
	// getXHR().
	exports.overrideMimeType = exports.fetch || (getXHR() ? isFunction(getXHR().overrideMimeType) : false)

	exports.vbArray = isFunction(global.VBArray)

	function isFunction (value) {
		return typeof value === 'function'
	}

	xhr = null // Help gc

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 80 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, Buffer, global) {var capability = __webpack_require__(79)
	var inherits = __webpack_require__(80)
	var stream = __webpack_require__(82)

	var rStates = exports.readyStates = {
		UNSENT: 0,
		OPENED: 1,
		HEADERS_RECEIVED: 2,
		LOADING: 3,
		DONE: 4
	}

	var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode) {
		var self = this
		stream.Readable.call(self)

		self._mode = mode
		self.headers = {}
		self.rawHeaders = []
		self.trailers = {}
		self.rawTrailers = []

		// Fake the 'close' event, but only once 'end' fires
		self.on('end', function () {
			// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
			process.nextTick(function () {
				self.emit('close')
			})
		})

		if (mode === 'fetch') {
			self._fetchResponse = response

			self.url = response.url
			self.statusCode = response.status
			self.statusMessage = response.statusText
			
			response.headers.forEach(function (header, key){
				self.headers[key.toLowerCase()] = header
				self.rawHeaders.push(key, header)
			})

			if (capability.writableStream) {
				var writable = new WritableStream({
					write: function (chunk) {
						return new Promise(function (resolve, reject) {
							if (self._destroyed) {
								return
							} else if(self.push(new Buffer(chunk))) {
								resolve()
							} else {
								self._resumeFetch = resolve
							}
						})
					},
					close: function () {
						if (!self._destroyed)
							self.push(null)
					},
					abort: function (err) {
						if (!self._destroyed)
							self.emit('error', err)
					}
				})

				try {
					response.body.pipeTo(writable)
					return
				} catch (e) {} // pipeTo method isn't defined. Can't find a better way to feature test this
			}
			// fallback for when writableStream or pipeTo aren't available
			var reader = response.body.getReader()
			function read () {
				reader.read().then(function (result) {
					if (self._destroyed)
						return
					if (result.done) {
						self.push(null)
						return
					}
					self.push(new Buffer(result.value))
					read()
				}).catch(function(err) {
					if (!self._destroyed)
						self.emit('error', err)
				})
			}
			read()
		} else {
			self._xhr = xhr
			self._pos = 0

			self.url = xhr.responseURL
			self.statusCode = xhr.status
			self.statusMessage = xhr.statusText
			var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
			headers.forEach(function (header) {
				var matches = header.match(/^([^:]+):\s*(.*)/)
				if (matches) {
					var key = matches[1].toLowerCase()
					if (key === 'set-cookie') {
						if (self.headers[key] === undefined) {
							self.headers[key] = []
						}
						self.headers[key].push(matches[2])
					} else if (self.headers[key] !== undefined) {
						self.headers[key] += ', ' + matches[2]
					} else {
						self.headers[key] = matches[2]
					}
					self.rawHeaders.push(matches[1], matches[2])
				}
			})

			self._charset = 'x-user-defined'
			if (!capability.overrideMimeType) {
				var mimeType = self.rawHeaders['mime-type']
				if (mimeType) {
					var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
					if (charsetMatch) {
						self._charset = charsetMatch[1].toLowerCase()
					}
				}
				if (!self._charset)
					self._charset = 'utf-8' // best guess
			}
		}
	}

	inherits(IncomingMessage, stream.Readable)

	IncomingMessage.prototype._read = function () {
		var self = this

		var resolve = self._resumeFetch
		if (resolve) {
			self._resumeFetch = null
			resolve()
		}
	}

	IncomingMessage.prototype._onXHRProgress = function () {
		var self = this

		var xhr = self._xhr

		var response = null
		switch (self._mode) {
			case 'text:vbarray': // For IE9
				if (xhr.readyState !== rStates.DONE)
					break
				try {
					// This fails in IE8
					response = new global.VBArray(xhr.responseBody).toArray()
				} catch (e) {}
				if (response !== null) {
					self.push(new Buffer(response))
					break
				}
				// Falls through in IE8	
			case 'text':
				try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
					response = xhr.responseText
				} catch (e) {
					self._mode = 'text:vbarray'
					break
				}
				if (response.length > self._pos) {
					var newData = response.substr(self._pos)
					if (self._charset === 'x-user-defined') {
						var buffer = new Buffer(newData.length)
						for (var i = 0; i < newData.length; i++)
							buffer[i] = newData.charCodeAt(i) & 0xff

						self.push(buffer)
					} else {
						self.push(newData, self._charset)
					}
					self._pos = response.length
				}
				break
			case 'arraybuffer':
				if (xhr.readyState !== rStates.DONE || !xhr.response)
					break
				response = xhr.response
				self.push(new Buffer(new Uint8Array(response)))
				break
			case 'moz-chunked-arraybuffer': // take whole
				response = xhr.response
				if (xhr.readyState !== rStates.LOADING || !response)
					break
				self.push(new Buffer(new Uint8Array(response)))
				break
			case 'ms-stream':
				response = xhr.response
				if (xhr.readyState !== rStates.LOADING)
					break
				var reader = new global.MSStreamReader()
				reader.onprogress = function () {
					if (reader.result.byteLength > self._pos) {
						self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
						self._pos = reader.result.byteLength
					}
				}
				reader.onload = function () {
					self.push(null)
				}
				// reader.onerror = ??? // TODO: this
				reader.readAsArrayBuffer(response)
				break
		}

		// The ms-stream case handles end separately in reader.onload()
		if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
			self.push(null)
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(75).Buffer, (function() { return this; }())))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(83);
	exports.Stream = exports;
	exports.Readable = exports;
	exports.Writable = __webpack_require__(92);
	exports.Duplex = __webpack_require__(91);
	exports.Transform = __webpack_require__(97);
	exports.PassThrough = __webpack_require__(98);


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	/*<replacement>*/

	var processNextTick = __webpack_require__(84);
	/*</replacement>*/

	module.exports = Readable;

	/*<replacement>*/
	var isArray = __webpack_require__(78);
	/*</replacement>*/

	/*<replacement>*/
	var Duplex;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	/*<replacement>*/
	var EE = __webpack_require__(5).EventEmitter;

	var EElistenerCount = function (emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream = __webpack_require__(85);
	/*</replacement>*/

	// TODO(bmeurer): Change this back to const once hole checks are
	// properly optimized away early in Ignition+TurboFan.
	/*<replacement>*/
	var Buffer = __webpack_require__(86).Buffer;
	var OurUint8Array = global.Uint8Array || function () {};
	function _uint8ArrayToBuffer(chunk) {
	  return Buffer.from(chunk);
	}
	function _isUint8Array(obj) {
	  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
	}
	/*</replacement>*/

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	/*<replacement>*/
	var debugUtil = __webpack_require__(88);
	var debug = void 0;
	if (debugUtil && debugUtil.debuglog) {
	  debug = debugUtil.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/

	var BufferList = __webpack_require__(89);
	var destroyImpl = __webpack_require__(90);
	var StringDecoder;

	util.inherits(Readable, Stream);

	var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

	function prependListener(emitter, event, fn) {
	  // Sadly this is not cacheable as some libraries bundle their own
	  // event emitter implementation with them.
	  if (typeof emitter.prependListener === 'function') {
	    return emitter.prependListener(event, fn);
	  } else {
	    // This is a hack to make sure that our error handler is attached before any
	    // userland ones.  NEVER DO THIS. This is here only because this code needs
	    // to continue to work with older versions of Node.js that do not include
	    // the prependListener() method. The goal is to eventually remove this hack.
	    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
	  }
	}

	function ReadableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(91);

	  options = options || {};

	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = Math.floor(this.highWaterMark);

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift()
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the event 'readable'/'data' is emitted
	  // immediately, or on a later tick.  We set this to true at first, because
	  // any actions that shouldn't happen until "later" should generally also
	  // not happen before the first read call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;

	  // has it been destroyed
	  this.destroyed = false;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder) StringDecoder = __webpack_require__(96).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  Duplex = Duplex || __webpack_require__(91);

	  if (!(this instanceof Readable)) return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  if (options) {
	    if (typeof options.read === 'function') this._read = options.read;

	    if (typeof options.destroy === 'function') this._destroy = options.destroy;
	  }

	  Stream.call(this);
	}

	Object.defineProperty(Readable.prototype, 'destroyed', {
	  get: function () {
	    if (this._readableState === undefined) {
	      return false;
	    }
	    return this._readableState.destroyed;
	  },
	  set: function (value) {
	    // we ignore the value if the stream
	    // has not been initialized yet
	    if (!this._readableState) {
	      return;
	    }

	    // backward compatibility, the user is explicitly
	    // managing destroyed
	    this._readableState.destroyed = value;
	  }
	});

	Readable.prototype.destroy = destroyImpl.destroy;
	Readable.prototype._undestroy = destroyImpl.undestroy;
	Readable.prototype._destroy = function (err, cb) {
	  this.push(null);
	  cb(err);
	};

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;
	  var skipChunkCheck;

	  if (!state.objectMode) {
	    if (typeof chunk === 'string') {
	      encoding = encoding || state.defaultEncoding;
	      if (encoding !== state.encoding) {
	        chunk = Buffer.from(chunk, encoding);
	        encoding = '';
	      }
	      skipChunkCheck = true;
	    }
	  } else {
	    skipChunkCheck = true;
	  }

	  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  return readableAddChunk(this, chunk, null, true, false);
	};

	function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
	  var state = stream._readableState;
	  if (chunk === null) {
	    state.reading = false;
	    onEofChunk(stream, state);
	  } else {
	    var er;
	    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
	    if (er) {
	      stream.emit('error', er);
	    } else if (state.objectMode || chunk && chunk.length > 0) {
	      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
	        chunk = _uint8ArrayToBuffer(chunk);
	      }

	      if (addToFront) {
	        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
	      } else if (state.ended) {
	        stream.emit('error', new Error('stream.push() after EOF'));
	      } else {
	        state.reading = false;
	        if (state.decoder && !encoding) {
	          chunk = state.decoder.write(chunk);
	          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
	        } else {
	          addChunk(stream, state, chunk, false);
	        }
	      }
	    } else if (!addToFront) {
	      state.reading = false;
	    }
	  }

	  return needMoreData(state);
	}

	function addChunk(stream, state, chunk, addToFront) {
	  if (state.flowing && state.length === 0 && !state.sync) {
	    stream.emit('data', chunk);
	    stream.read(0);
	  } else {
	    // update the buffer info.
	    state.length += state.objectMode ? 1 : chunk.length;
	    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

	    if (state.needReadable) emitReadable(stream);
	  }
	  maybeReadMore(stream, state);
	}

	function chunkInvalid(state, chunk) {
	  var er;
	  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}

	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}

	Readable.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};

	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  if (!StringDecoder) StringDecoder = __webpack_require__(96).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 8MB
	var MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	  if (n <= 0 || state.length === 0 && state.ended) return 0;
	  if (state.objectMode) return 1;
	  if (n !== n) {
	    // Only flow one buffer at a time
	    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
	  }
	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n <= state.length) return n;
	  // Don't have enough
	  if (!state.ended) {
	    state.needReadable = true;
	    return 0;
	  }
	  return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  n = parseInt(n, 10);
	  var state = this._readableState;
	  var nOrig = n;

	  if (n !== 0) state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  } else if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead(nOrig, state);
	  }

	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  } else {
	    state.length -= n;
	  }

	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable(this);
	  }

	  if (ret !== null) this.emit('data', ret);

	  return ret;
	};

	function onEofChunk(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}

	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    processNextTick(maybeReadMore_, stream, state);
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('_read() is not implemented'));
	};

	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

	  var endFn = doEnd ? onend : unpipe;
	  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable, unpipeInfo) {
	    debug('onunpipe');
	    if (readable === src) {
	      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
	        unpipeInfo.hasUnpiped = true;
	        cleanup();
	      }
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  var cleanedUp = false;
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', unpipe);
	    src.removeListener('data', ondata);

	    cleanedUp = true;

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }

	  // If the user pushes more data while we're writing to dest then we'll end up
	  // in ondata again. However, we only want to increase awaitDrain once because
	  // dest will only emit one 'drain' event for the multiple writes.
	  // => Introduce a guard on increasing awaitDrain.
	  var increasedAwaitDrain = false;
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    increasedAwaitDrain = false;
	    var ret = dest.write(chunk);
	    if (false === ret && !increasedAwaitDrain) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      // => Check whether `dest` is still a piping destination.
	      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
	        debug('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	        increasedAwaitDrain = true;
	      }
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}

	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;
	  var unpipeInfo = { hasUnpiped: false };

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;

	    if (!dest) dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this, unpipeInfo);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var i = 0; i < len; i++) {
	      dests[i].emit('unpipe', this, unpipeInfo);
	    }return this;
	  }

	  // try to find the right one.
	  var index = indexOf(state.pipes, dest);
	  if (index === -1) return this;

	  state.pipes.splice(index, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];

	  dest.emit('unpipe', this, unpipeInfo);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  if (ev === 'data') {
	    // Start flowing on next tick if stream isn't explicitly paused
	    if (this._readableState.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    var state = this._readableState;
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.emittedReadable = false;
	      if (!state.reading) {
	        processNextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable(this);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	function nReadingNextTick(self) {
	  debug('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    processNextTick(resume_, stream, state);
	  }
	}

	function resume_(stream, state) {
	  if (!state.reading) {
	    debug('resume read 0');
	    stream.read(0);
	  }

	  state.resumeScheduled = false;
	  state.awaitDrain = 0;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}

	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  while (state.flowing && stream.read() !== null) {}
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function () {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function (chunk) {
	    debug('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }

	  // proxy certain important events.
	  for (var n = 0; n < kProxyEvents.length; n++) {
	    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
	  }

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};

	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	  // nothing buffered
	  if (state.length === 0) return null;

	  var ret;
	  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
	    // read it all, truncate the list
	    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list
	    ret = fromListPartial(n, state.buffer, state.decoder);
	  }

	  return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	  var ret;
	  if (n < list.head.data.length) {
	    // slice is the same for buffers and strings
	    ret = list.head.data.slice(0, n);
	    list.head.data = list.head.data.slice(n);
	  } else if (n === list.head.data.length) {
	    // first chunk is a perfect match
	    ret = list.shift();
	  } else {
	    // result spans more than one buffer
	    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
	  }
	  return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	  var p = list.head;
	  var c = 1;
	  var ret = p.data;
	  n -= ret.length;
	  while (p = p.next) {
	    var str = p.data;
	    var nb = n > str.length ? str.length : n;
	    if (nb === str.length) ret += str;else ret += str.slice(0, n);
	    n -= nb;
	    if (n === 0) {
	      if (nb === str.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = str.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	  var ret = Buffer.allocUnsafe(n);
	  var p = list.head;
	  var c = 1;
	  p.data.copy(ret);
	  n -= p.data.length;
	  while (p = p.next) {
	    var buf = p.data;
	    var nb = n > buf.length ? buf.length : n;
	    buf.copy(ret, ret.length - n, 0, nb);
	    n -= nb;
	    if (n === 0) {
	      if (nb === buf.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = buf.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    processNextTick(endReadableNT, state, stream);
	  }
	}

	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	if (!process.version ||
	    process.version.indexOf('v0.') === 0 ||
	    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
	  module.exports = nextTick;
	} else {
	  module.exports = process.nextTick;
	}

	function nextTick(fn, arg1, arg2, arg3) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('"callback" argument must be a function');
	  }
	  var len = arguments.length;
	  var args, i;
	  switch (len) {
	  case 0:
	  case 1:
	    return process.nextTick(fn);
	  case 2:
	    return process.nextTick(function afterTickOne() {
	      fn.call(null, arg1);
	    });
	  case 3:
	    return process.nextTick(function afterTickTwo() {
	      fn.call(null, arg1, arg2);
	    });
	  case 4:
	    return process.nextTick(function afterTickThree() {
	      fn.call(null, arg1, arg2, arg3);
	    });
	  default:
	    args = new Array(len - 1);
	    i = 0;
	    while (i < args.length) {
	      args[i++] = arguments[i];
	    }
	    return process.nextTick(function afterTick() {
	      fn.apply(null, args);
	    });
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5).EventEmitter;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	/* eslint-disable node/no-deprecated-api */
	var buffer = __webpack_require__(75)
	var Buffer = buffer.Buffer

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key]
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = buffer
	} else {
	  // Copy properties from require('buffer')
	  copyProps(buffer, exports)
	  exports.Buffer = SafeBuffer
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer)

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	}

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size)
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding)
	    } else {
	      buf.fill(fill)
	    }
	  } else {
	    buf.fill(0)
	  }
	  return buf
	}

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	}

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return buffer.SlowBuffer(size)
	}


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.

	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = Buffer.isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(75).Buffer))

/***/ }),
/* 88 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/*<replacement>*/

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Buffer = __webpack_require__(86).Buffer;
	/*</replacement>*/

	function copyBuffer(src, target, offset) {
	  src.copy(target, offset);
	}

	module.exports = function () {
	  function BufferList() {
	    _classCallCheck(this, BufferList);

	    this.head = null;
	    this.tail = null;
	    this.length = 0;
	  }

	  BufferList.prototype.push = function push(v) {
	    var entry = { data: v, next: null };
	    if (this.length > 0) this.tail.next = entry;else this.head = entry;
	    this.tail = entry;
	    ++this.length;
	  };

	  BufferList.prototype.unshift = function unshift(v) {
	    var entry = { data: v, next: this.head };
	    if (this.length === 0) this.tail = entry;
	    this.head = entry;
	    ++this.length;
	  };

	  BufferList.prototype.shift = function shift() {
	    if (this.length === 0) return;
	    var ret = this.head.data;
	    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
	    --this.length;
	    return ret;
	  };

	  BufferList.prototype.clear = function clear() {
	    this.head = this.tail = null;
	    this.length = 0;
	  };

	  BufferList.prototype.join = function join(s) {
	    if (this.length === 0) return '';
	    var p = this.head;
	    var ret = '' + p.data;
	    while (p = p.next) {
	      ret += s + p.data;
	    }return ret;
	  };

	  BufferList.prototype.concat = function concat(n) {
	    if (this.length === 0) return Buffer.alloc(0);
	    if (this.length === 1) return this.head.data;
	    var ret = Buffer.allocUnsafe(n >>> 0);
	    var p = this.head;
	    var i = 0;
	    while (p) {
	      copyBuffer(p.data, ret, i);
	      i += p.data.length;
	      p = p.next;
	    }
	    return ret;
	  };

	  return BufferList;
	}();

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/*<replacement>*/

	var processNextTick = __webpack_require__(84);
	/*</replacement>*/

	// undocumented cb() API, needed for core, not for public API
	function destroy(err, cb) {
	  var _this = this;

	  var readableDestroyed = this._readableState && this._readableState.destroyed;
	  var writableDestroyed = this._writableState && this._writableState.destroyed;

	  if (readableDestroyed || writableDestroyed) {
	    if (cb) {
	      cb(err);
	    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
	      processNextTick(emitErrorNT, this, err);
	    }
	    return;
	  }

	  // we set destroyed to true before firing error callbacks in order
	  // to make it re-entrance safe in case destroy() is called within callbacks

	  if (this._readableState) {
	    this._readableState.destroyed = true;
	  }

	  // if this is a duplex stream mark the writable part as destroyed as well
	  if (this._writableState) {
	    this._writableState.destroyed = true;
	  }

	  this._destroy(err || null, function (err) {
	    if (!cb && err) {
	      processNextTick(emitErrorNT, _this, err);
	      if (_this._writableState) {
	        _this._writableState.errorEmitted = true;
	      }
	    } else if (cb) {
	      cb(err);
	    }
	  });
	}

	function undestroy() {
	  if (this._readableState) {
	    this._readableState.destroyed = false;
	    this._readableState.reading = false;
	    this._readableState.ended = false;
	    this._readableState.endEmitted = false;
	  }

	  if (this._writableState) {
	    this._writableState.destroyed = false;
	    this._writableState.ended = false;
	    this._writableState.ending = false;
	    this._writableState.finished = false;
	    this._writableState.errorEmitted = false;
	  }
	}

	function emitErrorNT(self, err) {
	  self.emit('error', err);
	}

	module.exports = {
	  destroy: destroy,
	  undestroy: undestroy
	};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	'use strict';

	/*<replacement>*/

	var processNextTick = __webpack_require__(84);
	/*</replacement>*/

	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	};
	/*</replacement>*/

	module.exports = Duplex;

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	var Readable = __webpack_require__(83);
	var Writable = __webpack_require__(92);

	util.inherits(Duplex, Readable);

	var keys = objectKeys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}

	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false) this.readable = false;

	  if (options && options.writable === false) this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  processNextTick(onEndNT, this);
	}

	function onEndNT(self) {
	  self.end();
	}

	Object.defineProperty(Duplex.prototype, 'destroyed', {
	  get: function () {
	    if (this._readableState === undefined || this._writableState === undefined) {
	      return false;
	    }
	    return this._readableState.destroyed && this._writableState.destroyed;
	  },
	  set: function (value) {
	    // we ignore the value if the stream
	    // has not been initialized yet
	    if (this._readableState === undefined || this._writableState === undefined) {
	      return;
	    }

	    // backward compatibility, the user is explicitly
	    // managing destroyed
	    this._readableState.destroyed = value;
	    this._writableState.destroyed = value;
	  }
	});

	Duplex.prototype._destroy = function (err, cb) {
	  this.push(null);
	  this.end();

	  processNextTick(cb, err);
	};

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, encoding, cb), and it'll handle all
	// the drain event emission and buffering.

	'use strict';

	/*<replacement>*/

	var processNextTick = __webpack_require__(84);
	/*</replacement>*/

	module.exports = Writable;

	/* <replacement> */
	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;

	  this.next = null;
	  this.entry = null;
	  this.finish = function () {
	    onCorkedFinish(_this, state);
	  };
	}
	/* </replacement> */

	/*<replacement>*/
	var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
	/*</replacement>*/

	/*<replacement>*/
	var Duplex;
	/*</replacement>*/

	Writable.WritableState = WritableState;

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	/*<replacement>*/
	var internalUtil = {
	  deprecate: __webpack_require__(95)
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream = __webpack_require__(85);
	/*</replacement>*/

	/*<replacement>*/
	var Buffer = __webpack_require__(86).Buffer;
	var OurUint8Array = global.Uint8Array || function () {};
	function _uint8ArrayToBuffer(chunk) {
	  return Buffer.from(chunk);
	}
	function _isUint8Array(obj) {
	  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
	}
	/*</replacement>*/

	var destroyImpl = __webpack_require__(90);

	util.inherits(Writable, Stream);

	function nop() {}

	function WritableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(91);

	  options = options || {};

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = Math.floor(this.highWaterMark);

	  // if _final has been called
	  this.finalCalled = false;

	  // drain event flag.
	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // has it been destroyed
	  this.destroyed = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;

	  // count buffered requests
	  this.bufferedRequestCount = 0;

	  // allocate the first CorkedRequest, there is always
	  // one allocated and free to use, and we maintain at most two
	  this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState.prototype.getBuffer = function getBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};

	(function () {
	  try {
	    Object.defineProperty(WritableState.prototype, 'buffer', {
	      get: internalUtil.deprecate(function () {
	        return this.getBuffer();
	      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
	    });
	  } catch (_) {}
	})();

	// Test _writableState for inheritance to account for Duplex streams,
	// whose prototype chain only points to Readable.
	var realHasInstance;
	if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
	  realHasInstance = Function.prototype[Symbol.hasInstance];
	  Object.defineProperty(Writable, Symbol.hasInstance, {
	    value: function (object) {
	      if (realHasInstance.call(this, object)) return true;

	      return object && object._writableState instanceof WritableState;
	    }
	  });
	} else {
	  realHasInstance = function (object) {
	    return object instanceof this;
	  };
	}

	function Writable(options) {
	  Duplex = Duplex || __webpack_require__(91);

	  // Writable ctor is applied to Duplexes, too.
	  // `realHasInstance` is necessary because using plain `instanceof`
	  // would return false, as no `_writableState` property is attached.

	  // Trying to use the custom `instanceof` for Writable here will also break the
	  // Node.js LazyTransform implementation, which has a non-trivial getter for
	  // `_writableState` that would lead to infinite recursion.
	  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
	    return new Writable(options);
	  }

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;

	    if (typeof options.writev === 'function') this._writev = options.writev;

	    if (typeof options.destroy === 'function') this._destroy = options.destroy;

	    if (typeof options.final === 'function') this._final = options.final;
	  }

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe, not readable'));
	};

	function writeAfterEnd(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  processNextTick(cb, er);
	}

	// Checks that a user-supplied chunk is valid, especially for the particular
	// mode the stream is in. Currently this means that `null` is never accepted
	// and undefined/non-string values are only allowed in object mode.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  var er = false;

	  if (chunk === null) {
	    er = new TypeError('May not write null values to stream');
	  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  if (er) {
	    stream.emit('error', er);
	    processNextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;
	  var isBuf = _isUint8Array(chunk) && !state.objectMode;

	  if (isBuf && !Buffer.isBuffer(chunk)) {
	    chunk = _uint8ArrayToBuffer(chunk);
	  }

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

	  if (typeof cb !== 'function') cb = nop;

	  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function () {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function () {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
	  }
	};

	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	  return this;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = Buffer.from(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
	  if (!isBuf) {
	    var newChunk = decodeChunk(state, chunk, encoding);
	    if (chunk !== newChunk) {
	      isBuf = true;
	      encoding = 'buffer';
	      chunk = newChunk;
	    }
	  }
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;

	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = {
	      chunk: chunk,
	      encoding: encoding,
	      isBuf: isBuf,
	      callback: cb,
	      next: null
	    };
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	  }

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  --state.pendingcb;

	  if (sync) {
	    // defer the callback if we are being called synchronously
	    // to avoid piling up things on the stack
	    processNextTick(cb, er);
	    // this can emit finish, and it will always happen
	    // after error
	    processNextTick(finishMaybe, stream, state);
	    stream._writableState.errorEmitted = true;
	    stream.emit('error', er);
	  } else {
	    // the caller expect this to happen before if
	    // it is async
	    cb(er);
	    stream._writableState.errorEmitted = true;
	    stream.emit('error', er);
	    // this can emit finish, but finish must
	    // always follow error
	    finishMaybe(stream, state);
	  }
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(state);

	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      /*<replacement>*/
	      asyncWrite(afterWrite, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;

	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;

	    var count = 0;
	    var allBuffers = true;
	    while (entry) {
	      buffer[count] = entry;
	      if (!entry.isBuf) allBuffers = false;
	      entry = entry.next;
	      count += 1;
	    }
	    buffer.allBuffers = allBuffers;

	    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

	    // doWrite is almost always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    if (holder.next) {
	      state.corkedRequestsFree = holder.next;
	      holder.next = null;
	    } else {
	      state.corkedRequestsFree = new CorkedRequest(state);
	    }
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }

	    if (entry === null) state.lastBufferedRequest = null;
	  }

	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('_write() is not implemented'));
	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};

	function needFinish(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}
	function callFinal(stream, state) {
	  stream._final(function (err) {
	    state.pendingcb--;
	    if (err) {
	      stream.emit('error', err);
	    }
	    state.prefinished = true;
	    stream.emit('prefinish');
	    finishMaybe(stream, state);
	  });
	}
	function prefinish(stream, state) {
	  if (!state.prefinished && !state.finalCalled) {
	    if (typeof stream._final === 'function') {
	      state.pendingcb++;
	      state.finalCalled = true;
	      processNextTick(callFinal, stream, state);
	    } else {
	      state.prefinished = true;
	      stream.emit('prefinish');
	    }
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(state);
	  if (need) {
	    prefinish(stream, state);
	    if (state.pendingcb === 0) {
	      state.finished = true;
	      stream.emit('finish');
	    }
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}

	function onCorkedFinish(corkReq, state, err) {
	  var entry = corkReq.entry;
	  corkReq.entry = null;
	  while (entry) {
	    var cb = entry.callback;
	    state.pendingcb--;
	    cb(err);
	    entry = entry.next;
	  }
	  if (state.corkedRequestsFree) {
	    state.corkedRequestsFree.next = corkReq;
	  } else {
	    state.corkedRequestsFree = corkReq;
	  }
	}

	Object.defineProperty(Writable.prototype, 'destroyed', {
	  get: function () {
	    if (this._writableState === undefined) {
	      return false;
	    }
	    return this._writableState.destroyed;
	  },
	  set: function (value) {
	    // we ignore the value if the stream
	    // has not been initialized yet
	    if (!this._writableState) {
	      return;
	    }

	    // backward compatibility, the user is explicitly
	    // managing destroyed
	    this._writableState.destroyed = value;
	  }
	});

	Writable.prototype.destroy = destroyImpl.destroy;
	Writable.prototype._undestroy = destroyImpl.undestroy;
	Writable.prototype._destroy = function (err, cb) {
	  this.end();
	  cb(err);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(93).setImmediate, (function() { return this; }())))

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
	            (typeof self !== "undefined" && self) ||
	            window;
	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(scope, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(94);
	// On some exotic environments, it's not clear which object `setimmediate` was
	// able to install onto.  Search each possibility in the same order as the
	// `setimmediate` library.
	exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
	                       (typeof global !== "undefined" && global.setImmediate) ||
	                       (this && this.setImmediate);
	exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
	                         (typeof global !== "undefined" && global.clearImmediate) ||
	                         (this && this.clearImmediate);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ }),
/* 95 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module exports.
	 */

	module.exports = deprecate;

	/**
	 * Mark that a method should not be used.
	 * Returns a modified function which warns once by default.
	 *
	 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
	 *
	 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
	 * will throw an Error when invoked.
	 *
	 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
	 * will invoke `console.trace()` instead of `console.error()`.
	 *
	 * @param {Function} fn - the function to deprecate
	 * @param {String} msg - the string to print to the console when `fn` is invoked
	 * @returns {Function} a new "deprecated" version of `fn`
	 * @api public
	 */

	function deprecate (fn, msg) {
	  if (config('noDeprecation')) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (config('throwDeprecation')) {
	        throw new Error(msg);
	      } else if (config('traceDeprecation')) {
	        console.trace(msg);
	      } else {
	        console.warn(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	/**
	 * Checks `localStorage` for boolean values for the given `name`.
	 *
	 * @param {String} name
	 * @returns {Boolean}
	 * @api private
	 */

	function config (name) {
	  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
	  try {
	    if (!global.localStorage) return false;
	  } catch (_) {
	    return false;
	  }
	  var val = global.localStorage[name];
	  if (null == val) return false;
	  return String(val).toLowerCase() === 'true';
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Buffer = __webpack_require__(86).Buffer;

	var isEncoding = Buffer.isEncoding || function (encoding) {
	  encoding = '' + encoding;
	  switch (encoding && encoding.toLowerCase()) {
	    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
	      return true;
	    default:
	      return false;
	  }
	};

	function _normalizeEncoding(enc) {
	  if (!enc) return 'utf8';
	  var retried;
	  while (true) {
	    switch (enc) {
	      case 'utf8':
	      case 'utf-8':
	        return 'utf8';
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return 'utf16le';
	      case 'latin1':
	      case 'binary':
	        return 'latin1';
	      case 'base64':
	      case 'ascii':
	      case 'hex':
	        return enc;
	      default:
	        if (retried) return; // undefined
	        enc = ('' + enc).toLowerCase();
	        retried = true;
	    }
	  }
	};

	// Do not cache `Buffer.isEncoding` when checking encoding names as some
	// modules monkey-patch it to support additional encodings
	function normalizeEncoding(enc) {
	  var nenc = _normalizeEncoding(enc);
	  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
	  return nenc || enc;
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters.
	exports.StringDecoder = StringDecoder;
	function StringDecoder(encoding) {
	  this.encoding = normalizeEncoding(encoding);
	  var nb;
	  switch (this.encoding) {
	    case 'utf16le':
	      this.text = utf16Text;
	      this.end = utf16End;
	      nb = 4;
	      break;
	    case 'utf8':
	      this.fillLast = utf8FillLast;
	      nb = 4;
	      break;
	    case 'base64':
	      this.text = base64Text;
	      this.end = base64End;
	      nb = 3;
	      break;
	    default:
	      this.write = simpleWrite;
	      this.end = simpleEnd;
	      return;
	  }
	  this.lastNeed = 0;
	  this.lastTotal = 0;
	  this.lastChar = Buffer.allocUnsafe(nb);
	}

	StringDecoder.prototype.write = function (buf) {
	  if (buf.length === 0) return '';
	  var r;
	  var i;
	  if (this.lastNeed) {
	    r = this.fillLast(buf);
	    if (r === undefined) return '';
	    i = this.lastNeed;
	    this.lastNeed = 0;
	  } else {
	    i = 0;
	  }
	  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
	  return r || '';
	};

	StringDecoder.prototype.end = utf8End;

	// Returns only complete characters in a Buffer
	StringDecoder.prototype.text = utf8Text;

	// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
	StringDecoder.prototype.fillLast = function (buf) {
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
	  this.lastNeed -= buf.length;
	};

	// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
	// continuation byte.
	function utf8CheckByte(byte) {
	  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
	  return -1;
	}

	// Checks at most 3 bytes at the end of a Buffer in order to detect an
	// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
	// needed to complete the UTF-8 character (if applicable) are returned.
	function utf8CheckIncomplete(self, buf, i) {
	  var j = buf.length - 1;
	  if (j < i) return 0;
	  var nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 1;
	    return nb;
	  }
	  if (--j < i) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) self.lastNeed = nb - 2;
	    return nb;
	  }
	  if (--j < i) return 0;
	  nb = utf8CheckByte(buf[j]);
	  if (nb >= 0) {
	    if (nb > 0) {
	      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
	    }
	    return nb;
	  }
	  return 0;
	}

	// Validates as many continuation bytes for a multi-byte UTF-8 character as
	// needed or are available. If we see a non-continuation byte where we expect
	// one, we "replace" the validated continuation bytes we've seen so far with
	// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
	// behavior. The continuation byte check is included three times in the case
	// where all of the continuation bytes for a character exist in the same buffer.
	// It is also done this way as a slight performance increase instead of using a
	// loop.
	function utf8CheckExtraBytes(self, buf, p) {
	  if ((buf[0] & 0xC0) !== 0x80) {
	    self.lastNeed = 0;
	    return '\ufffd'.repeat(p);
	  }
	  if (self.lastNeed > 1 && buf.length > 1) {
	    if ((buf[1] & 0xC0) !== 0x80) {
	      self.lastNeed = 1;
	      return '\ufffd'.repeat(p + 1);
	    }
	    if (self.lastNeed > 2 && buf.length > 2) {
	      if ((buf[2] & 0xC0) !== 0x80) {
	        self.lastNeed = 2;
	        return '\ufffd'.repeat(p + 2);
	      }
	    }
	  }
	}

	// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
	function utf8FillLast(buf) {
	  var p = this.lastTotal - this.lastNeed;
	  var r = utf8CheckExtraBytes(this, buf, p);
	  if (r !== undefined) return r;
	  if (this.lastNeed <= buf.length) {
	    buf.copy(this.lastChar, p, 0, this.lastNeed);
	    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
	  }
	  buf.copy(this.lastChar, p, 0, buf.length);
	  this.lastNeed -= buf.length;
	}

	// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
	// partial character, the character's bytes are buffered until the required
	// number of bytes are available.
	function utf8Text(buf, i) {
	  var total = utf8CheckIncomplete(this, buf, i);
	  if (!this.lastNeed) return buf.toString('utf8', i);
	  this.lastTotal = total;
	  var end = buf.length - (total - this.lastNeed);
	  buf.copy(this.lastChar, 0, end);
	  return buf.toString('utf8', i, end);
	}

	// For UTF-8, a replacement character for each buffered byte of a (partial)
	// character needs to be added to the output.
	function utf8End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
	  return r;
	}

	// UTF-16LE typically needs two bytes per character, but even if we have an even
	// number of bytes available, we need to check if we end on a leading/high
	// surrogate. In that case, we need to wait for the next two bytes in order to
	// decode the last character properly.
	function utf16Text(buf, i) {
	  if ((buf.length - i) % 2 === 0) {
	    var r = buf.toString('utf16le', i);
	    if (r) {
	      var c = r.charCodeAt(r.length - 1);
	      if (c >= 0xD800 && c <= 0xDBFF) {
	        this.lastNeed = 2;
	        this.lastTotal = 4;
	        this.lastChar[0] = buf[buf.length - 2];
	        this.lastChar[1] = buf[buf.length - 1];
	        return r.slice(0, -1);
	      }
	    }
	    return r;
	  }
	  this.lastNeed = 1;
	  this.lastTotal = 2;
	  this.lastChar[0] = buf[buf.length - 1];
	  return buf.toString('utf16le', i, buf.length - 1);
	}

	// For UTF-16LE we do not explicitly append special replacement characters if we
	// end on a partial character, we simply let v8 handle that.
	function utf16End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) {
	    var end = this.lastTotal - this.lastNeed;
	    return r + this.lastChar.toString('utf16le', 0, end);
	  }
	  return r;
	}

	function base64Text(buf, i) {
	  var n = (buf.length - i) % 3;
	  if (n === 0) return buf.toString('base64', i);
	  this.lastNeed = 3 - n;
	  this.lastTotal = 3;
	  if (n === 1) {
	    this.lastChar[0] = buf[buf.length - 1];
	  } else {
	    this.lastChar[0] = buf[buf.length - 2];
	    this.lastChar[1] = buf[buf.length - 1];
	  }
	  return buf.toString('base64', i, buf.length - n);
	}

	function base64End(buf) {
	  var r = buf && buf.length ? this.write(buf) : '';
	  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
	  return r;
	}

	// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
	function simpleWrite(buf) {
	  return buf.toString(this.encoding);
	}

	function simpleEnd(buf) {
	  return buf && buf.length ? this.write(buf) : '';
	}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	'use strict';

	module.exports = Transform;

	var Duplex = __webpack_require__(91);

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	util.inherits(Transform, Duplex);

	function TransformState(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb) {
	    return stream.emit('error', new Error('write callback called multiple times'));
	  }

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined) stream.push(data);

	  cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}

	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(this);

	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;

	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  // When the writable side finishes, then flush out anything remaining.
	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er, data) {
	      done(stream, er, data);
	    });else done(stream);
	  });
	}

	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('_transform() is not implemented');
	};

	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};

	Transform.prototype._destroy = function (err, cb) {
	  var _this = this;

	  Duplex.prototype._destroy.call(this, err, function (err2) {
	    cb(err2);
	    _this.emit('close');
	  });
	};

	function done(stream, er, data) {
	  if (er) return stream.emit('error', er);

	  if (data !== null && data !== undefined) stream.push(data);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

	  if (ts.transforming) throw new Error('Calling transform done when still transforming');

	  return stream.push(null);
	}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	'use strict';

	module.exports = PassThrough;

	var Transform = __webpack_require__(97);

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	var Buffer = __webpack_require__(75).Buffer

	module.exports = function (buf) {
		// If the buffer is backed by a Uint8Array, a faster version will work
		if (buf instanceof Uint8Array) {
			// If the buffer isn't a subarray, return the underlying ArrayBuffer
			if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
				return buf.buffer
			} else if (typeof buf.buffer.slice === 'function') {
				// Otherwise we need to get a proper copy
				return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
			}
		}

		if (Buffer.isBuffer(buf)) {
			// This is the slow version that will work with any Buffer
			// implementation (even in old browsers)
			var arrayCopy = new Uint8Array(buf.length)
			var len = buf.length
			for (var i = 0; i < len; i++) {
				arrayCopy[i] = buf[i]
			}
			return arrayCopy.buffer
		} else {
			throw new Error('Argument must be a Buffer')
		}
	}


/***/ }),
/* 100 */
/***/ (function(module, exports) {

	module.exports = extend

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function extend() {
	    var target = {}

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]

	        for (var key in source) {
	            if (hasOwnProperty.call(source, key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ }),
/* 101 */
/***/ (function(module, exports) {

	module.exports = {
	  "100": "Continue",
	  "101": "Switching Protocols",
	  "102": "Processing",
	  "200": "OK",
	  "201": "Created",
	  "202": "Accepted",
	  "203": "Non-Authoritative Information",
	  "204": "No Content",
	  "205": "Reset Content",
	  "206": "Partial Content",
	  "207": "Multi-Status",
	  "208": "Already Reported",
	  "226": "IM Used",
	  "300": "Multiple Choices",
	  "301": "Moved Permanently",
	  "302": "Found",
	  "303": "See Other",
	  "304": "Not Modified",
	  "305": "Use Proxy",
	  "307": "Temporary Redirect",
	  "308": "Permanent Redirect",
	  "400": "Bad Request",
	  "401": "Unauthorized",
	  "402": "Payment Required",
	  "403": "Forbidden",
	  "404": "Not Found",
	  "405": "Method Not Allowed",
	  "406": "Not Acceptable",
	  "407": "Proxy Authentication Required",
	  "408": "Request Timeout",
	  "409": "Conflict",
	  "410": "Gone",
	  "411": "Length Required",
	  "412": "Precondition Failed",
	  "413": "Payload Too Large",
	  "414": "URI Too Long",
	  "415": "Unsupported Media Type",
	  "416": "Range Not Satisfiable",
	  "417": "Expectation Failed",
	  "418": "I'm a teapot",
	  "421": "Misdirected Request",
	  "422": "Unprocessable Entity",
	  "423": "Locked",
	  "424": "Failed Dependency",
	  "425": "Unordered Collection",
	  "426": "Upgrade Required",
	  "428": "Precondition Required",
	  "429": "Too Many Requests",
	  "431": "Request Header Fields Too Large",
	  "451": "Unavailable For Legal Reasons",
	  "500": "Internal Server Error",
	  "501": "Not Implemented",
	  "502": "Bad Gateway",
	  "503": "Service Unavailable",
	  "504": "Gateway Timeout",
	  "505": "HTTP Version Not Supported",
	  "506": "Variant Also Negotiates",
	  "507": "Insufficient Storage",
	  "508": "Loop Detected",
	  "509": "Bandwidth Limit Exceeded",
	  "510": "Not Extended",
	  "511": "Network Authentication Required"
	}


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var punycode = __webpack_require__(103);
	var util = __webpack_require__(105);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(106);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  // Copy chrome, IE, opera backslash-handling behavior.
	  // Back slashes before the query string get converted to forward slashes
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var queryIndex = url.indexOf('?'),
	      splitter =
	          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
	      uSplit = url.split(splitter),
	      slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a punycoded representation of "domain".
	      // It only converts parts of the domain name that
	      // have non-ASCII characters, i.e. it doesn't matter if
	      // you call it with a domain that already is ASCII-only.
	      this.hostname = punycode.toASCII(this.hostname);
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1)
	        continue;
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      util.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol')
	        result[rkey] = relative[rkey];
	    }

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especially happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host || srcPath.length > 1) &&
	      (last === '.' || last === '..') || last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especially happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(104)(module), (function() { return this; }())))

/***/ }),
/* 104 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 105 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {
	  isString: function(arg) {
	    return typeof(arg) === 'string';
	  },
	  isObject: function(arg) {
	    return typeof(arg) === 'object' && arg !== null;
	  },
	  isNull: function(arg) {
	    return arg === null;
	  },
	  isNullOrUndefined: function(arg) {
	    return arg == null;
	  }
	};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(107);
	exports.encode = exports.stringify = __webpack_require__(108);


/***/ }),
/* 107 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ }),
/* 108 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, __filename) {
	/**
	 * Module dependencies.
	 */

	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	  , path = __webpack_require__(7)
	  , join = path.join
	  , dirname = path.dirname
	  , exists = fs.existsSync || path.existsSync
	  , defaults = {
	        arrow: process.env.NODE_BINDINGS_ARROW || ' → '
	      , compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled'
	      , platform: process.platform
	      , arch: process.arch
	      , version: process.versions.node
	      , bindings: 'bindings.node'
	      , try: [
	          // node-gyp's linked version in the "build" dir
	          [ 'module_root', 'build', 'bindings' ]
	          // node-waf and gyp_addon (a.k.a node-gyp)
	        , [ 'module_root', 'build', 'Debug', 'bindings' ]
	        , [ 'module_root', 'build', 'Release', 'bindings' ]
	          // Debug files, for development (legacy behavior, remove for node v0.9)
	        , [ 'module_root', 'out', 'Debug', 'bindings' ]
	        , [ 'module_root', 'Debug', 'bindings' ]
	          // Release files, but manually compiled (legacy behavior, remove for node v0.9)
	        , [ 'module_root', 'out', 'Release', 'bindings' ]
	        , [ 'module_root', 'Release', 'bindings' ]
	          // Legacy from node-waf, node <= 0.4.x
	        , [ 'module_root', 'build', 'default', 'bindings' ]
	          // Production "Release" buildtype binary (meh...)
	        , [ 'module_root', 'compiled', 'version', 'platform', 'arch', 'bindings' ]
	        ]
	    }

	/**
	 * The main `bindings()` function loads the compiled bindings for a given module.
	 * It uses V8's Error API to determine the parent filename that this function is
	 * being invoked from, which is then used to find the root directory.
	 */

	function bindings (opts) {

	  // Argument surgery
	  if (typeof opts == 'string') {
	    opts = { bindings: opts }
	  } else if (!opts) {
	    opts = {}
	  }
	  opts.__proto__ = defaults

	  // Get the module root
	  if (!opts.module_root) {
	    opts.module_root = exports.getRoot(exports.getFileName())
	  }

	  // Ensure the given bindings name ends with .node
	  if (path.extname(opts.bindings) != '.node') {
	    opts.bindings += '.node'
	  }

	  var tries = []
	    , i = 0
	    , l = opts.try.length
	    , n
	    , b
	    , err

	  for (; i<l; i++) {
	    n = join.apply(null, opts.try[i].map(function (p) {
	      return opts[p] || p
	    }))
	    tries.push(n)
	    try {
	      b = opts.path ? /*require.resolve*/(__webpack_require__(110).resolve(n)) : __webpack_require__(110)(n)
	      if (!opts.path) {
	        b.path = n
	      }
	      return b
	    } catch (e) {
	      if (!/not find/i.test(e.message)) {
	        throw e
	      }
	    }
	  }

	  err = new Error('Could not locate the bindings file. Tried:\n'
	    + tries.map(function (a) { return opts.arrow + a }).join('\n'))
	  err.tries = tries
	  throw err
	}
	module.exports = exports = bindings


	/**
	 * Gets the filename of the JavaScript file that invokes this function.
	 * Used to help find the root directory of a module.
	 * Optionally accepts an filename argument to skip when searching for the invoking filename
	 */

	exports.getFileName = function getFileName (calling_file) {
	  var origPST = Error.prepareStackTrace
	    , origSTL = Error.stackTraceLimit
	    , dummy = {}
	    , fileName

	  Error.stackTraceLimit = 10

	  Error.prepareStackTrace = function (e, st) {
	    for (var i=0, l=st.length; i<l; i++) {
	      fileName = st[i].getFileName()
	      if (fileName !== __filename) {
	        if (calling_file) {
	            if (fileName !== calling_file) {
	              return
	            }
	        } else {
	          return
	        }
	      }
	    }
	  }

	  // run the 'prepareStackTrace' function above
	  Error.captureStackTrace(dummy)
	  dummy.stack

	  // cleanup
	  Error.prepareStackTrace = origPST
	  Error.stackTraceLimit = origSTL

	  return fileName
	}

	/**
	 * Gets the root directory of a module, given an arbitrary filename
	 * somewhere in the module tree. The "root directory" is the directory
	 * containing the `package.json` file.
	 *
	 *   In:  /home/nate/node-native-module/lib/index.js
	 *   Out: /home/nate/node-native-module
	 */

	exports.getRoot = function getRoot (file) {
	  var dir = dirname(file)
	    , prev
	  while (true) {
	    if (dir === '.') {
	      // Avoids an infinite loop in rare cases, like the REPL
	      dir = process.cwd()
	    }
	    if (exists(join(dir, 'package.json')) || exists(join(dir, 'node_modules'))) {
	      // Found the 'package.json' file or 'node_modules' dir; we're done
	      return dir
	    }
	    if (prev === dir) {
	      // Got to the top
	      throw new Error('Could not find module root given file: "' + file
	                    + '". Do you have a `package.json` file? ')
	    }
	    // Try the parent dir next
	    prev = dir
	    dir = join(dir, '..')
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), "/index.js"))

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./bindings": 109,
		"./bindings.js": 109
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 110;


/***/ }),
/* 111 */,
/* 112 */,
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, module) {//     Underscore.js 1.9.1
	//     http://underscorejs.org
	//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` (`self`) in the browser, `global`
	  // on the server, or `this` in some virtual machines. We use `self`
	  // instead of `window` for `WebWorker` support.
	  var root = typeof self == 'object' && self.self === self && self ||
	            typeof global == 'object' && global.global === global && global ||
	            this ||
	            {};

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
	  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

	  // Create quick reference variables for speed access to core prototypes.
	  var push = ArrayProto.push,
	      slice = ArrayProto.slice,
	      toString = ObjProto.toString,
	      hasOwnProperty = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var nativeIsArray = Array.isArray,
	      nativeKeys = Object.keys,
	      nativeCreate = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for their old module API. If we're in
	  // the browser, add `_` as a global object.
	  // (`nodeType` is checked to ensure that `module`
	  // and `exports` are not HTML elements.)
	  if (typeof exports != 'undefined' && !exports.nodeType) {
	    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.9.1';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      // The 2-argument case is omitted because we’re not using it.
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  var builtinIteratee;

	  // An internal function to generate callbacks that can be applied to each
	  // element in a collection, returning the desired result — either `identity`,
	  // an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
	    return _.property(value);
	  };

	  // External wrapper for our callback generator. Users may customize
	  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
	  // This abstraction hides the internal-only argCount argument.
	  _.iteratee = builtinIteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // Some functions take a variable number of arguments, or a few expected
	  // arguments at the beginning and then a variable number of values to operate
	  // on. This helper accumulates all remaining arguments past the function’s
	  // argument length (or an explicit `startIndex`), into an array that becomes
	  // the last argument. Similar to ES6’s "rest parameter".
	  var restArguments = function(func, startIndex) {
	    startIndex = startIndex == null ? func.length - 1 : +startIndex;
	    return function() {
	      var length = Math.max(arguments.length - startIndex, 0),
	          rest = Array(length),
	          index = 0;
	      for (; index < length; index++) {
	        rest[index] = arguments[index + startIndex];
	      }
	      switch (startIndex) {
	        case 0: return func.call(this, rest);
	        case 1: return func.call(this, arguments[0], rest);
	        case 2: return func.call(this, arguments[0], arguments[1], rest);
	      }
	      var args = Array(startIndex + 1);
	      for (index = 0; index < startIndex; index++) {
	        args[index] = arguments[index];
	      }
	      args[startIndex] = rest;
	      return func.apply(this, args);
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var shallowProperty = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  var has = function(obj, path) {
	    return obj != null && hasOwnProperty.call(obj, path);
	  }

	  var deepGet = function(obj, path) {
	    var length = path.length;
	    for (var i = 0; i < length; i++) {
	      if (obj == null) return void 0;
	      obj = obj[path[i]];
	    }
	    return length ? obj : void 0;
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object.
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = shallowProperty('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  var createReduce = function(dir) {
	    // Wrap code that reassigns argument variables in a separate function than
	    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
	    var reducer = function(obj, iteratee, memo, initial) {
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      if (!initial) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    };

	    return function(obj, iteratee, memo, context) {
	      var initial = arguments.length >= 3;
	      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
	    };
	  };

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
	    var key = keyFinder(obj, predicate, context);
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = restArguments(function(obj, path, args) {
	    var contextPath, func;
	    if (_.isFunction(path)) {
	      func = path;
	    } else if (_.isArray(path)) {
	      contextPath = path.slice(0, -1);
	      path = path[path.length - 1];
	    }
	    return _.map(obj, function(context) {
	      var method = func;
	      if (!method) {
	        if (contextPath && contextPath.length) {
	          context = deepGet(context, contextPath);
	        }
	        if (context == null) return void 0;
	        method = context[path];
	      }
	      return method == null ? method : method.apply(context, args);
	    });
	  });

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value != null && value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(v, index, list) {
	        computed = iteratee(v, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = v;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value != null && value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(v, index, list) {
	        computed = iteratee(v, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = v;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection.
	  _.shuffle = function(obj) {
	    return _.sample(obj, Infinity);
	  };

	  // Sample **n** random values from a collection using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
	    var length = getLength(sample);
	    n = Math.max(Math.min(n, length), 0);
	    var last = length - 1;
	    for (var index = 0; index < n; index++) {
	      var rand = _.random(index, last);
	      var temp = sample[index];
	      sample[index] = sample[rand];
	      sample[rand] = temp;
	    }
	    return sample.slice(0, n);
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    var index = 0;
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, key, list) {
	      return {
	        value: value,
	        index: index++,
	        criteria: iteratee(value, key, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior, partition) {
	    return function(obj, iteratee, context) {
	      var result = partition ? [[], []] : {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (has(result, key)) result[key]++; else result[key] = 1;
	  });

	  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (_.isString(obj)) {
	      // Keep surrogate pair characters together
	      return obj.match(reStrSymbol);
	    }
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = group(function(result, value, pass) {
	    result[pass ? 0 : 1].push(value);
	  }, true);

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null || array.length < 1) return n == null ? void 0 : [];
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null || array.length < 1) return n == null ? void 0 : [];
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, Boolean);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, output) {
	    output = output || [];
	    var idx = output.length;
	    for (var i = 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        // Flatten current level of array or arguments object.
	        if (shallow) {
	          var j = 0, len = value.length;
	          while (j < len) output[idx++] = value[j++];
	        } else {
	          flatten(value, shallow, strict, output);
	          idx = output.length;
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = restArguments(function(array, otherArrays) {
	    return _.difference(array, otherArrays);
	  });

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // The faster algorithm will not work with an iteratee if the iteratee
	  // is not a one-to-one function, so providing an iteratee will disable
	  // the faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted && !iteratee) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = restArguments(function(arrays) {
	    return _.uniq(flatten(arrays, true, true));
	  });

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      var j;
	      for (j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = restArguments(function(array, rest) {
	    rest = flatten(rest, true, true);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  });

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices.
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = restArguments(_.unzip);

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values. Passing by pairs is the reverse of _.pairs.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions.
	  var createPredicateIndexFinder = function(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  };

	  // Returns the first index on an array-like that passes a predicate test.
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions.
	  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	          i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  };

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    if (!step) {
	      step = stop < start ? -1 : 1;
	    }

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Chunk a single array into multiple arrays, each containing `count` or fewer
	  // items.
	  _.chunk = function(array, count) {
	    if (count == null || count < 1) return [];
	    var result = [];
	    var i = 0, length = array.length;
	    while (i < length) {
	      result.push(slice.call(array, i, i += count));
	    }
	    return result;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments.
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = restArguments(function(func, context, args) {
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var bound = restArguments(function(callArgs) {
	      return executeBound(func, bound, context, this, args.concat(callArgs));
	    });
	    return bound;
	  });

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder by default, allowing any combination of arguments to be
	  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
	  _.partial = restArguments(function(func, boundArgs) {
	    var placeholder = _.partial.placeholder;
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  });

	  _.partial.placeholder = _;

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = restArguments(function(obj, keys) {
	    keys = flatten(keys, false, false);
	    var index = keys.length;
	    if (index < 1) throw new Error('bindAll must be passed function names');
	    while (index--) {
	      var key = keys[index];
	      obj[key] = _.bind(obj[key], obj);
	    }
	  });

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = restArguments(function(func, wait, args) {
	    return setTimeout(function() {
	      return func.apply(null, args);
	    }, wait);
	  });

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var timeout, context, args, result;
	    var previous = 0;
	    if (!options) options = {};

	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };

	    var throttled = function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };

	    throttled.cancel = function() {
	      clearTimeout(timeout);
	      previous = 0;
	      timeout = context = args = null;
	    };

	    return throttled;
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, result;

	    var later = function(context, args) {
	      timeout = null;
	      if (args) result = func.apply(context, args);
	    };

	    var debounced = restArguments(function(args) {
	      if (timeout) clearTimeout(timeout);
	      if (immediate) {
	        var callNow = !timeout;
	        timeout = setTimeout(later, wait);
	        if (callNow) result = func.apply(this, args);
	      } else {
	        timeout = _.delay(later, wait, this, args);
	      }

	      return result;
	    });

	    debounced.cancel = function() {
	      clearTimeout(timeout);
	      timeout = null;
	    };

	    return debounced;
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  _.restArguments = restArguments;

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  var collectNonEnumProps = function(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  };

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`.
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object.
	  // In contrast to _.map it returns an object.
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = _.keys(obj),
	        length = keys.length,
	        results = {};
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys[index];
	      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  // The opposite of _.object.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`.
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, defaults) {
	    return function(obj) {
	      var length = arguments.length;
	      if (defaults) obj = Object(obj);
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!defaults || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s).
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test.
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Internal pick helper function to determine if `obj` has key `key`.
	  var keyInObj = function(value, key, obj) {
	    return key in obj;
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = restArguments(function(obj, keys) {
	    var result = {}, iteratee = keys[0];
	    if (obj == null) return result;
	    if (_.isFunction(iteratee)) {
	      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
	      keys = _.allKeys(obj);
	    } else {
	      iteratee = keyInObj;
	      keys = flatten(keys, false, false);
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  });

	  // Return a copy of the object without the blacklisted properties.
	  _.omit = restArguments(function(obj, keys) {
	    var iteratee = keys[0], context;
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	      if (keys.length > 1) context = keys[1];
	    } else {
	      keys = _.map(flatten(keys, false, false), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  });

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq, deepEq;
	  eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // `null` or `undefined` only equal to itself (strict comparison).
	    if (a == null || b == null) return false;
	    // `NaN`s are equivalent, but non-reflexive.
	    if (a !== a) return b !== b;
	    // Exhaust primitive checks
	    var type = typeof a;
	    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	    return deepEq(a, b, aStack, bStack);
	  };

	  // Internal recursive comparison function for `isEqual`.
	  deepEq = function(a, b, aStack, bStack) {
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN.
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	      case '[object Symbol]':
	        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
	  var nodelist = root.document && root.document.childNodes;
	  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`?
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && isNaN(obj);
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, path) {
	    if (!_.isArray(path)) {
	      return has(obj, path);
	    }
	    var length = path.length;
	    for (var i = 0; i < length; i++) {
	      var key = path[i];
	      if (obj == null || !hasOwnProperty.call(obj, key)) {
	        return false;
	      }
	      obj = obj[key];
	    }
	    return !!length;
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  // Creates a function that, when passed an object, will traverse that object’s
	  // properties down the given `path`, specified as an array of keys or indexes.
	  _.property = function(path) {
	    if (!_.isArray(path)) {
	      return shallowProperty(path);
	    }
	    return function(obj) {
	      return deepGet(obj, path);
	    };
	  };

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    if (obj == null) {
	      return function(){};
	    }
	    return function(path) {
	      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	  // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped.
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // Traverses the children of `obj` along `path`. If a child is a function, it
	  // is invoked with its parent as context. Returns the value of the final
	  // child, or `fallback` if any child is undefined.
	  _.result = function(obj, path, fallback) {
	    if (!_.isArray(path)) path = [path];
	    var length = path.length;
	    if (!length) {
	      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
	    }
	    for (var i = 0; i < length; i++) {
	      var prop = obj == null ? void 0 : obj[path[i]];
	      if (prop === void 0) {
	        prop = fallback;
	        i = length; // Ensure we don't continue iterating.
	      }
	      obj = _.isFunction(prop) ? prop.call(obj) : prop;
	    }
	    return obj;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate: /<%([\s\S]+?)%>/g,
	    interpolate: /<%=([\s\S]+?)%>/g,
	    escape: /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'": "'",
	    '\\': '\\',
	    '\r': 'r',
	    '\n': 'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offset.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    var render;
	    try {
	      render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var chainResult = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return chainResult(this, func.apply(_, args));
	      };
	    });
	    return _;
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return chainResult(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return chainResult(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return String(this._wrapped);
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}());

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(104)(module)))

/***/ }),
/* 114 */
/***/ (function(module, exports) {

	(function() {
	  var LocalOutput,
	    __slice = [].slice;

	  LocalOutput = (function() {
	    function LocalOutput() {}

	    LocalOutput.prototype.output = [];

	    LocalOutput.prototype.send = function() {
	      return console.log.apply(console.log, arguments);
	    };

	    LocalOutput.prototype.add = function() {
	      var args;
	      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      return this.output.push(args.join(' '));
	    };

	    LocalOutput.prototype.sendAll = function() {
	      this.send(this.output.join('\n'));
	      return this.output = [];
	    };

	    return LocalOutput;

	  })();

	  module.exports = LocalOutput;

	}).call(this);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {(function() {
	  var file, fs, name, _i, _len, _ref;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  _ref = fs.readdirSync(__dirname);
	  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	    file = _ref[_i];
	    if (file.match(/\.(coffee|js)$/) && !file.match(/index\.(js|coffee)/)) {
	      file = file.substr(0, file.indexOf('.'));
	      name = file.substring(0, 1).toUpperCase() + file.substring(1);
	      exports[name] = __webpack_require__(116)("./" + file);
	    }
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./continue": 117,
		"./continue.js": 117,
		"./help": 160,
		"./help.js": 160,
		"./index": 115,
		"./index.js": 115,
		"./kill": 161,
		"./kill.js": 161,
		"./play": 162,
		"./play.js": 162,
		"./version": 163,
		"./version.js": 163,
		"./whereami": 164,
		"./whereami.js": 164,
		"./wtf": 165,
		"./wtf.js": 165,
		"./xecute": 166,
		"./xecute.js": 166
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 116;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Command, Continue,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Continue = (function(_super) {
	    __extends(Continue, _super);

	    function Continue() {
	      return Continue.__super__.constructor.apply(this, arguments);
	    }

	    Continue.prototype.name = 'continue';

	    Continue.prototype.aliases = ['exit', 'quit', 'stop'];

	    Continue.prototype.definition = 'Ends the current prompt and continues running the rest of the code.';

	    Continue.prototype.execute = function(args, chain) {
	      return chain.stop();
	    };

	    return Continue;

	  })(Command);

	  module.exports = Continue;

	}).call(this);


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {(function() {
	  var Command, File, Range;

	  File = __webpack_require__(119);

	  Range = __webpack_require__(159);

	  Command = (function() {
	    Command.commands = {};

	    Command.prototype.name = '';

	    Command.prototype.aliases = [];

	    Command.prototype.definition = '';

	    Command.prototype.help = '';

	    Command.prototype.args = new Range(0, 0);

	    function Command(_arg) {
	      this.scope = _arg.scope, this.output = _arg.output;
	      this.stack = new Error().stack;
	      this.constructor.commands[this.constructor.name] = this;
	    }

	    Command.prototype.command = function(input) {
	      var command, name, _ref;
	      _ref = this.commands();
	      for (name in _ref) {
	        command = _ref[name];
	        if (command.constructor.name.match(new RegExp(input, 'i'))) {
	          return command;
	        }
	      }
	    };

	    Command.prototype.commands = function() {
	      return this.constructor.commands;
	    };

	    Command.prototype.typeahead = function() {
	      var items;
	      items = this.aliases.slice(0);
	      items.push(this.name);
	      return items;
	    };

	    Command.prototype.command_regex = function() {
	      var subject;
	      subject = "^(?:" + this.name;
	      if (this.aliases.length > 0) {
	        subject += "|" + (this.aliases.join('|'));
	      }
	      subject += ")((?: (?:[^ ]+))" + (this.args.to_regex()) + ")$";
	      return new RegExp(subject);
	    };

	    Command.prototype.match = function(input) {
	      return input.match(this.command_regex());
	    };

	    Command.prototype.find_file = function() {
	      var file, foundCall, item, line, _, _i, _len, _ref, _ref1;
	      foundCall = false;
	      _ref = this.stack.split('\n');
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        item = _ref[_i];
	        if (foundCall) {
	          _ref1 = item.match(/([^ (:]+):(\d+):\d+/), _ = _ref1[0], file = _ref1[1], line = _ref1[2];
	          if (file !== '<anonymous>') {
	            return new File(file, line);
	          }
	        } else if (item.match(/Pry\.open/)) {
	          foundCall = true;
	        }
	      }
	      return new File(__filename, 1);
	    };

	    return Command;

	  })();

	  module.exports = Command;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, "/index.js"))

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var File, SyncHighlight, fs;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  SyncHighlight = __webpack_require__(120);

	  File = (function() {
	    function File(name, line) {
	      this.name = name;
	      this.line = line;
	      this.line = parseInt(this.line);
	    }

	    File.prototype.type = function() {
	      if (this.name.match(/coffee$/)) {
	        return 'coffee';
	      } else {
	        return 'js';
	      }
	    };

	    File.prototype.by_lines = function(start, end) {
	      if (end == null) {
	        end = start;
	      }
	      return this.content().split('\n').slice(start - 1, end).join('\n');
	    };

	    File.prototype.length = function() {
	      return this.content().split('\n').length || 0;
	    };

	    File.prototype.content = function() {
	      return this._content || (this._content = fs.readFileSync(this.name).toString());
	    };

	    File.prototype.formatted_content_by_line = function(start, end, line) {
	      if (end == null) {
	        end = start;
	      }
	      if (line == null) {
	        line = this.line;
	      }
	      start = (start <= 0 ? 1 : start);
	      return new SyncHighlight(this.content(), this.type()).code_snippet(start, end, line);
	    };

	    return File;

	  })();

	  module.exports = File;

	}).call(this);


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var SyncHighlight, chalk, deasync, pygmentize, util;

	  pygmentize = __webpack_require__(121);

	  deasync = __webpack_require__(6);

	  chalk = __webpack_require__(152);

	  util = __webpack_require__(134);

	  SyncHighlight = (function() {
	    SyncHighlight.prototype.content = null;

	    SyncHighlight.prototype.type = null;

	    function SyncHighlight(obj, type) {
	      this.type = type != null ? type : 'javascript';
	      if (typeof obj === 'function') {
	        this.content = obj.toString();
	      } else if (typeof obj === 'string') {
	        this.content = obj;
	      } else {
	        this.content = JSON.stringify(obj, this.stringify, "\t");
	      }
	    }

	    SyncHighlight.prototype.stringify = function(key, value) {
	      if (typeof value === 'function') {
	        return util.inspect(value);
	      }
	      return value;
	    };

	    SyncHighlight.prototype.highlight = function() {
	      var data, done;
	      if (chalk.supportsColor) {
	        done = data = false;
	        pygmentize({
	          lang: this.type,
	          format: "terminal"
	        }, this.content, (function(_this) {
	          return function(err, res) {
	            done = true;
	            return data = res.toString();
	          };
	        })(this));
	        while (!done) {
	          deasync.runLoopOnce();
	        }
	      } else {
	        data = this.content;
	      }
	      return data;
	    };

	    SyncHighlight.prototype.code_snippet = function(start, end, line_number, line_pointer) {
	      var key, line, lines, pointer, _i, _len;
	      if (line_pointer == null) {
	        line_pointer = ' => ';
	      }
	      lines = this.highlight().split('\n');
	      for (key = _i = 0, _len = lines.length; _i < _len; key = ++_i) {
	        line = lines[key];
	        if (key + 1 === line_number) {
	          pointer = line_pointer;
	        } else {
	          pointer = this._spaces(line_pointer.length);
	        }
	        lines[key] = "" + pointer + (this._space(key + 1)) + (chalk.cyan(key + 1)) + ": " + line;
	      }
	      return lines.slice(start - 1, end).join('\n');
	    };

	    SyncHighlight.prototype._space = function(line) {
	      return this._spaces(4 - String(line).length);
	    };

	    SyncHighlight.prototype._spaces = function(length, char) {
	      if (char == null) {
	        char = ' ';
	      }
	      return new Array(length + 1).join(char);
	    };

	    return SyncHighlight;

	  })();

	  module.exports = SyncHighlight;

	}).call(this);


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {const spawn           = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).spawn
	    , exec            = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).exec
	    , path            = __webpack_require__(7)
	    , bl              = __webpack_require__(122)
	    , through2        = __webpack_require__(137)

	    , defaultFormat   = 'html'
	    , defaultLang     = 'js'
	    , defaultEncoding = 'utf8'


	var pythonVersions = {}


	function fromString (child, code, callback) {
	  var stdout = bl()
	    , stderr = bl()
	    , ec     = 0
	    , exitClose = function () {
	        if (++ec < 2)
	          return

	        callback(null, stdout.slice())
	      }

	  child.stdout.pipe(stdout)
	  child.stderr.pipe(stderr)

	  child.on('exit', function (code) {
	    if (code !== 0) {
	      ec = -1
	      return callback(new Error('Error calling `pygmentize`: ' + stderr.toString()))
	    }
	    exitClose()
	  })
	  child.on('close', exitClose)

	  child.stdin.write(code)
	  child.stdin.end()
	}

	function fromStream (retStream, intStream, child) {
	  var stderr    = bl()
	    , outStream = through2(function (chunk, enc, callback) {
	        retStream.__write(chunk, enc, callback)
	      })

	  intStream.pipe(child.stdin)
	  child.stdout.pipe(outStream)
	  child.stderr.pipe(stderr)

	  child.on('exit', function (code) {
	    if (code !== 0)
	      retStream.emit('error', stderr.toString())
	    retStream.__end()
	  })
	}


	function pygmentize (options, code, callback) {
	  options = options || {}

	  var execArgs = [
	          '-f', options.format || defaultFormat
	        , '-l', options.lang || defaultLang
	        , '-P', 'encoding=' + (options.encoding || defaultEncoding)
	      ]
	    , toString  = typeof code == 'string' && typeof callback == 'function'
	    , retStream = !toString && through2()
	    , intStream = !toString && through2()

	  if (typeof options.options == 'object') {
	    Object.keys(options.options).forEach(function (key) {
	      execArgs.push('-P', key + '=' + options.options[key])
	    })
	  }

	  spawnPygmentize(options, execArgs, function (err, child) {
	    if (toString) {
	      if (err)
	        return callback(err)
	      return fromString(child, code, callback)
	    }

	    // else stream
	    if (err)
	      return retStream.emit('error', err)
	    fromStream(retStream, intStream, child)
	  })

	  if (retStream) {
	    retStream.__write = retStream.write
	    retStream.write = intStream.write.bind(intStream)
	    retStream.__end = retStream.end
	    retStream.end = intStream.end.bind(intStream)
	  }

	  return retStream
	}


	function spawnPygmentize (options, execArgs, callback) {
	  var python = typeof options.python == 'string' ? options.python : 'python'

	  pythonVersion(python, function (err, version) {
	    if (err)
	      return callback(err)
	    if (version != 2 && version != 3)
	      return callback(new Error('Unsupported Python version: ' + version))

	    var pyg = path.join(
	        __dirname
	      , 'vendor/pygments'
	      , version == 2 ? 'build-2.7' : 'build-3.3'
	      , 'pygmentize'
	    )

	    callback(null, spawn(python, [ pyg ].concat(execArgs)))
	  })
	}


	function pythonVersion (python, callback) {
	  if (pythonVersions[python])
	    return callback(null, pythonVersions[python])

	  exec(python + ' -V', function (err, stdout, stderr) {
	    if (err)
	      return callback(err)

	    var m = stderr.toString().match(/^Python (\d)[.\d]+/i)
	    if (!m)
	      m = stdout.toString().match(/^Python (\d)[.\d]+/i)
	    if (!m)
	      return callback(new Error('Cannot determine Python version: [' + stderr.toString() + ']'))

	    pythonVersions[python] = +m[1]

	    return callback(null, +m[1])
	  })
	}


	module.exports = pygmentize

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {const DuplexStream = __webpack_require__(123).DuplexStream || __webpack_require__(128)
	    , util         = __webpack_require__(134)

	function BufferList (callback) {
	  if (!(this instanceof BufferList))
	    return new BufferList(callback)

	  this._bufs  = []
	  this.length = 0

	  if (typeof callback == 'function')
	    this._callback = callback
	  else if (Buffer.isBuffer(callback))
	    this.append(callback)
	  else if (Array.isArray(callback)) {
	    callback.forEach(function (b) {
	      Buffer.isBuffer(b) && this.append(b)
	    }.bind(this))
	  }

	  DuplexStream.call(this)
	}

	util.inherits(BufferList, DuplexStream)

	BufferList.prototype._offset = function (offset) {
	  var tot = 0, i = 0, _t
	  for (; i < this._bufs.length; i++) {
	    _t = tot + this._bufs[i].length
	    if (offset < _t)
	      return [ i, offset - tot ]
	    tot = _t
	  }
	}

	BufferList.prototype.append = function (buf) {
	  this._bufs.push(Buffer.isBuffer(buf) ? buf : new Buffer(buf))
	  this.length += buf.length
	  return this
	}

	BufferList.prototype._write = function (buf, encoding, callback) {
	  this.append(buf)
	  if (callback)
	    callback()
	}

	BufferList.prototype._read = function (size) {
	  if (!this.length)
	    return this.push(null)
	  size = Math.min(size, this.length)
	  this.push(this.slice(0, size))
	  this.consume(size)
	}

	BufferList.prototype.end = function (chunk) {
	  DuplexStream.prototype.end.call(this, chunk)

	  if (this._callback)
	    this._callback(null, this.slice())
	}

	BufferList.prototype.get = function (index) {
	  return this.slice(index, index + 1)[0]
	}

	BufferList.prototype.slice = function (start, end) {
	  if (typeof start != 'number' || start < 0)
	    start = 0
	  if (typeof end != 'number' || end > this.length)
	    end = this.length
	  if (start >= this.length)
	    return new Buffer(0)
	  if (end <= 0)
	    return new Buffer(0)

	  if (start === 0 && end == this.length)
	    return Buffer.concat(this._bufs)

	  var off    = this._offset(start)
	    , len    = end - start
	    , bytes  = len
	    , bufoff = 0
	    , buf, l, i

	  start = off[1]

	  // easy, cheap case where it's a subset of one of the buffers
	  if (bytes <= this._bufs[off[0]].length - start)
	    return this._bufs[off[0]].slice(start, start + bytes)

	  buf = new Buffer(len)

	  for (i = off[0]; i < this._bufs.length; i++) {
	    l = this._bufs[i].length - start
	    if (bytes > l) {
	      this._bufs[i].copy(buf, bufoff, start)
	    } else {
	      this._bufs[i].copy(buf, bufoff, start, start + bytes)
	      break
	    }

	    bufoff += l
	    bytes -= l

	    if (start)
	      start = 0
	  }

	  return buf
	}

	BufferList.prototype.toString = function (encoding, start, end) {
	  return this.slice(start, end).toString(encoding)
	}

	BufferList.prototype.consume = function (bytes) {
	  while (this._bufs.length) {
	    if (bytes > this._bufs[0].length) {
	      bytes -= this._bufs[0].length
	      this.length -= this._bufs[0].length
	      this._bufs.shift()
	    } else {
	      this._bufs[0] = this._bufs[0].slice(bytes)
	      this.length -= bytes
	      break
	    }
	  }
	  return this
	}

	;(function () {
	  var methods = {
	      'readDoubleBE' : 8
	    , 'readDoubleLE' : 8
	    , 'readFloatBE'  : 4
	    , 'readFloatLE'  : 4
	    , 'readInt32BE'  : 4
	    , 'readInt32LE'  : 4
	    , 'readUInt32BE' : 4
	    , 'readUInt32LE' : 4
	    , 'readInt16BE'  : 2
	    , 'readInt16LE'  : 2
	    , 'readUInt16BE' : 2
	    , 'readUInt16LE' : 2
	    , 'readInt8'     : 1
	    , 'readUInt8'    : 1
	  }

	  Object.keys(methods).forEach(function (m) {
	    BufferList.prototype[m] = function (offset) {
	      return this.slice(offset, offset + methods[m])[m](0)
	    }
	  })
	}())

	module.exports = BufferList

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(75).Buffer))

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Stream;

	var EE = __webpack_require__(5).EventEmitter;
	var inherits = __webpack_require__(80);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(82);
	Stream.Writable = __webpack_require__(124);
	Stream.Duplex = __webpack_require__(125);
	Stream.Transform = __webpack_require__(126);
	Stream.PassThrough = __webpack_require__(127);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;



	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EE.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(92);


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(91);


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(82).Transform


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(82).PassThrough


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(129)


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	module.exports = Duplex;

	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}
	/*</replacement>*/


	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	var Readable = __webpack_require__(130);
	var Writable = __webpack_require__(133);

	util.inherits(Duplex, Readable);

	forEach(objectKeys(Writable.prototype), function(method) {
	  if (!Duplex.prototype[method])
	    Duplex.prototype[method] = Writable.prototype[method];
	});

	function Duplex(options) {
	  if (!(this instanceof Duplex))
	    return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false)
	    this.readable = false;

	  if (options && options.writable === false)
	    this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false)
	    this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended)
	    return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  process.nextTick(this.end.bind(this));
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Readable;

	/*<replacement>*/
	var isArray = __webpack_require__(131);
	/*</replacement>*/


	/*<replacement>*/
	var Buffer = __webpack_require__(75).Buffer;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	var EE = __webpack_require__(5).EventEmitter;

	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	var Stream = __webpack_require__(123);

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	var StringDecoder;

	util.inherits(Readable, Stream);

	function ReadableState(options, stream) {
	  options = options || {};

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = false;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // In streams that never have any data, and do push(null) right away,
	  // the consumer can miss the 'end' event if they do some I/O before
	  // consuming the stream.  So, we don't emit('end') until some reading
	  // happens.
	  this.calledRead = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, becuase any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;


	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder)
	      StringDecoder = __webpack_require__(132).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  if (!(this instanceof Readable))
	    return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function(chunk, encoding) {
	  var state = this._readableState;

	  if (typeof chunk === 'string' && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function(chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null || chunk === undefined) {
	    state.reading = false;
	    if (!state.ended)
	      onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding)
	        chunk = state.decoder.write(chunk);

	      // update the buffer info.
	      state.length += state.objectMode ? 1 : chunk.length;
	      if (addToFront) {
	        state.buffer.unshift(chunk);
	      } else {
	        state.reading = false;
	        state.buffer.push(chunk);
	      }

	      if (state.needReadable)
	        emitReadable(stream);

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}



	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended &&
	         (state.needReadable ||
	          state.length < state.highWaterMark ||
	          state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function(enc) {
	  if (!StringDecoder)
	    StringDecoder = __webpack_require__(132).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	};

	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	  }
	  return n;
	}

	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended)
	    return 0;

	  if (state.objectMode)
	    return n === 0 ? 0 : 1;

	  if (n === null || isNaN(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
	      return state.buffer[0].length;
	    else
	      return state.length;
	  }

	  if (n <= 0)
	    return 0;

	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);

	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else
	      return state.length;
	  }

	  return n;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function(n) {
	  var state = this._readableState;
	  state.calledRead = true;
	  var nOrig = n;
	  var ret;

	  if (typeof n !== 'number' || n > 0)
	    state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 &&
	      state.needReadable &&
	      (state.length >= state.highWaterMark || state.ended)) {
	    emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    ret = null;

	    // In cases where the decoder did not receive enough data
	    // to produce a full chunk, then immediately received an
	    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
	    // howMuchToRead will see this and coerce the amount to
	    // read to zero (because it's looking at the length of the
	    // first <Buffer > in state.buffer), and we'll end up here.
	    //
	    // This can only happen via state.decoder -- no other venue
	    // exists for pushing a zero-length chunk into state.buffer
	    // and triggering this behavior. In this case, we return our
	    // remaining data and end the stream, if appropriate.
	    if (state.length > 0 && state.decoder) {
	      ret = fromList(n, state);
	      state.length -= ret.length;
	    }

	    if (state.length === 0)
	      endReadable(this);

	    return ret;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length - n <= state.highWaterMark)
	    doRead = true;

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading)
	    doRead = false;

	  if (doRead) {
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0)
	      state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }

	  // If _read called its callback synchronously, then `reading`
	  // will be false, and we need to re-evaluate how much data we
	  // can return to the user.
	  if (doRead && !state.reading)
	    n = howMuchToRead(nOrig, state);

	  if (n > 0)
	    ret = fromList(n, state);
	  else
	    ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  }

	  state.length -= n;

	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended)
	    state.needReadable = true;

	  // If we happened to read() exactly the remaining amount in the
	  // buffer, and the EOF has been seen at this point, then make sure
	  // that we emit 'end' on the very next tick.
	  if (state.ended && !state.endEmitted && state.length === 0)
	    endReadable(this);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!Buffer.isBuffer(chunk) &&
	      'string' !== typeof chunk &&
	      chunk !== null &&
	      chunk !== undefined &&
	      !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}


	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // if we've ended and we have some data left, then emit
	  // 'readable' now to make sure it gets picked up.
	  if (state.length > 0)
	    emitReadable(stream);
	  else
	    endReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (state.emittedReadable)
	    return;

	  state.emittedReadable = true;
	  if (state.sync)
	    process.nextTick(function() {
	      emitReadable_(stream);
	    });
	  else
	    emitReadable_(stream);
	}

	function emitReadable_(stream) {
	  stream.emit('readable');
	}


	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    process.nextTick(function() {
	      maybeReadMore_(stream, state);
	    });
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended &&
	         state.length < state.highWaterMark) {
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;
	    else
	      len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function(n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function(dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	              dest !== process.stdout &&
	              dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted)
	    process.nextTick(endFn);
	  else
	    src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    if (readable !== src) return;
	    cleanup();
	  }

	  function onend() {
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  function cleanup() {
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (!dest._writableState || dest._writableState.needDrain)
	      ondrain();
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0)
	      dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error)
	    dest.on('error', onerror);
	  else if (isArray(dest._events.error))
	    dest._events.error.unshift(onerror);
	  else
	    dest._events.error = [onerror, dest._events.error];



	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    // the handler that waits for readable events after all
	    // the data gets sucked out in flow.
	    // This would be easier to follow with a .once() handler
	    // in flow(), but that is too slow.
	    this.on('readable', pipeOnReadable);

	    state.flowing = true;
	    process.nextTick(function() {
	      flow(src);
	    });
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function() {
	    var dest = this;
	    var state = src._readableState;
	    state.awaitDrain--;
	    if (state.awaitDrain === 0)
	      flow(src);
	  };
	}

	function flow(src) {
	  var state = src._readableState;
	  var chunk;
	  state.awaitDrain = 0;

	  function write(dest, i, list) {
	    var written = dest.write(chunk);
	    if (false === written) {
	      state.awaitDrain++;
	    }
	  }

	  while (state.pipesCount && null !== (chunk = src.read())) {

	    if (state.pipesCount === 1)
	      write(state.pipes, 0, null);
	    else
	      forEach(state.pipes, write);

	    src.emit('data', chunk);

	    // if anyone needs a drain, then we have to wait for that.
	    if (state.awaitDrain > 0)
	      return;
	  }

	  // if every destination was unpiped, either before entering this
	  // function, or in the while loop, then stop flowing.
	  //
	  // NB: This is a pretty rare edge case.
	  if (state.pipesCount === 0) {
	    state.flowing = false;

	    // if there were data event listeners added, then switch to old mode.
	    if (EE.listenerCount(src, 'data') > 0)
	      emitDataEvents(src);
	    return;
	  }

	  // at this point, no one needed a drain, so we just ran out of data
	  // on the next readable event, start it over again.
	  state.ranOut = true;
	}

	function pipeOnReadable() {
	  if (this._readableState.ranOut) {
	    this._readableState.ranOut = false;
	    flow(this);
	  }
	}


	Readable.prototype.unpipe = function(dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0)
	    return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes)
	      return this;

	    if (!dest)
	      dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    this.removeListener('readable', pipeOnReadable);
	    state.flowing = false;
	    if (dest)
	      dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    this.removeListener('readable', pipeOnReadable);
	    state.flowing = false;

	    for (var i = 0; i < len; i++)
	      dests[i].emit('unpipe', this);
	    return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1)
	    return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1)
	    state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function(ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  if (ev === 'data' && !this._readableState.flowing)
	    emitDataEvents(this);

	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        this.read(0);
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function() {
	  emitDataEvents(this);
	  this.read(0);
	  this.emit('resume');
	};

	Readable.prototype.pause = function() {
	  emitDataEvents(this, true);
	  this.emit('pause');
	};

	function emitDataEvents(stream, startPaused) {
	  var state = stream._readableState;

	  if (state.flowing) {
	    // https://github.com/isaacs/readable-stream/issues/16
	    throw new Error('Cannot switch to old mode now.');
	  }

	  var paused = startPaused || false;
	  var readable = false;

	  // convert to an old-style stream.
	  stream.readable = true;
	  stream.pipe = Stream.prototype.pipe;
	  stream.on = stream.addListener = Stream.prototype.on;

	  stream.on('readable', function() {
	    readable = true;

	    var c;
	    while (!paused && (null !== (c = stream.read())))
	      stream.emit('data', c);

	    if (c === null) {
	      readable = false;
	      stream._readableState.needReadable = true;
	    }
	  });

	  stream.pause = function() {
	    paused = true;
	    this.emit('pause');
	  };

	  stream.resume = function() {
	    paused = false;
	    if (readable)
	      process.nextTick(function() {
	        stream.emit('readable');
	      });
	    else
	      this.read(0);
	    this.emit('resume');
	  };

	  // now make it start, just in case it hadn't already.
	  stream.emit('readable');
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function(stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function() {
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length)
	        self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function(chunk) {
	    if (state.decoder)
	      chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    //if (state.objectMode && util.isNullOrUndefined(chunk))
	    if (state.objectMode && (chunk === null || chunk === undefined))
	      return;
	    else if (!state.objectMode && (!chunk || !chunk.length))
	      return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (typeof stream[i] === 'function' &&
	        typeof this[i] === 'undefined') {
	      this[i] = function(method) { return function() {
	        return stream[method].apply(stream, arguments);
	      }}(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function(ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function(n) {
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};



	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;

	  // nothing in the list, definitely empty.
	  if (list.length === 0)
	    return null;

	  if (length === 0)
	    ret = null;
	  else if (objectMode)
	    ret = list.shift();
	  else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode)
	      ret = list.join('');
	    else
	      ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode)
	        ret = '';
	      else
	        ret = new Buffer(n);

	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);

	        if (stringMode)
	          ret += buf.slice(0, cpy);
	        else
	          buf.copy(ret, c, 0, cpy);

	        if (cpy < buf.length)
	          list[0] = buf.slice(cpy);
	        else
	          list.shift();

	        c += cpy;
	      }
	    }
	  }

	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0)
	    throw new Error('endReadable called on non-empty stream');

	  if (!state.endEmitted && state.calledRead) {
	    state.ended = true;
	    process.nextTick(function() {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf (xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 131 */
/***/ (function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(75).Buffer;

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.

	module.exports = Writable;

	/*<replacement>*/
	var Buffer = __webpack_require__(75).Buffer;
	/*</replacement>*/

	Writable.WritableState = WritableState;


	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	var Stream = __webpack_require__(123);

	util.inherits(Writable, Stream);

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}

	function WritableState(options, stream) {
	  options = options || {};

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, becuase any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function(er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.buffer = [];

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}

	function Writable(options) {
	  var Duplex = __webpack_require__(129);

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex))
	    return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};


	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  process.nextTick(function() {
	    cb(er);
	  });
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!Buffer.isBuffer(chunk) &&
	      'string' !== typeof chunk &&
	      chunk !== null &&
	      chunk !== undefined &&
	      !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    process.nextTick(function() {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function(chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (Buffer.isBuffer(chunk))
	    encoding = 'buffer';
	  else if (!encoding)
	    encoding = state.defaultEncoding;

	  if (typeof cb !== 'function')
	    cb = function() {};

	  if (state.ended)
	    writeAfterEnd(this, state, cb);
	  else if (validChunk(this, state, chunk, cb))
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);

	  return ret;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode &&
	      state.decodeStrings !== false &&
	      typeof chunk === 'string') {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (Buffer.isBuffer(chunk))
	    encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret)
	    state.needDrain = true;

	  if (state.writing)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	  else
	    doWrite(stream, state, len, chunk, encoding, cb);

	  return ret;
	}

	function doWrite(stream, state, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  if (sync)
	    process.nextTick(function() {
	      cb(er);
	    });
	  else
	    cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er)
	    onwriteError(stream, state, sync, er, cb);
	  else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);

	    if (!finished && !state.bufferProcessing && state.buffer.length)
	      clearBuffer(stream, state);

	    if (sync) {
	      process.nextTick(function() {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished)
	    onwriteDrain(stream, state);
	  cb();
	  if (finished)
	    finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}


	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;

	  for (var c = 0; c < state.buffer.length; c++) {
	    var entry = state.buffer[c];
	    var chunk = entry.chunk;
	    var encoding = entry.encoding;
	    var cb = entry.callback;
	    var len = state.objectMode ? 1 : chunk.length;

	    doWrite(stream, state, len, chunk, encoding, cb);

	    // if we didn't call the onwrite immediately, then
	    // it means that we need to wait until it does.
	    // also, that means that the chunk and cb are currently
	    // being processed, so move the buffer counter past them.
	    if (state.writing) {
	      c++;
	      break;
	    }
	  }

	  state.bufferProcessing = false;
	  if (c < state.buffer.length)
	    state.buffer = state.buffer.slice(c);
	  else
	    state.buffer.length = 0;
	}

	Writable.prototype._write = function(chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};

	Writable.prototype.end = function(chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (typeof chunk !== 'undefined' && chunk !== null)
	    this.write(chunk, encoding);

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished)
	    endWritable(this, state, cb);
	};


	function needFinish(stream, state) {
	  return (state.ending &&
	          state.length === 0 &&
	          !state.finished &&
	          !state.writing);
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    state.finished = true;
	    stream.emit('finish');
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished)
	      process.nextTick(cb);
	    else
	      stream.once('finish', cb);
	  }
	  state.ended = true;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(135);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(136);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ }),
/* 135 */
/***/ (function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ }),
/* 136 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	const Transform = __webpack_require__(123).Transform || __webpack_require__(138)
	    , inherits  = __webpack_require__(134).inherits
	    , xtend     = __webpack_require__(146)

	function noop (chunk, enc, callback) {
	  callback(null, chunk)
	}

	function ctor (options, transform, flush) {
	  if (typeof options == 'function') {
	    flush     = transform
	    transform = options
	    options   = {}
	  }

	  if (typeof transform != 'function')
	    transform = noop

	  function Through2 (override) {
	    if (!(this instanceof Through2))
	      return new Through2(override)

	    this.options = xtend(options, override)
	    Transform.call(this, this.options)
	  }

	  inherits(Through2, Transform)

	  Through2.prototype._transform = transform

	  if (typeof flush == 'function')
	    Through2.prototype._flush = flush

	  return Through2
	}

	function make (options, transform, flush) {
	  return ctor(options, transform, flush)()
	}

	module.exports      = make
	module.exports.ctor = ctor

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(139)


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.


	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	module.exports = Transform;

	var Duplex = __webpack_require__(140);

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	util.inherits(Transform, Duplex);


	function TransformState(options, stream) {
	  this.afterTransform = function(er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb)
	    return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (!util.isNullOrUndefined(data))
	    stream.push(data);

	  if (cb)
	    cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}


	function Transform(options) {
	  if (!(this instanceof Transform))
	    return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(options, this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  this.once('prefinish', function() {
	    if (util.isFunction(this._flush))
	      this._flush(function(er) {
	        done(stream, er);
	      });
	    else
	      done(stream);
	  });
	}

	Transform.prototype.push = function(chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function(chunk, encoding, cb) {
	  throw new Error('not implemented');
	};

	Transform.prototype._write = function(chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform ||
	        rs.needReadable ||
	        rs.length < rs.highWaterMark)
	      this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function(n) {
	  var ts = this._transformState;

	  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};


	function done(stream, er) {
	  if (er)
	    return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length)
	    throw new Error('calling transform done when ws.length != 0');

	  if (ts.transforming)
	    throw new Error('calling transform done when still transforming');

	  return stream.push(null);
	}


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	module.exports = Duplex;

	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}
	/*</replacement>*/


	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	var Readable = __webpack_require__(141);
	var Writable = __webpack_require__(145);

	util.inherits(Duplex, Readable);

	forEach(objectKeys(Writable.prototype), function(method) {
	  if (!Duplex.prototype[method])
	    Duplex.prototype[method] = Writable.prototype[method];
	});

	function Duplex(options) {
	  if (!(this instanceof Duplex))
	    return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false)
	    this.readable = false;

	  if (options && options.writable === false)
	    this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false)
	    this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended)
	    return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  process.nextTick(this.end.bind(this));
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Readable;

	/*<replacement>*/
	var isArray = __webpack_require__(142);
	/*</replacement>*/


	/*<replacement>*/
	var Buffer = __webpack_require__(75).Buffer;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	var EE = __webpack_require__(5).EventEmitter;

	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	var Stream = __webpack_require__(123);

	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	var StringDecoder;


	/*<replacement>*/
	var debug = __webpack_require__(143);
	if (debug && debug.debuglog) {
	  debug = debug.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/


	util.inherits(Readable, Stream);

	function ReadableState(options, stream) {
	  var Duplex = __webpack_require__(140);

	  options = options || {};

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;


	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder)
	      StringDecoder = __webpack_require__(144).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  var Duplex = __webpack_require__(140);

	  if (!(this instanceof Readable))
	    return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function(chunk, encoding) {
	  var state = this._readableState;

	  if (util.isString(chunk) && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function(chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (util.isNullOrUndefined(chunk)) {
	    state.reading = false;
	    if (!state.ended)
	      onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding)
	        chunk = state.decoder.write(chunk);

	      if (!addToFront)
	        state.reading = false;

	      // if we want the data now, just emit it.
	      if (state.flowing && state.length === 0 && !state.sync) {
	        stream.emit('data', chunk);
	        stream.read(0);
	      } else {
	        // update the buffer info.
	        state.length += state.objectMode ? 1 : chunk.length;
	        if (addToFront)
	          state.buffer.unshift(chunk);
	        else
	          state.buffer.push(chunk);

	        if (state.needReadable)
	          emitReadable(stream);
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}



	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended &&
	         (state.needReadable ||
	          state.length < state.highWaterMark ||
	          state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function(enc) {
	  if (!StringDecoder)
	    StringDecoder = __webpack_require__(144).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	  }
	  return n;
	}

	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended)
	    return 0;

	  if (state.objectMode)
	    return n === 0 ? 0 : 1;

	  if (isNaN(n) || util.isNull(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
	      return state.buffer[0].length;
	    else
	      return state.length;
	  }

	  if (n <= 0)
	    return 0;

	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);

	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else
	      return state.length;
	  }

	  return n;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function(n) {
	  debug('read', n);
	  var state = this._readableState;
	  var nOrig = n;

	  if (!util.isNumber(n) || n > 0)
	    state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 &&
	      state.needReadable &&
	      (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended)
	      endReadable(this);
	    else
	      emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0)
	      endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  }

	  if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0)
	      state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }

	  // If _read pushed data synchronously, then `reading` will be false,
	  // and we need to re-evaluate how much data we can return to the user.
	  if (doRead && !state.reading)
	    n = howMuchToRead(nOrig, state);

	  var ret;
	  if (n > 0)
	    ret = fromList(n, state);
	  else
	    ret = null;

	  if (util.isNull(ret)) {
	    state.needReadable = true;
	    n = 0;
	  }

	  state.length -= n;

	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended)
	    state.needReadable = true;

	  // If we tried to read() past the EOF, then emit end on the next tick.
	  if (nOrig !== n && state.ended && state.length === 0)
	    endReadable(this);

	  if (!util.isNull(ret))
	    this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}


	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync)
	      process.nextTick(function() {
	        emitReadable_(stream);
	      });
	    else
	      emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}


	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    process.nextTick(function() {
	      maybeReadMore_(stream, state);
	    });
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended &&
	         state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;
	    else
	      len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function(n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function(dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	              dest !== process.stdout &&
	              dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted)
	    process.nextTick(endFn);
	  else
	    src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain &&
	        (!dest._writableState || dest._writableState.needDrain))
	      ondrain();
	  }

	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    var ret = dest.write(chunk);
	    if (false === ret) {
	      debug('false write response, pause',
	            src._readableState.awaitDrain);
	      src._readableState.awaitDrain++;
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0)
	      dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error)
	    dest.on('error', onerror);
	  else if (isArray(dest._events.error))
	    dest._events.error.unshift(onerror);
	  else
	    dest._events.error = [onerror, dest._events.error];



	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function() {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain)
	      state.awaitDrain--;
	    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}


	Readable.prototype.unpipe = function(dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0)
	    return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes)
	      return this;

	    if (!dest)
	      dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest)
	      dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var i = 0; i < len; i++)
	      dests[i].emit('unpipe', this);
	    return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1)
	    return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1)
	    state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function(ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  // If listening to data, and it has not explicitly been paused,
	  // then call resume to start the flow of data on the next tick.
	  if (ev === 'data' && false !== this._readableState.flowing) {
	    this.resume();
	  }

	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        var self = this;
	        process.nextTick(function() {
	          debug('readable nexttick read 0');
	          self.read(0);
	        });
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function() {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    if (!state.reading) {
	      debug('resume read 0');
	      this.read(0);
	    }
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    process.nextTick(function() {
	      resume_(stream, state);
	    });
	  }
	}

	function resume_(stream, state) {
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading)
	    stream.read(0);
	}

	Readable.prototype.pause = function() {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  if (state.flowing) {
	    do {
	      var chunk = stream.read();
	    } while (null !== chunk && state.flowing);
	  }
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function(stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function() {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length)
	        self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function(chunk) {
	    debug('wrapped data');
	    if (state.decoder)
	      chunk = state.decoder.write(chunk);
	    if (!chunk || !state.objectMode && !chunk.length)
	      return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
	      this[i] = function(method) { return function() {
	        return stream[method].apply(stream, arguments);
	      }}(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function(ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function(n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};



	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;

	  // nothing in the list, definitely empty.
	  if (list.length === 0)
	    return null;

	  if (length === 0)
	    ret = null;
	  else if (objectMode)
	    ret = list.shift();
	  else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode)
	      ret = list.join('');
	    else
	      ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode)
	        ret = '';
	      else
	        ret = new Buffer(n);

	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);

	        if (stringMode)
	          ret += buf.slice(0, cpy);
	        else
	          buf.copy(ret, c, 0, cpy);

	        if (cpy < buf.length)
	          list[0] = buf.slice(cpy);
	        else
	          list.shift();

	        c += cpy;
	      }
	    }
	  }

	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0)
	    throw new Error('endReadable called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    process.nextTick(function() {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf (xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 142 */
/***/ (function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ }),
/* 143 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(75).Buffer;

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.

	module.exports = Writable;

	/*<replacement>*/
	var Buffer = __webpack_require__(75).Buffer;
	/*</replacement>*/

	Writable.WritableState = WritableState;


	/*<replacement>*/
	var util = __webpack_require__(87);
	util.inherits = __webpack_require__(80);
	/*</replacement>*/

	var Stream = __webpack_require__(123);

	util.inherits(Writable, Stream);

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}

	function WritableState(options, stream) {
	  var Duplex = __webpack_require__(140);

	  options = options || {};

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function(er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.buffer = [];

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}

	function Writable(options) {
	  var Duplex = __webpack_require__(140);

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex))
	    return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};


	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  process.nextTick(function() {
	    cb(er);
	  });
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    process.nextTick(function() {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function(chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  else if (!encoding)
	    encoding = state.defaultEncoding;

	  if (!util.isFunction(cb))
	    cb = function() {};

	  if (state.ended)
	    writeAfterEnd(this, state, cb);
	  else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function() {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function() {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing &&
	        !state.corked &&
	        !state.finished &&
	        !state.bufferProcessing &&
	        state.buffer.length)
	      clearBuffer(this, state);
	  }
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode &&
	      state.decodeStrings !== false &&
	      util.isString(chunk)) {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret)
	    state.needDrain = true;

	  if (state.writing || state.corked)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	  else
	    doWrite(stream, state, false, len, chunk, encoding, cb);

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev)
	    stream._writev(chunk, state.onwrite);
	  else
	    stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  if (sync)
	    process.nextTick(function() {
	      state.pendingcb--;
	      cb(er);
	    });
	  else {
	    state.pendingcb--;
	    cb(er);
	  }

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er)
	    onwriteError(stream, state, sync, er, cb);
	  else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);

	    if (!finished &&
	        !state.corked &&
	        !state.bufferProcessing &&
	        state.buffer.length) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      process.nextTick(function() {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished)
	    onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}


	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;

	  if (stream._writev && state.buffer.length > 1) {
	    // Fast case, write everything using _writev()
	    var cbs = [];
	    for (var c = 0; c < state.buffer.length; c++)
	      cbs.push(state.buffer[c].callback);

	    // count the one we are adding, as well.
	    // TODO(isaacs) clean this up
	    state.pendingcb++;
	    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
	      for (var i = 0; i < cbs.length; i++) {
	        state.pendingcb--;
	        cbs[i](err);
	      }
	    });

	    // Clear buffer
	    state.buffer = [];
	  } else {
	    // Slow case, write chunks one-by-one
	    for (var c = 0; c < state.buffer.length; c++) {
	      var entry = state.buffer[c];
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);

	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        c++;
	        break;
	      }
	    }

	    if (c < state.buffer.length)
	      state.buffer = state.buffer.slice(c);
	    else
	      state.buffer.length = 0;
	  }

	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function(chunk, encoding, cb) {
	  cb(new Error('not implemented'));

	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function(chunk, encoding, cb) {
	  var state = this._writableState;

	  if (util.isFunction(chunk)) {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }

	  if (!util.isNullOrUndefined(chunk))
	    this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished)
	    endWritable(this, state, cb);
	};


	function needFinish(stream, state) {
	  return (state.ending &&
	          state.length === 0 &&
	          !state.finished &&
	          !state.writing);
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else
	      prefinish(stream, state);
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished)
	      process.nextTick(cb);
	    else
	      stream.once('finish', cb);
	  }
	  state.ended = true;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

	var Keys = __webpack_require__(147)
	var hasKeys = __webpack_require__(151)

	module.exports = extend

	function extend() {
	    var target = {}

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]

	        if (!hasKeys(source)) {
	            continue
	        }

	        var keys = Keys(source)

	        for (var j = 0; j < keys.length; j++) {
	            var name = keys[j]
	            target[name] = source[name]
	        }
	    }

	    return target
	}


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = Object.keys || __webpack_require__(148);



/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

	(function () {
		"use strict";

		// modified from https://github.com/kriskowal/es5-shim
		var has = Object.prototype.hasOwnProperty,
			toString = Object.prototype.toString,
			forEach = __webpack_require__(149),
			isArgs = __webpack_require__(150),
			hasDontEnumBug = !({'toString': null}).propertyIsEnumerable('toString'),
			hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),
			dontEnums = [
				"toString",
				"toLocaleString",
				"valueOf",
				"hasOwnProperty",
				"isPrototypeOf",
				"propertyIsEnumerable",
				"constructor"
			],
			keysShim;

		keysShim = function keys(object) {
			var isObject = object !== null && typeof object === 'object',
				isFunction = toString.call(object) === '[object Function]',
				isArguments = isArgs(object),
				theKeys = [];

			if (!isObject && !isFunction && !isArguments) {
				throw new TypeError("Object.keys called on a non-object");
			}

			if (isArguments) {
				forEach(object, function (value) {
					theKeys.push(value);
				});
			} else {
				var name,
					skipProto = hasProtoEnumBug && isFunction;

				for (name in object) {
					if (!(skipProto && name === 'prototype') && has.call(object, name)) {
						theKeys.push(name);
					}
				}
			}

			if (hasDontEnumBug) {
				var ctor = object.constructor,
					skipConstructor = ctor && ctor.prototype === object;

				forEach(dontEnums, function (dontEnum) {
					if (!(skipConstructor && dontEnum === 'constructor') && has.call(object, dontEnum)) {
						theKeys.push(dontEnum);
					}
				});
			}
			return theKeys;
		};

		module.exports = keysShim;
	}());



/***/ }),
/* 149 */
/***/ (function(module, exports) {

	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;

	var isFunction = function (fn) {
		var isFunc = (typeof fn === 'function' && !(fn instanceof RegExp)) || toString.call(fn) === '[object Function]';
		if (!isFunc && typeof window !== 'undefined') {
			isFunc = fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt;
		}
		return isFunc;
	};

	module.exports = function forEach(obj, fn) {
		if (!isFunction(fn)) {
			throw new TypeError('iterator must be a function');
		}
		var i, k,
			isString = typeof obj === 'string',
			l = obj.length,
			context = arguments.length > 2 ? arguments[2] : null;
		if (l === +l) {
			for (i = 0; i < l; i++) {
				if (context === null) {
					fn(isString ? obj.charAt(i) : obj[i], i, obj);
				} else {
					fn.call(context, isString ? obj.charAt(i) : obj[i], i, obj);
				}
			}
		} else {
			for (k in obj) {
				if (hasOwn.call(obj, k)) {
					if (context === null) {
						fn(obj[k], k, obj);
					} else {
						fn.call(context, obj[k], k, obj);
					}
				}
			}
		}
	};



/***/ }),
/* 150 */
/***/ (function(module, exports) {

	var toString = Object.prototype.toString;

	module.exports = function isArguments(value) {
		var str = toString.call(value);
		var isArguments = str === '[object Arguments]';
		if (!isArguments) {
			isArguments = str !== '[object Array]'
				&& value !== null
				&& typeof value === 'object'
				&& typeof value.length === 'number'
				&& value.length >= 0
				&& toString.call(value.callee) === '[object Function]';
		}
		return isArguments;
	};



/***/ }),
/* 151 */
/***/ (function(module, exports) {

	module.exports = hasKeys

	function hasKeys(source) {
	    return source !== null &&
	        (typeof source === "object" ||
	        typeof source === "function")
	}


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var escapeStringRegexp = __webpack_require__(153);
	var ansiStyles = __webpack_require__(154);
	var stripAnsi = __webpack_require__(155);
	var hasAnsi = __webpack_require__(157);
	var supportsColor = __webpack_require__(158);
	var defineProps = Object.defineProperties;
	var chalk = module.exports;

	function build(_styles) {
		var builder = function builder() {
			return applyStyle.apply(builder, arguments);
		};
		builder._styles = _styles;
		// __proto__ is used because we must return a function, but there is
		// no way to create a function with a different prototype.
		builder.__proto__ = proto;
		return builder;
	}

	var styles = (function () {
		var ret = {};

		ansiStyles.grey = ansiStyles.gray;

		Object.keys(ansiStyles).forEach(function (key) {
			ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

			ret[key] = {
				get: function () {
					return build(this._styles.concat(key));
				}
			};
		});

		return ret;
	})();

	var proto = defineProps(function chalk() {}, styles);

	function applyStyle() {
		// support varags, but simply cast to string in case there's only one arg
		var args = arguments;
		var argsLen = args.length;
		var str = argsLen !== 0 && String(arguments[0]);
		if (argsLen > 1) {
			// don't slice `arguments`, it prevents v8 optimizations
			for (var a = 1; a < argsLen; a++) {
				str += ' ' + args[a];
			}
		}

		if (!chalk.enabled || !str) {
			return str;
		}

		/*jshint validthis: true*/
		var nestedStyles = this._styles;

		for (var i = 0; i < nestedStyles.length; i++) {
			var code = ansiStyles[nestedStyles[i]];
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			str = code.open + str.replace(code.closeRe, code.open) + code.close;
		}

		return str;
	}

	function init() {
		var ret = {};

		Object.keys(styles).forEach(function (name) {
			ret[name] = {
				get: function () {
					return build([name]);
				}
			};
		});

		return ret;
	}

	defineProps(chalk, init());

	chalk.styles = ansiStyles;
	chalk.hasColor = hasAnsi;
	chalk.stripColor = stripAnsi;
	chalk.supportsColor = supportsColor;

	// detect mode if not set manually
	if (chalk.enabled === undefined) {
		chalk.enabled = chalk.supportsColor;
	}


/***/ }),
/* 153 */
/***/ (function(module, exports) {

	'use strict';

	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		return str.replace(matchOperatorsRe, '\\$&');
	};


/***/ }),
/* 154 */
/***/ (function(module, exports) {

	'use strict';
	var styles = module.exports;

	var codes = {
		reset: [0, 0],

		bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29],

		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],
		gray: [90, 39],

		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49]
	};

	Object.keys(codes).forEach(function (key) {
		var val = codes[key];
		var style = styles[key] = {};
		style.open = '\u001b[' + val[0] + 'm';
		style.close = '\u001b[' + val[1] + 'm';
	});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(156)();

	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ }),
/* 156 */
/***/ (function(module, exports) {

	'use strict';
	module.exports = function () {
		return /\u001b\[(?:[0-9]{1,3}(?:;[0-9]{1,3})*)?[m|K]/g;
	};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(156);
	var re = new RegExp(ansiRegex().source); // remove the `g` flag
	module.exports = re.test.bind(re);


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	module.exports = (function () {
		if (process.argv.indexOf('--no-color') !== -1) {
			return false;
		}

		if (process.argv.indexOf('--color') !== -1) {
			return true;
		}

		if (process.stdout && !process.stdout.isTTY) {
			return false;
		}

		if (process.platform === 'win32') {
			return true;
		}

		if ('COLORTERM' in process.env) {
			return true;
		}

		if (process.env.TERM === 'dumb') {
			return false;
		}

		if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
			return true;
		}

		return false;
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 159 */
/***/ (function(module, exports) {

	(function() {
	  var Range;

	  Range = (function() {
	    Range.prototype.start = 0;

	    Range.prototype.end = 0;

	    function Range(start, end) {
	      this.start = start;
	      this.end = end;
	      if (this.start > this.end) {
	        throw "Start must be smaller than end";
	      }
	    }

	    Range.prototype.includes = function(i) {
	      return this.start <= i && i <= this.end;
	    };

	    Range.prototype.to_regex = function() {
	      if (this.end === Infinity) {
	        return "{" + this.start + ",}";
	      } else {
	        return "{" + this.start + "," + this.end + "}";
	      }
	    };

	    return Range;

	  })();

	  module.exports = Range;

	}).call(this);


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Command, Help, Range, chalk,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Range = __webpack_require__(159);

	  chalk = __webpack_require__(152);

	  Help = (function(_super) {
	    __extends(Help, _super);

	    function Help() {
	      return Help.__super__.constructor.apply(this, arguments);
	    }

	    Help.prototype.name = 'help';

	    Help.prototype.aliases = ['\\?'];

	    Help.prototype.definition = 'Shows a list of commands. Type `help foo` for help on the `foo` command.';

	    Help.prototype.help = 'You just lost the game.';

	    Help.prototype.args = new Range(0, 1);

	    Help.prototype.typeahead = function(input) {
	      var command, items, name, _ref;
	      if (input == null) {
	        input = '';
	      }
	      if (input.indexOf('help') === 0) {
	        items = [];
	        _ref = this.commands();
	        for (name in _ref) {
	          command = _ref[name];
	          if (command.name) {
	            items.push("help " + command.name);
	          }
	        }
	        return items;
	      } else {
	        return ['help'];
	      }
	    };

	    Help.prototype.execute = function(_arg, chain) {
	      var command, name, _ref;
	      name = _arg[0];
	      if (name) {
	        command = this.command(name);
	        this.output.add(chalk.blue(command.name), '-', command.definition);
	        this.output.add(command.help);
	        this.output.sendAll();
	      } else {
	        _ref = this.commands();
	        for (name in _ref) {
	          command = _ref[name];
	          if (command.name) {
	            this.output.add(chalk.blue(command.name), '-', command.definition);
	          }
	        }
	        this.output.sendAll();
	      }
	      return chain.next();
	    };

	    return Help;

	  })(Command);

	  module.exports = Help;

	}).call(this);


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  var Command, Kill,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Kill = (function(_super) {
	    __extends(Kill, _super);

	    function Kill() {
	      return Kill.__super__.constructor.apply(this, arguments);
	    }

	    Kill.prototype.name = 'kill!';

	    Kill.prototype.aliases = ['kill', 'exit!', 'quit!', 'stop!'];

	    Kill.prototype.definition = 'Exits from the entire script.';

	    Kill.prototype.execute = function(args, chain) {
	      chain.stop();
	      process.kill();
	      return false;
	    };

	    return Kill;

	  })(Command);

	  module.exports = Kill;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Command, Play, Range,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Range = __webpack_require__(159);

	  Play = (function(_super) {
	    __extends(Play, _super);

	    Play.prototype.name = 'play';

	    Play.prototype.definition = 'Play a specific line, or set of lines in the file you are in.';

	    Play.prototype.help = '`play 1 2` will play lines 1 and 2.\n`play 1` will just play line 1.';

	    Play.prototype.args = new Range(1, 2);

	    function Play() {
	      Play.__super__.constructor.apply(this, arguments);
	      this.file = this.find_file();
	    }

	    Play.prototype.execute = function(_arg, chain) {
	      var end, start;
	      start = _arg[0], end = _arg[1];
	      end || (end = start);
	      this.command('xecute').execute_code(this.file.by_lines(start, end), this.file.type());
	      return chain.next();
	    };

	    return Play;

	  })(Command);

	  module.exports = Play;

	}).call(this);


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {(function() {
	  var Command, Version,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Version = (function(_super) {
	    __extends(Version, _super);

	    function Version() {
	      return Version.__super__.constructor.apply(this, arguments);
	    }

	    Version.prototype.name = 'version';

	    Version.prototype.definition = 'Shows the current version or pry.js you are using.';

	    Version.prototype.execute = function(args, chain) {
	      var content;
	      content = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync("" + __dirname + "/../../../package.json");
	      this.output.send(JSON.parse(content)['version']);
	      return chain.next();
	    };

	    return Version;

	  })(Command);

	  module.exports = Version;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Command, Range, Whereami,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Range = __webpack_require__(159);

	  Whereami = (function(_super) {
	    __extends(Whereami, _super);

	    Whereami.prototype.name = 'whereami';

	    Whereami.prototype.definition = 'Shows you exactly where you are in the code.';

	    Whereami.prototype.help = '`whereami` - Shows you where you are. \n`whereami 6` - Gives you 6 lines before instead of 5. \n`whereami 6 8` - Gives you 6 lines before instead of 5, and 8 lines after.';

	    Whereami.prototype.args = new Range(0, 2);

	    function Whereami() {
	      Whereami.__super__.constructor.apply(this, arguments);
	      this.file = this.find_file();
	    }

	    Whereami.prototype.execute = function(_arg, chain) {
	      var after, before, end, start;
	      before = _arg[0], after = _arg[1];
	      before || (before = 5);
	      after || (after = 5);
	      start = this.file.line - parseInt(before, 10);
	      end = this.file.line + parseInt(after, 10);
	      this.output.send(this.file.formatted_content_by_line(start, end));
	      return chain.next();
	    };

	    return Whereami;

	  })(Command);

	  module.exports = Whereami;

	}).call(this);


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Command, Wtf,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Wtf = (function(_super) {
	    __extends(Wtf, _super);

	    function Wtf() {
	      return Wtf.__super__.constructor.apply(this, arguments);
	    }

	    Wtf.prototype.name = 'wtf';

	    Wtf.prototype.definition = 'Shows the last caught exception.';

	    Wtf.prototype.help = '`wtf` will show you the last caught exception.';

	    Wtf.prototype.execute = function(args, chain) {
	      if (this.command('xecute').last_error) {
	        this.output.send(this.command('xecute').last_error.stack);
	      } else {
	        this.output.send('No errors');
	      }
	      return chain.next();
	    };

	    return Wtf;

	  })(Command);

	  module.exports = Wtf;

	}).call(this);


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Command, Compiler, Range, Xecute,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  Command = __webpack_require__(118);

	  Range = __webpack_require__(159);

	  Compiler = __webpack_require__(167);

	  Xecute = (function(_super) {
	    __extends(Xecute, _super);

	    Xecute.prototype.name = 'mode';

	    Xecute.prototype.definition = 'Switched between CoffeeScript and JavaScript execution.';

	    Xecute.prototype.help = 'Type `mode` to switch between using JavaScript or CoffeeScript.';

	    Xecute.prototype.last_error = null;

	    Xecute.prototype.args = new Range(1, Infinity);

	    function Xecute() {
	      Xecute.__super__.constructor.apply(this, arguments);
	      this.compiler = new Compiler({
	        scope: this.scope
	      });
	    }

	    Xecute.prototype.execute = function(input, chain) {
	      if (input[0] === 'mode') {
	        return this.switch_mode(chain);
	      }
	      this.execute_code(input.join(' '));
	      return chain.next();
	    };

	    Xecute.prototype.execute_code = function(code, language) {
	      var err;
	      if (language == null) {
	        language = null;
	      }
	      try {
	        return this.output.send(this.compiler.execute(code, language));
	      } catch (_error) {
	        err = _error;
	        this.last_error = err;
	        return this.output.send(err);
	      }
	    };

	    Xecute.prototype.switch_mode = function(chain) {
	      this.compiler.toggle_mode();
	      this.output.send("Switched mode to '" + (this.compiler.mode()) + "'.");
	      return chain.next();
	    };

	    Xecute.prototype.match = function(input) {
	      return [input, input];
	    };

	    return Xecute;

	  })(Command);

	  module.exports = Xecute;

	}).call(this);


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var Compiler, coffee, pry;

	  coffee = __webpack_require__(168);

	  pry = __webpack_require__(1);

	  Compiler = (function() {
	    Compiler.prototype.mode_id = 0;

	    Compiler.prototype.noVarPattern = /^\s*var .*$/gm;

	    Compiler.prototype.modes = ['js', 'coffee'];

	    function Compiler(_arg) {
	      this.scope = _arg.scope;
	    }

	    Compiler.prototype.mode = function() {
	      return this.modes[this.mode_id];
	    };

	    Compiler.prototype.toggle_mode = function() {
	      return this.mode_id = (this.mode_id + 1) % this.modes.length;
	    };

	    Compiler.prototype.execute = function(code, language) {
	      if (language == null) {
	        language = this.modes[this.mode_id];
	      }
	      return this["execute_" + language](code);
	    };

	    Compiler.prototype.execute_coffee = function(code) {
	      return this.execute_js(coffee.compile(code, {
	        bare: true
	      }).replace(this.noVarPattern, ''));
	    };

	    Compiler.prototype.execute_js = function(code) {
	      return this.scope(code);
	    };

	    return Compiler;

	  })();

	  module.exports = Compiler;

	}).call(this);


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, process, global) {// Generated by CoffeeScript 1.12.7
	(function() {
	  var Lexer, SourceMap, base64encode, compile, ext, fn1, formatSourcePosition, fs, getSourceMap, helpers, i, len, lexer, packageJson, parser, path, ref, sourceMaps, sources, vm, withPrettyErrors,
	    hasProp = {}.hasOwnProperty;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  vm = __webpack_require__(169);

	  path = __webpack_require__(7);

	  Lexer = __webpack_require__(171).Lexer;

	  parser = __webpack_require__(174).parser;

	  helpers = __webpack_require__(173);

	  SourceMap = __webpack_require__(175);

	  packageJson = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../package.json\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  exports.VERSION = packageJson.version;

	  exports.FILE_EXTENSIONS = ['.coffee', '.litcoffee', '.coffee.md'];

	  exports.helpers = helpers;

	  base64encode = function(src) {
	    switch (false) {
	      case typeof Buffer !== 'function':
	        return new Buffer(src).toString('base64');
	      case typeof btoa !== 'function':
	        return btoa(encodeURIComponent(src).replace(/%([0-9A-F]{2})/g, function(match, p1) {
	          return String.fromCharCode('0x' + p1);
	        }));
	      default:
	        throw new Error('Unable to base64 encode inline sourcemap.');
	    }
	  };

	  withPrettyErrors = function(fn) {
	    return function(code, options) {
	      var err;
	      if (options == null) {
	        options = {};
	      }
	      try {
	        return fn.call(this, code, options);
	      } catch (error) {
	        err = error;
	        if (typeof code !== 'string') {
	          throw err;
	        }
	        throw helpers.updateSyntaxError(err, code, options.filename);
	      }
	    };
	  };

	  sources = {};

	  sourceMaps = {};

	  exports.compile = compile = withPrettyErrors(function(code, options) {
	    var currentColumn, currentLine, encoded, extend, filename, fragment, fragments, generateSourceMap, header, i, j, js, len, len1, map, merge, newLines, ref, ref1, sourceMapDataURI, sourceURL, token, tokens, v3SourceMap;
	    merge = helpers.merge, extend = helpers.extend;
	    options = extend({}, options);
	    generateSourceMap = options.sourceMap || options.inlineMap || (options.filename == null);
	    filename = options.filename || '<anonymous>';
	    sources[filename] = code;
	    if (generateSourceMap) {
	      map = new SourceMap;
	    }
	    tokens = lexer.tokenize(code, options);
	    options.referencedVars = (function() {
	      var i, len, results;
	      results = [];
	      for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        if (token[0] === 'IDENTIFIER') {
	          results.push(token[1]);
	        }
	      }
	      return results;
	    })();
	    if (!((options.bare != null) && options.bare === true)) {
	      for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        if ((ref = token[0]) === 'IMPORT' || ref === 'EXPORT') {
	          options.bare = true;
	          break;
	        }
	      }
	    }
	    fragments = parser.parse(tokens).compileToFragments(options);
	    currentLine = 0;
	    if (options.header) {
	      currentLine += 1;
	    }
	    if (options.shiftLine) {
	      currentLine += 1;
	    }
	    currentColumn = 0;
	    js = "";
	    for (j = 0, len1 = fragments.length; j < len1; j++) {
	      fragment = fragments[j];
	      if (generateSourceMap) {
	        if (fragment.locationData && !/^[;\s]*$/.test(fragment.code)) {
	          map.add([fragment.locationData.first_line, fragment.locationData.first_column], [currentLine, currentColumn], {
	            noReplace: true
	          });
	        }
	        newLines = helpers.count(fragment.code, "\n");
	        currentLine += newLines;
	        if (newLines) {
	          currentColumn = fragment.code.length - (fragment.code.lastIndexOf("\n") + 1);
	        } else {
	          currentColumn += fragment.code.length;
	        }
	      }
	      js += fragment.code;
	    }
	    if (options.header) {
	      header = "Generated by CoffeeScript " + this.VERSION;
	      js = "// " + header + "\n" + js;
	    }
	    if (generateSourceMap) {
	      v3SourceMap = map.generate(options, code);
	      sourceMaps[filename] = map;
	    }
	    if (options.inlineMap) {
	      encoded = base64encode(JSON.stringify(v3SourceMap));
	      sourceMapDataURI = "//# sourceMappingURL=data:application/json;base64," + encoded;
	      sourceURL = "//# sourceURL=" + ((ref1 = options.filename) != null ? ref1 : 'coffeescript');
	      js = js + "\n" + sourceMapDataURI + "\n" + sourceURL;
	    }
	    if (options.sourceMap) {
	      return {
	        js: js,
	        sourceMap: map,
	        v3SourceMap: JSON.stringify(v3SourceMap, null, 2)
	      };
	    } else {
	      return js;
	    }
	  });

	  exports.tokens = withPrettyErrors(function(code, options) {
	    return lexer.tokenize(code, options);
	  });

	  exports.nodes = withPrettyErrors(function(source, options) {
	    if (typeof source === 'string') {
	      return parser.parse(lexer.tokenize(source, options));
	    } else {
	      return parser.parse(source);
	    }
	  });

	  exports.run = function(code, options) {
	    var answer, dir, mainModule, ref;
	    if (options == null) {
	      options = {};
	    }
	    mainModule = __webpack_require__.c[0];
	    mainModule.filename = process.argv[1] = options.filename ? fs.realpathSync(options.filename) : '<anonymous>';
	    mainModule.moduleCache && (mainModule.moduleCache = {});
	    dir = options.filename != null ? path.dirname(fs.realpathSync(options.filename)) : fs.realpathSync('.');
	    mainModule.paths = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))._nodeModulePaths(dir);
	    if (!helpers.isCoffee(mainModule.filename) || (void 0)) {
	      answer = compile(code, options);
	      code = (ref = answer.js) != null ? ref : answer;
	    }
	    return mainModule._compile(code, mainModule.filename);
	  };

	  exports["eval"] = function(code, options) {
	    var Module, _module, _require, createContext, i, isContext, js, k, len, o, r, ref, ref1, ref2, ref3, sandbox, v;
	    if (options == null) {
	      options = {};
	    }
	    if (!(code = code.trim())) {
	      return;
	    }
	    createContext = (ref = vm.Script.createContext) != null ? ref : vm.createContext;
	    isContext = (ref1 = vm.isContext) != null ? ref1 : function(ctx) {
	      return options.sandbox instanceof createContext().constructor;
	    };
	    if (createContext) {
	      if (options.sandbox != null) {
	        if (isContext(options.sandbox)) {
	          sandbox = options.sandbox;
	        } else {
	          sandbox = createContext();
	          ref2 = options.sandbox;
	          for (k in ref2) {
	            if (!hasProp.call(ref2, k)) continue;
	            v = ref2[k];
	            sandbox[k] = v;
	          }
	        }
	        sandbox.global = sandbox.root = sandbox.GLOBAL = sandbox;
	      } else {
	        sandbox = global;
	      }
	      sandbox.__filename = options.filename || 'eval';
	      sandbox.__dirname = path.dirname(sandbox.__filename);
	      if (!(sandbox !== global || sandbox.module || sandbox.require)) {
	        Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	        sandbox.module = _module = new Module(options.modulename || 'eval');
	        sandbox.require = _require = function(path) {
	          return Module._load(path, _module, true);
	        };
	        _module.filename = sandbox.__filename;
	        ref3 = Object.getOwnPropertyNames(__webpack_require__(177));
	        for (i = 0, len = ref3.length; i < len; i++) {
	          r = ref3[i];
	          if (r !== 'paths' && r !== 'arguments' && r !== 'caller') {
	            _require[r] = __webpack_require__(177)[r];
	          }
	        }
	        _require.paths = _module.paths = Module._nodeModulePaths(process.cwd());
	        _require.resolve = function(request) {
	          return Module._resolveFilename(request, _module);
	        };
	      }
	    }
	    o = {};
	    for (k in options) {
	      if (!hasProp.call(options, k)) continue;
	      v = options[k];
	      o[k] = v;
	    }
	    o.bare = true;
	    js = compile(code, o);
	    if (sandbox === global) {
	      return vm.runInThisContext(js);
	    } else {
	      return vm.runInContext(js, sandbox);
	    }
	  };

	  exports.register = function() {
	    return __webpack_require__(187);
	  };

	  if ((void 0)) {
	    ref = this.FILE_EXTENSIONS;
	    fn1 = function(ext) {
	      var base;
	      return (base = (void 0))[ext] != null ? base[ext] : base[ext] = function() {
	        throw new Error("Use CoffeeScript.register() or require the coffee-script/register module to require " + ext + " files.");
	      };
	    };
	    for (i = 0, len = ref.length; i < len; i++) {
	      ext = ref[i];
	      fn1(ext);
	    }
	  }

	  exports._compileFile = function(filename, sourceMap, inlineMap) {
	    var answer, err, raw, stripped;
	    if (sourceMap == null) {
	      sourceMap = false;
	    }
	    if (inlineMap == null) {
	      inlineMap = false;
	    }
	    raw = fs.readFileSync(filename, 'utf8');
	    stripped = raw.charCodeAt(0) === 0xFEFF ? raw.substring(1) : raw;
	    try {
	      answer = compile(stripped, {
	        filename: filename,
	        sourceMap: sourceMap,
	        inlineMap: inlineMap,
	        sourceFiles: [filename],
	        literate: helpers.isLiterate(filename)
	      });
	    } catch (error) {
	      err = error;
	      throw helpers.updateSyntaxError(err, stripped, filename);
	    }
	    return answer;
	  };

	  lexer = new Lexer;

	  parser.lexer = {
	    lex: function() {
	      var tag, token;
	      token = parser.tokens[this.pos++];
	      if (token) {
	        tag = token[0], this.yytext = token[1], this.yylloc = token[2];
	        parser.errorToken = token.origin || token;
	        this.yylineno = this.yylloc.first_line;
	      } else {
	        tag = '';
	      }
	      return tag;
	    },
	    setInput: function(tokens) {
	      parser.tokens = tokens;
	      return this.pos = 0;
	    },
	    upcomingInput: function() {
	      return "";
	    }
	  };

	  parser.yy = __webpack_require__(183);

	  parser.yy.parseError = function(message, arg) {
	    var errorLoc, errorTag, errorText, errorToken, token, tokens;
	    token = arg.token;
	    errorToken = parser.errorToken, tokens = parser.tokens;
	    errorTag = errorToken[0], errorText = errorToken[1], errorLoc = errorToken[2];
	    errorText = (function() {
	      switch (false) {
	        case errorToken !== tokens[tokens.length - 1]:
	          return 'end of input';
	        case errorTag !== 'INDENT' && errorTag !== 'OUTDENT':
	          return 'indentation';
	        case errorTag !== 'IDENTIFIER' && errorTag !== 'NUMBER' && errorTag !== 'INFINITY' && errorTag !== 'STRING' && errorTag !== 'STRING_START' && errorTag !== 'REGEX' && errorTag !== 'REGEX_START':
	          return errorTag.replace(/_START$/, '').toLowerCase();
	        default:
	          return helpers.nameWhitespaceCharacter(errorText);
	      }
	    })();
	    return helpers.throwSyntaxError("unexpected " + errorText, errorLoc);
	  };

	  formatSourcePosition = function(frame, getSourceMapping) {
	    var as, column, fileLocation, filename, functionName, isConstructor, isMethodCall, line, methodName, source, tp, typeName;
	    filename = void 0;
	    fileLocation = '';
	    if (frame.isNative()) {
	      fileLocation = "native";
	    } else {
	      if (frame.isEval()) {
	        filename = frame.getScriptNameOrSourceURL();
	        if (!filename) {
	          fileLocation = (frame.getEvalOrigin()) + ", ";
	        }
	      } else {
	        filename = frame.getFileName();
	      }
	      filename || (filename = "<anonymous>");
	      line = frame.getLineNumber();
	      column = frame.getColumnNumber();
	      source = getSourceMapping(filename, line, column);
	      fileLocation = source ? filename + ":" + source[0] + ":" + source[1] : filename + ":" + line + ":" + column;
	    }
	    functionName = frame.getFunctionName();
	    isConstructor = frame.isConstructor();
	    isMethodCall = !(frame.isToplevel() || isConstructor);
	    if (isMethodCall) {
	      methodName = frame.getMethodName();
	      typeName = frame.getTypeName();
	      if (functionName) {
	        tp = as = '';
	        if (typeName && functionName.indexOf(typeName)) {
	          tp = typeName + ".";
	        }
	        if (methodName && functionName.indexOf("." + methodName) !== functionName.length - methodName.length - 1) {
	          as = " [as " + methodName + "]";
	        }
	        return "" + tp + functionName + as + " (" + fileLocation + ")";
	      } else {
	        return typeName + "." + (methodName || '<anonymous>') + " (" + fileLocation + ")";
	      }
	    } else if (isConstructor) {
	      return "new " + (functionName || '<anonymous>') + " (" + fileLocation + ")";
	    } else if (functionName) {
	      return functionName + " (" + fileLocation + ")";
	    } else {
	      return fileLocation;
	    }
	  };

	  getSourceMap = function(filename) {
	    var answer;
	    if (sourceMaps[filename] != null) {
	      return sourceMaps[filename];
	    } else if (sourceMaps['<anonymous>'] != null) {
	      return sourceMaps['<anonymous>'];
	    } else if (sources[filename] != null) {
	      answer = compile(sources[filename], {
	        filename: filename,
	        sourceMap: true,
	        literate: helpers.isLiterate(filename)
	      });
	      return answer.sourceMap;
	    } else {
	      return null;
	    }
	  };

	  Error.prepareStackTrace = function(err, stack) {
	    var frame, frames, getSourceMapping;
	    getSourceMapping = function(filename, line, column) {
	      var answer, sourceMap;
	      sourceMap = getSourceMap(filename);
	      if (sourceMap != null) {
	        answer = sourceMap.sourceLocation([line - 1, column - 1]);
	      }
	      if (answer != null) {
	        return [answer[0] + 1, answer[1] + 1];
	      } else {
	        return null;
	      }
	    };
	    frames = (function() {
	      var j, len1, results;
	      results = [];
	      for (j = 0, len1 = stack.length; j < len1; j++) {
	        frame = stack[j];
	        if (frame.getFunction() === exports.run) {
	          break;
	        }
	        results.push("    at " + (formatSourcePosition(frame, getSourceMapping)));
	      }
	      return results;
	    })();
	    return (err.toString()) + "\n" + (frames.join('\n')) + "\n";
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(75).Buffer, __webpack_require__(4), (function() { return this; }())))

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(170);

	var Object_keys = function (obj) {
	    if (Object.keys) return Object.keys(obj)
	    else {
	        var res = [];
	        for (var key in obj) res.push(key)
	        return res;
	    }
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	var defineProp = (function() {
	    try {
	        Object.defineProperty({}, '_', {});
	        return function(obj, name, value) {
	            Object.defineProperty(obj, name, {
	                writable: true,
	                enumerable: false,
	                configurable: true,
	                value: value
	            })
	        };
	    } catch(e) {
	        return function(obj, name, value) {
	            obj[name] = value;
	        };
	    }
	}());

	var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
	'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
	'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
	'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
	'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

	function Context() {}
	Context.prototype = {};

	var Script = exports.Script = function NodeScript (code) {
	    if (!(this instanceof Script)) return new Script(code);
	    this.code = code;
	};

	Script.prototype.runInContext = function (context) {
	    if (!(context instanceof Context)) {
	        throw new TypeError("needs a 'context' argument.");
	    }
	    
	    var iframe = document.createElement('iframe');
	    if (!iframe.style) iframe.style = {};
	    iframe.style.display = 'none';
	    
	    document.body.appendChild(iframe);
	    
	    var win = iframe.contentWindow;
	    var wEval = win.eval, wExecScript = win.execScript;

	    if (!wEval && wExecScript) {
	        // win.eval() magically appears when this is called in IE:
	        wExecScript.call(win, 'null');
	        wEval = win.eval;
	    }
	    
	    forEach(Object_keys(context), function (key) {
	        win[key] = context[key];
	    });
	    forEach(globals, function (key) {
	        if (context[key]) {
	            win[key] = context[key];
	        }
	    });
	    
	    var winKeys = Object_keys(win);

	    var res = wEval.call(win, this.code);
	    
	    forEach(Object_keys(win), function (key) {
	        // Avoid copying circular objects like `top` and `window` by only
	        // updating existing context properties or new properties in the `win`
	        // that was only introduced after the eval.
	        if (key in context || indexOf(winKeys, key) === -1) {
	            context[key] = win[key];
	        }
	    });

	    forEach(globals, function (key) {
	        if (!(key in context)) {
	            defineProp(context, key, win[key]);
	        }
	    });
	    
	    document.body.removeChild(iframe);
	    
	    return res;
	};

	Script.prototype.runInThisContext = function () {
	    return eval(this.code); // maybe...
	};

	Script.prototype.runInNewContext = function (context) {
	    var ctx = Script.createContext(context);
	    var res = this.runInContext(ctx);

	    forEach(Object_keys(ctx), function (key) {
	        context[key] = ctx[key];
	    });

	    return res;
	};

	forEach(Object_keys(Script.prototype), function (name) {
	    exports[name] = Script[name] = function (code) {
	        var s = Script(code);
	        return s[name].apply(s, [].slice.call(arguments, 1));
	    };
	});

	exports.createScript = function (code) {
	    return exports.Script(code);
	};

	exports.createContext = Script.createContext = function (context) {
	    var copy = new Context();
	    if(typeof context === 'object') {
	        forEach(Object_keys(context), function (key) {
	            copy[key] = context[key];
	        });
	    }
	    return copy;
	};


/***/ }),
/* 170 */
/***/ (function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var BOM, BOOL, CALLABLE, CODE, COFFEE_ALIASES, COFFEE_ALIAS_MAP, COFFEE_KEYWORDS, COMMENT, COMPARE, COMPOUND_ASSIGN, HERECOMMENT_ILLEGAL, HEREDOC_DOUBLE, HEREDOC_INDENT, HEREDOC_SINGLE, HEREGEX, HEREGEX_OMIT, HERE_JSTOKEN, IDENTIFIER, INDENTABLE_CLOSERS, INDEXABLE, INVERSES, JSTOKEN, JS_KEYWORDS, LEADING_BLANK_LINE, LINE_BREAK, LINE_CONTINUER, Lexer, MATH, MULTI_DENT, NOT_REGEX, NUMBER, OPERATOR, POSSIBLY_DIVISION, REGEX, REGEX_FLAGS, REGEX_ILLEGAL, REGEX_INVALID_ESCAPE, RELATION, RESERVED, Rewriter, SHIFT, SIMPLE_STRING_OMIT, STRICT_PROSCRIBED, STRING_DOUBLE, STRING_INVALID_ESCAPE, STRING_OMIT, STRING_SINGLE, STRING_START, TRAILING_BLANK_LINE, TRAILING_SPACES, UNARY, UNARY_MATH, UNFINISHED, UNICODE_CODE_POINT_ESCAPE, VALID_FLAGS, WHITESPACE, compact, count, invertLiterate, isForFrom, isUnassignable, key, locationDataToString, ref, ref1, repeat, starts, throwSyntaxError,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    slice = [].slice;

	  ref = __webpack_require__(172), Rewriter = ref.Rewriter, INVERSES = ref.INVERSES;

	  ref1 = __webpack_require__(173), count = ref1.count, starts = ref1.starts, compact = ref1.compact, repeat = ref1.repeat, invertLiterate = ref1.invertLiterate, locationDataToString = ref1.locationDataToString, throwSyntaxError = ref1.throwSyntaxError;

	  exports.Lexer = Lexer = (function() {
	    function Lexer() {}

	    Lexer.prototype.tokenize = function(code, opts) {
	      var consumed, end, i, ref2;
	      if (opts == null) {
	        opts = {};
	      }
	      this.literate = opts.literate;
	      this.indent = 0;
	      this.baseIndent = 0;
	      this.indebt = 0;
	      this.outdebt = 0;
	      this.indents = [];
	      this.ends = [];
	      this.tokens = [];
	      this.seenFor = false;
	      this.seenImport = false;
	      this.seenExport = false;
	      this.importSpecifierList = false;
	      this.exportSpecifierList = false;
	      this.chunkLine = opts.line || 0;
	      this.chunkColumn = opts.column || 0;
	      code = this.clean(code);
	      i = 0;
	      while (this.chunk = code.slice(i)) {
	        consumed = this.identifierToken() || this.commentToken() || this.whitespaceToken() || this.lineToken() || this.stringToken() || this.numberToken() || this.regexToken() || this.jsToken() || this.literalToken();
	        ref2 = this.getLineAndColumnFromChunk(consumed), this.chunkLine = ref2[0], this.chunkColumn = ref2[1];
	        i += consumed;
	        if (opts.untilBalanced && this.ends.length === 0) {
	          return {
	            tokens: this.tokens,
	            index: i
	          };
	        }
	      }
	      this.closeIndentation();
	      if (end = this.ends.pop()) {
	        this.error("missing " + end.tag, end.origin[2]);
	      }
	      if (opts.rewrite === false) {
	        return this.tokens;
	      }
	      return (new Rewriter).rewrite(this.tokens);
	    };

	    Lexer.prototype.clean = function(code) {
	      if (code.charCodeAt(0) === BOM) {
	        code = code.slice(1);
	      }
	      code = code.replace(/\r/g, '').replace(TRAILING_SPACES, '');
	      if (WHITESPACE.test(code)) {
	        code = "\n" + code;
	        this.chunkLine--;
	      }
	      if (this.literate) {
	        code = invertLiterate(code);
	      }
	      return code;
	    };

	    Lexer.prototype.identifierToken = function() {
	      var alias, colon, colonOffset, id, idLength, input, match, poppedToken, prev, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, tag, tagToken;
	      if (!(match = IDENTIFIER.exec(this.chunk))) {
	        return 0;
	      }
	      input = match[0], id = match[1], colon = match[2];
	      idLength = id.length;
	      poppedToken = void 0;
	      if (id === 'own' && this.tag() === 'FOR') {
	        this.token('OWN', id);
	        return id.length;
	      }
	      if (id === 'from' && this.tag() === 'YIELD') {
	        this.token('FROM', id);
	        return id.length;
	      }
	      if (id === 'as' && this.seenImport) {
	        if (this.value() === '*') {
	          this.tokens[this.tokens.length - 1][0] = 'IMPORT_ALL';
	        } else if (ref2 = this.value(), indexOf.call(COFFEE_KEYWORDS, ref2) >= 0) {
	          this.tokens[this.tokens.length - 1][0] = 'IDENTIFIER';
	        }
	        if ((ref3 = this.tag()) === 'DEFAULT' || ref3 === 'IMPORT_ALL' || ref3 === 'IDENTIFIER') {
	          this.token('AS', id);
	          return id.length;
	        }
	      }
	      if (id === 'as' && this.seenExport && ((ref4 = this.tag()) === 'IDENTIFIER' || ref4 === 'DEFAULT')) {
	        this.token('AS', id);
	        return id.length;
	      }
	      if (id === 'default' && this.seenExport && ((ref5 = this.tag()) === 'EXPORT' || ref5 === 'AS')) {
	        this.token('DEFAULT', id);
	        return id.length;
	      }
	      ref6 = this.tokens, prev = ref6[ref6.length - 1];
	      tag = colon || (prev != null) && (((ref7 = prev[0]) === '.' || ref7 === '?.' || ref7 === '::' || ref7 === '?::') || !prev.spaced && prev[0] === '@') ? 'PROPERTY' : 'IDENTIFIER';
	      if (tag === 'IDENTIFIER' && (indexOf.call(JS_KEYWORDS, id) >= 0 || indexOf.call(COFFEE_KEYWORDS, id) >= 0) && !(this.exportSpecifierList && indexOf.call(COFFEE_KEYWORDS, id) >= 0)) {
	        tag = id.toUpperCase();
	        if (tag === 'WHEN' && (ref8 = this.tag(), indexOf.call(LINE_BREAK, ref8) >= 0)) {
	          tag = 'LEADING_WHEN';
	        } else if (tag === 'FOR') {
	          this.seenFor = true;
	        } else if (tag === 'UNLESS') {
	          tag = 'IF';
	        } else if (tag === 'IMPORT') {
	          this.seenImport = true;
	        } else if (tag === 'EXPORT') {
	          this.seenExport = true;
	        } else if (indexOf.call(UNARY, tag) >= 0) {
	          tag = 'UNARY';
	        } else if (indexOf.call(RELATION, tag) >= 0) {
	          if (tag !== 'INSTANCEOF' && this.seenFor) {
	            tag = 'FOR' + tag;
	            this.seenFor = false;
	          } else {
	            tag = 'RELATION';
	            if (this.value() === '!') {
	              poppedToken = this.tokens.pop();
	              id = '!' + id;
	            }
	          }
	        }
	      } else if (tag === 'IDENTIFIER' && this.seenFor && id === 'from' && isForFrom(prev)) {
	        tag = 'FORFROM';
	        this.seenFor = false;
	      }
	      if (tag === 'IDENTIFIER' && indexOf.call(RESERVED, id) >= 0) {
	        this.error("reserved word '" + id + "'", {
	          length: id.length
	        });
	      }
	      if (tag !== 'PROPERTY') {
	        if (indexOf.call(COFFEE_ALIASES, id) >= 0) {
	          alias = id;
	          id = COFFEE_ALIAS_MAP[id];
	        }
	        tag = (function() {
	          switch (id) {
	            case '!':
	              return 'UNARY';
	            case '==':
	            case '!=':
	              return 'COMPARE';
	            case 'true':
	            case 'false':
	              return 'BOOL';
	            case 'break':
	            case 'continue':
	            case 'debugger':
	              return 'STATEMENT';
	            case '&&':
	            case '||':
	              return id;
	            default:
	              return tag;
	          }
	        })();
	      }
	      tagToken = this.token(tag, id, 0, idLength);
	      if (alias) {
	        tagToken.origin = [tag, alias, tagToken[2]];
	      }
	      if (poppedToken) {
	        ref9 = [poppedToken[2].first_line, poppedToken[2].first_column], tagToken[2].first_line = ref9[0], tagToken[2].first_column = ref9[1];
	      }
	      if (colon) {
	        colonOffset = input.lastIndexOf(':');
	        this.token(':', ':', colonOffset, colon.length);
	      }
	      return input.length;
	    };

	    Lexer.prototype.numberToken = function() {
	      var base, lexedLength, match, number, numberValue, ref2, tag;
	      if (!(match = NUMBER.exec(this.chunk))) {
	        return 0;
	      }
	      number = match[0];
	      lexedLength = number.length;
	      switch (false) {
	        case !/^0[BOX]/.test(number):
	          this.error("radix prefix in '" + number + "' must be lowercase", {
	            offset: 1
	          });
	          break;
	        case !/^(?!0x).*E/.test(number):
	          this.error("exponential notation in '" + number + "' must be indicated with a lowercase 'e'", {
	            offset: number.indexOf('E')
	          });
	          break;
	        case !/^0\d*[89]/.test(number):
	          this.error("decimal literal '" + number + "' must not be prefixed with '0'", {
	            length: lexedLength
	          });
	          break;
	        case !/^0\d+/.test(number):
	          this.error("octal literal '" + number + "' must be prefixed with '0o'", {
	            length: lexedLength
	          });
	      }
	      base = (function() {
	        switch (number.charAt(1)) {
	          case 'b':
	            return 2;
	          case 'o':
	            return 8;
	          case 'x':
	            return 16;
	          default:
	            return null;
	        }
	      })();
	      numberValue = base != null ? parseInt(number.slice(2), base) : parseFloat(number);
	      if ((ref2 = number.charAt(1)) === 'b' || ref2 === 'o') {
	        number = "0x" + (numberValue.toString(16));
	      }
	      tag = numberValue === 2e308 ? 'INFINITY' : 'NUMBER';
	      this.token(tag, number, 0, lexedLength);
	      return lexedLength;
	    };

	    Lexer.prototype.stringToken = function() {
	      var $, attempt, delimiter, doc, end, heredoc, i, indent, indentRegex, match, quote, ref2, ref3, regex, token, tokens;
	      quote = (STRING_START.exec(this.chunk) || [])[0];
	      if (!quote) {
	        return 0;
	      }
	      if (this.tokens.length && this.value() === 'from' && (this.seenImport || this.seenExport)) {
	        this.tokens[this.tokens.length - 1][0] = 'FROM';
	      }
	      regex = (function() {
	        switch (quote) {
	          case "'":
	            return STRING_SINGLE;
	          case '"':
	            return STRING_DOUBLE;
	          case "'''":
	            return HEREDOC_SINGLE;
	          case '"""':
	            return HEREDOC_DOUBLE;
	        }
	      })();
	      heredoc = quote.length === 3;
	      ref2 = this.matchWithInterpolations(regex, quote), tokens = ref2.tokens, end = ref2.index;
	      $ = tokens.length - 1;
	      delimiter = quote.charAt(0);
	      if (heredoc) {
	        indent = null;
	        doc = ((function() {
	          var j, len, results;
	          results = [];
	          for (i = j = 0, len = tokens.length; j < len; i = ++j) {
	            token = tokens[i];
	            if (token[0] === 'NEOSTRING') {
	              results.push(token[1]);
	            }
	          }
	          return results;
	        })()).join('#{}');
	        while (match = HEREDOC_INDENT.exec(doc)) {
	          attempt = match[1];
	          if (indent === null || (0 < (ref3 = attempt.length) && ref3 < indent.length)) {
	            indent = attempt;
	          }
	        }
	        if (indent) {
	          indentRegex = RegExp("\\n" + indent, "g");
	        }
	        this.mergeInterpolationTokens(tokens, {
	          delimiter: delimiter
	        }, (function(_this) {
	          return function(value, i) {
	            value = _this.formatString(value, {
	              delimiter: quote
	            });
	            if (indentRegex) {
	              value = value.replace(indentRegex, '\n');
	            }
	            if (i === 0) {
	              value = value.replace(LEADING_BLANK_LINE, '');
	            }
	            if (i === $) {
	              value = value.replace(TRAILING_BLANK_LINE, '');
	            }
	            return value;
	          };
	        })(this));
	      } else {
	        this.mergeInterpolationTokens(tokens, {
	          delimiter: delimiter
	        }, (function(_this) {
	          return function(value, i) {
	            value = _this.formatString(value, {
	              delimiter: quote
	            });
	            value = value.replace(SIMPLE_STRING_OMIT, function(match, offset) {
	              if ((i === 0 && offset === 0) || (i === $ && offset + match.length === value.length)) {
	                return '';
	              } else {
	                return ' ';
	              }
	            });
	            return value;
	          };
	        })(this));
	      }
	      return end;
	    };

	    Lexer.prototype.commentToken = function() {
	      var comment, here, match;
	      if (!(match = this.chunk.match(COMMENT))) {
	        return 0;
	      }
	      comment = match[0], here = match[1];
	      if (here) {
	        if (match = HERECOMMENT_ILLEGAL.exec(comment)) {
	          this.error("block comments cannot contain " + match[0], {
	            offset: match.index,
	            length: match[0].length
	          });
	        }
	        if (here.indexOf('\n') >= 0) {
	          here = here.replace(RegExp("\\n" + (repeat(' ', this.indent)), "g"), '\n');
	        }
	        this.token('HERECOMMENT', here, 0, comment.length);
	      }
	      return comment.length;
	    };

	    Lexer.prototype.jsToken = function() {
	      var match, script;
	      if (!(this.chunk.charAt(0) === '`' && (match = HERE_JSTOKEN.exec(this.chunk) || JSTOKEN.exec(this.chunk)))) {
	        return 0;
	      }
	      script = match[1].replace(/\\+(`|$)/g, function(string) {
	        return string.slice(-Math.ceil(string.length / 2));
	      });
	      this.token('JS', script, 0, match[0].length);
	      return match[0].length;
	    };

	    Lexer.prototype.regexToken = function() {
	      var body, closed, end, flags, index, match, origin, prev, ref2, ref3, ref4, regex, tokens;
	      switch (false) {
	        case !(match = REGEX_ILLEGAL.exec(this.chunk)):
	          this.error("regular expressions cannot begin with " + match[2], {
	            offset: match.index + match[1].length
	          });
	          break;
	        case !(match = this.matchWithInterpolations(HEREGEX, '///')):
	          tokens = match.tokens, index = match.index;
	          break;
	        case !(match = REGEX.exec(this.chunk)):
	          regex = match[0], body = match[1], closed = match[2];
	          this.validateEscapes(body, {
	            isRegex: true,
	            offsetInChunk: 1
	          });
	          body = this.formatRegex(body, {
	            delimiter: '/'
	          });
	          index = regex.length;
	          ref2 = this.tokens, prev = ref2[ref2.length - 1];
	          if (prev) {
	            if (prev.spaced && (ref3 = prev[0], indexOf.call(CALLABLE, ref3) >= 0)) {
	              if (!closed || POSSIBLY_DIVISION.test(regex)) {
	                return 0;
	              }
	            } else if (ref4 = prev[0], indexOf.call(NOT_REGEX, ref4) >= 0) {
	              return 0;
	            }
	          }
	          if (!closed) {
	            this.error('missing / (unclosed regex)');
	          }
	          break;
	        default:
	          return 0;
	      }
	      flags = REGEX_FLAGS.exec(this.chunk.slice(index))[0];
	      end = index + flags.length;
	      origin = this.makeToken('REGEX', null, 0, end);
	      switch (false) {
	        case !!VALID_FLAGS.test(flags):
	          this.error("invalid regular expression flags " + flags, {
	            offset: index,
	            length: flags.length
	          });
	          break;
	        case !(regex || tokens.length === 1):
	          if (body == null) {
	            body = this.formatHeregex(tokens[0][1]);
	          }
	          this.token('REGEX', "" + (this.makeDelimitedLiteral(body, {
	            delimiter: '/'
	          })) + flags, 0, end, origin);
	          break;
	        default:
	          this.token('REGEX_START', '(', 0, 0, origin);
	          this.token('IDENTIFIER', 'RegExp', 0, 0);
	          this.token('CALL_START', '(', 0, 0);
	          this.mergeInterpolationTokens(tokens, {
	            delimiter: '"',
	            double: true
	          }, this.formatHeregex);
	          if (flags) {
	            this.token(',', ',', index - 1, 0);
	            this.token('STRING', '"' + flags + '"', index - 1, flags.length);
	          }
	          this.token(')', ')', end - 1, 0);
	          this.token('REGEX_END', ')', end - 1, 0);
	      }
	      return end;
	    };

	    Lexer.prototype.lineToken = function() {
	      var diff, indent, match, noNewlines, size;
	      if (!(match = MULTI_DENT.exec(this.chunk))) {
	        return 0;
	      }
	      indent = match[0];
	      this.seenFor = false;
	      if (!this.importSpecifierList) {
	        this.seenImport = false;
	      }
	      if (!this.exportSpecifierList) {
	        this.seenExport = false;
	      }
	      size = indent.length - 1 - indent.lastIndexOf('\n');
	      noNewlines = this.unfinished();
	      if (size - this.indebt === this.indent) {
	        if (noNewlines) {
	          this.suppressNewlines();
	        } else {
	          this.newlineToken(0);
	        }
	        return indent.length;
	      }
	      if (size > this.indent) {
	        if (noNewlines) {
	          this.indebt = size - this.indent;
	          this.suppressNewlines();
	          return indent.length;
	        }
	        if (!this.tokens.length) {
	          this.baseIndent = this.indent = size;
	          return indent.length;
	        }
	        diff = size - this.indent + this.outdebt;
	        this.token('INDENT', diff, indent.length - size, size);
	        this.indents.push(diff);
	        this.ends.push({
	          tag: 'OUTDENT'
	        });
	        this.outdebt = this.indebt = 0;
	        this.indent = size;
	      } else if (size < this.baseIndent) {
	        this.error('missing indentation', {
	          offset: indent.length
	        });
	      } else {
	        this.indebt = 0;
	        this.outdentToken(this.indent - size, noNewlines, indent.length);
	      }
	      return indent.length;
	    };

	    Lexer.prototype.outdentToken = function(moveOut, noNewlines, outdentLength) {
	      var decreasedIndent, dent, lastIndent, ref2;
	      decreasedIndent = this.indent - moveOut;
	      while (moveOut > 0) {
	        lastIndent = this.indents[this.indents.length - 1];
	        if (!lastIndent) {
	          moveOut = 0;
	        } else if (lastIndent === this.outdebt) {
	          moveOut -= this.outdebt;
	          this.outdebt = 0;
	        } else if (lastIndent < this.outdebt) {
	          this.outdebt -= lastIndent;
	          moveOut -= lastIndent;
	        } else {
	          dent = this.indents.pop() + this.outdebt;
	          if (outdentLength && (ref2 = this.chunk[outdentLength], indexOf.call(INDENTABLE_CLOSERS, ref2) >= 0)) {
	            decreasedIndent -= dent - moveOut;
	            moveOut = dent;
	          }
	          this.outdebt = 0;
	          this.pair('OUTDENT');
	          this.token('OUTDENT', moveOut, 0, outdentLength);
	          moveOut -= dent;
	        }
	      }
	      if (dent) {
	        this.outdebt -= moveOut;
	      }
	      while (this.value() === ';') {
	        this.tokens.pop();
	      }
	      if (!(this.tag() === 'TERMINATOR' || noNewlines)) {
	        this.token('TERMINATOR', '\n', outdentLength, 0);
	      }
	      this.indent = decreasedIndent;
	      return this;
	    };

	    Lexer.prototype.whitespaceToken = function() {
	      var match, nline, prev, ref2;
	      if (!((match = WHITESPACE.exec(this.chunk)) || (nline = this.chunk.charAt(0) === '\n'))) {
	        return 0;
	      }
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      if (prev) {
	        prev[match ? 'spaced' : 'newLine'] = true;
	      }
	      if (match) {
	        return match[0].length;
	      } else {
	        return 0;
	      }
	    };

	    Lexer.prototype.newlineToken = function(offset) {
	      while (this.value() === ';') {
	        this.tokens.pop();
	      }
	      if (this.tag() !== 'TERMINATOR') {
	        this.token('TERMINATOR', '\n', offset, 0);
	      }
	      return this;
	    };

	    Lexer.prototype.suppressNewlines = function() {
	      if (this.value() === '\\') {
	        this.tokens.pop();
	      }
	      return this;
	    };

	    Lexer.prototype.literalToken = function() {
	      var match, message, origin, prev, ref2, ref3, ref4, ref5, ref6, skipToken, tag, token, value;
	      if (match = OPERATOR.exec(this.chunk)) {
	        value = match[0];
	        if (CODE.test(value)) {
	          this.tagParameters();
	        }
	      } else {
	        value = this.chunk.charAt(0);
	      }
	      tag = value;
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      if (prev && indexOf.call(['='].concat(slice.call(COMPOUND_ASSIGN)), value) >= 0) {
	        skipToken = false;
	        if (value === '=' && ((ref3 = prev[1]) === '||' || ref3 === '&&') && !prev.spaced) {
	          prev[0] = 'COMPOUND_ASSIGN';
	          prev[1] += '=';
	          prev = this.tokens[this.tokens.length - 2];
	          skipToken = true;
	        }
	        if (prev && prev[0] !== 'PROPERTY') {
	          origin = (ref4 = prev.origin) != null ? ref4 : prev;
	          message = isUnassignable(prev[1], origin[1]);
	          if (message) {
	            this.error(message, origin[2]);
	          }
	        }
	        if (skipToken) {
	          return value.length;
	        }
	      }
	      if (value === '{' && this.seenImport) {
	        this.importSpecifierList = true;
	      } else if (this.importSpecifierList && value === '}') {
	        this.importSpecifierList = false;
	      } else if (value === '{' && (prev != null ? prev[0] : void 0) === 'EXPORT') {
	        this.exportSpecifierList = true;
	      } else if (this.exportSpecifierList && value === '}') {
	        this.exportSpecifierList = false;
	      }
	      if (value === ';') {
	        this.seenFor = this.seenImport = this.seenExport = false;
	        tag = 'TERMINATOR';
	      } else if (value === '*' && prev[0] === 'EXPORT') {
	        tag = 'EXPORT_ALL';
	      } else if (indexOf.call(MATH, value) >= 0) {
	        tag = 'MATH';
	      } else if (indexOf.call(COMPARE, value) >= 0) {
	        tag = 'COMPARE';
	      } else if (indexOf.call(COMPOUND_ASSIGN, value) >= 0) {
	        tag = 'COMPOUND_ASSIGN';
	      } else if (indexOf.call(UNARY, value) >= 0) {
	        tag = 'UNARY';
	      } else if (indexOf.call(UNARY_MATH, value) >= 0) {
	        tag = 'UNARY_MATH';
	      } else if (indexOf.call(SHIFT, value) >= 0) {
	        tag = 'SHIFT';
	      } else if (value === '?' && (prev != null ? prev.spaced : void 0)) {
	        tag = 'BIN?';
	      } else if (prev && !prev.spaced) {
	        if (value === '(' && (ref5 = prev[0], indexOf.call(CALLABLE, ref5) >= 0)) {
	          if (prev[0] === '?') {
	            prev[0] = 'FUNC_EXIST';
	          }
	          tag = 'CALL_START';
	        } else if (value === '[' && (ref6 = prev[0], indexOf.call(INDEXABLE, ref6) >= 0)) {
	          tag = 'INDEX_START';
	          switch (prev[0]) {
	            case '?':
	              prev[0] = 'INDEX_SOAK';
	          }
	        }
	      }
	      token = this.makeToken(tag, value);
	      switch (value) {
	        case '(':
	        case '{':
	        case '[':
	          this.ends.push({
	            tag: INVERSES[value],
	            origin: token
	          });
	          break;
	        case ')':
	        case '}':
	        case ']':
	          this.pair(value);
	      }
	      this.tokens.push(token);
	      return value.length;
	    };

	    Lexer.prototype.tagParameters = function() {
	      var i, stack, tok, tokens;
	      if (this.tag() !== ')') {
	        return this;
	      }
	      stack = [];
	      tokens = this.tokens;
	      i = tokens.length;
	      tokens[--i][0] = 'PARAM_END';
	      while (tok = tokens[--i]) {
	        switch (tok[0]) {
	          case ')':
	            stack.push(tok);
	            break;
	          case '(':
	          case 'CALL_START':
	            if (stack.length) {
	              stack.pop();
	            } else if (tok[0] === '(') {
	              tok[0] = 'PARAM_START';
	              return this;
	            } else {
	              return this;
	            }
	        }
	      }
	      return this;
	    };

	    Lexer.prototype.closeIndentation = function() {
	      return this.outdentToken(this.indent);
	    };

	    Lexer.prototype.matchWithInterpolations = function(regex, delimiter) {
	      var close, column, firstToken, index, lastToken, line, nested, offsetInChunk, open, ref2, ref3, ref4, str, strPart, tokens;
	      tokens = [];
	      offsetInChunk = delimiter.length;
	      if (this.chunk.slice(0, offsetInChunk) !== delimiter) {
	        return null;
	      }
	      str = this.chunk.slice(offsetInChunk);
	      while (true) {
	        strPart = regex.exec(str)[0];
	        this.validateEscapes(strPart, {
	          isRegex: delimiter.charAt(0) === '/',
	          offsetInChunk: offsetInChunk
	        });
	        tokens.push(this.makeToken('NEOSTRING', strPart, offsetInChunk));
	        str = str.slice(strPart.length);
	        offsetInChunk += strPart.length;
	        if (str.slice(0, 2) !== '#{') {
	          break;
	        }
	        ref2 = this.getLineAndColumnFromChunk(offsetInChunk + 1), line = ref2[0], column = ref2[1];
	        ref3 = new Lexer().tokenize(str.slice(1), {
	          line: line,
	          column: column,
	          untilBalanced: true
	        }), nested = ref3.tokens, index = ref3.index;
	        index += 1;
	        open = nested[0], close = nested[nested.length - 1];
	        open[0] = open[1] = '(';
	        close[0] = close[1] = ')';
	        close.origin = ['', 'end of interpolation', close[2]];
	        if (((ref4 = nested[1]) != null ? ref4[0] : void 0) === 'TERMINATOR') {
	          nested.splice(1, 1);
	        }
	        tokens.push(['TOKENS', nested]);
	        str = str.slice(index);
	        offsetInChunk += index;
	      }
	      if (str.slice(0, delimiter.length) !== delimiter) {
	        this.error("missing " + delimiter, {
	          length: delimiter.length
	        });
	      }
	      firstToken = tokens[0], lastToken = tokens[tokens.length - 1];
	      firstToken[2].first_column -= delimiter.length;
	      if (lastToken[1].substr(-1) === '\n') {
	        lastToken[2].last_line += 1;
	        lastToken[2].last_column = delimiter.length - 1;
	      } else {
	        lastToken[2].last_column += delimiter.length;
	      }
	      if (lastToken[1].length === 0) {
	        lastToken[2].last_column -= 1;
	      }
	      return {
	        tokens: tokens,
	        index: offsetInChunk + delimiter.length
	      };
	    };

	    Lexer.prototype.mergeInterpolationTokens = function(tokens, options, fn) {
	      var converted, firstEmptyStringIndex, firstIndex, i, j, lastToken, len, locationToken, lparen, plusToken, ref2, rparen, tag, token, tokensToPush, value;
	      if (tokens.length > 1) {
	        lparen = this.token('STRING_START', '(', 0, 0);
	      }
	      firstIndex = this.tokens.length;
	      for (i = j = 0, len = tokens.length; j < len; i = ++j) {
	        token = tokens[i];
	        tag = token[0], value = token[1];
	        switch (tag) {
	          case 'TOKENS':
	            if (value.length === 2) {
	              continue;
	            }
	            locationToken = value[0];
	            tokensToPush = value;
	            break;
	          case 'NEOSTRING':
	            converted = fn.call(this, token[1], i);
	            if (converted.length === 0) {
	              if (i === 0) {
	                firstEmptyStringIndex = this.tokens.length;
	              } else {
	                continue;
	              }
	            }
	            if (i === 2 && (firstEmptyStringIndex != null)) {
	              this.tokens.splice(firstEmptyStringIndex, 2);
	            }
	            token[0] = 'STRING';
	            token[1] = this.makeDelimitedLiteral(converted, options);
	            locationToken = token;
	            tokensToPush = [token];
	        }
	        if (this.tokens.length > firstIndex) {
	          plusToken = this.token('+', '+');
	          plusToken[2] = {
	            first_line: locationToken[2].first_line,
	            first_column: locationToken[2].first_column,
	            last_line: locationToken[2].first_line,
	            last_column: locationToken[2].first_column
	          };
	        }
	        (ref2 = this.tokens).push.apply(ref2, tokensToPush);
	      }
	      if (lparen) {
	        lastToken = tokens[tokens.length - 1];
	        lparen.origin = [
	          'STRING', null, {
	            first_line: lparen[2].first_line,
	            first_column: lparen[2].first_column,
	            last_line: lastToken[2].last_line,
	            last_column: lastToken[2].last_column
	          }
	        ];
	        rparen = this.token('STRING_END', ')');
	        return rparen[2] = {
	          first_line: lastToken[2].last_line,
	          first_column: lastToken[2].last_column,
	          last_line: lastToken[2].last_line,
	          last_column: lastToken[2].last_column
	        };
	      }
	    };

	    Lexer.prototype.pair = function(tag) {
	      var lastIndent, prev, ref2, ref3, wanted;
	      ref2 = this.ends, prev = ref2[ref2.length - 1];
	      if (tag !== (wanted = prev != null ? prev.tag : void 0)) {
	        if ('OUTDENT' !== wanted) {
	          this.error("unmatched " + tag);
	        }
	        ref3 = this.indents, lastIndent = ref3[ref3.length - 1];
	        this.outdentToken(lastIndent, true);
	        return this.pair(tag);
	      }
	      return this.ends.pop();
	    };

	    Lexer.prototype.getLineAndColumnFromChunk = function(offset) {
	      var column, lastLine, lineCount, ref2, string;
	      if (offset === 0) {
	        return [this.chunkLine, this.chunkColumn];
	      }
	      if (offset >= this.chunk.length) {
	        string = this.chunk;
	      } else {
	        string = this.chunk.slice(0, +(offset - 1) + 1 || 9e9);
	      }
	      lineCount = count(string, '\n');
	      column = this.chunkColumn;
	      if (lineCount > 0) {
	        ref2 = string.split('\n'), lastLine = ref2[ref2.length - 1];
	        column = lastLine.length;
	      } else {
	        column += string.length;
	      }
	      return [this.chunkLine + lineCount, column];
	    };

	    Lexer.prototype.makeToken = function(tag, value, offsetInChunk, length) {
	      var lastCharacter, locationData, ref2, ref3, token;
	      if (offsetInChunk == null) {
	        offsetInChunk = 0;
	      }
	      if (length == null) {
	        length = value.length;
	      }
	      locationData = {};
	      ref2 = this.getLineAndColumnFromChunk(offsetInChunk), locationData.first_line = ref2[0], locationData.first_column = ref2[1];
	      lastCharacter = length > 0 ? length - 1 : 0;
	      ref3 = this.getLineAndColumnFromChunk(offsetInChunk + lastCharacter), locationData.last_line = ref3[0], locationData.last_column = ref3[1];
	      token = [tag, value, locationData];
	      return token;
	    };

	    Lexer.prototype.token = function(tag, value, offsetInChunk, length, origin) {
	      var token;
	      token = this.makeToken(tag, value, offsetInChunk, length);
	      if (origin) {
	        token.origin = origin;
	      }
	      this.tokens.push(token);
	      return token;
	    };

	    Lexer.prototype.tag = function() {
	      var ref2, token;
	      ref2 = this.tokens, token = ref2[ref2.length - 1];
	      return token != null ? token[0] : void 0;
	    };

	    Lexer.prototype.value = function() {
	      var ref2, token;
	      ref2 = this.tokens, token = ref2[ref2.length - 1];
	      return token != null ? token[1] : void 0;
	    };

	    Lexer.prototype.unfinished = function() {
	      var ref2;
	      return LINE_CONTINUER.test(this.chunk) || (ref2 = this.tag(), indexOf.call(UNFINISHED, ref2) >= 0);
	    };

	    Lexer.prototype.formatString = function(str, options) {
	      return this.replaceUnicodeCodePointEscapes(str.replace(STRING_OMIT, '$1'), options);
	    };

	    Lexer.prototype.formatHeregex = function(str) {
	      return this.formatRegex(str.replace(HEREGEX_OMIT, '$1$2'), {
	        delimiter: '///'
	      });
	    };

	    Lexer.prototype.formatRegex = function(str, options) {
	      return this.replaceUnicodeCodePointEscapes(str, options);
	    };

	    Lexer.prototype.unicodeCodePointToUnicodeEscapes = function(codePoint) {
	      var high, low, toUnicodeEscape;
	      toUnicodeEscape = function(val) {
	        var str;
	        str = val.toString(16);
	        return "\\u" + (repeat('0', 4 - str.length)) + str;
	      };
	      if (codePoint < 0x10000) {
	        return toUnicodeEscape(codePoint);
	      }
	      high = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
	      low = (codePoint - 0x10000) % 0x400 + 0xDC00;
	      return "" + (toUnicodeEscape(high)) + (toUnicodeEscape(low));
	    };

	    Lexer.prototype.replaceUnicodeCodePointEscapes = function(str, options) {
	      return str.replace(UNICODE_CODE_POINT_ESCAPE, (function(_this) {
	        return function(match, escapedBackslash, codePointHex, offset) {
	          var codePointDecimal;
	          if (escapedBackslash) {
	            return escapedBackslash;
	          }
	          codePointDecimal = parseInt(codePointHex, 16);
	          if (codePointDecimal > 0x10ffff) {
	            _this.error("unicode code point escapes greater than \\u{10ffff} are not allowed", {
	              offset: offset + options.delimiter.length,
	              length: codePointHex.length + 4
	            });
	          }
	          return _this.unicodeCodePointToUnicodeEscapes(codePointDecimal);
	        };
	      })(this));
	    };

	    Lexer.prototype.validateEscapes = function(str, options) {
	      var before, hex, invalidEscape, invalidEscapeRegex, match, message, octal, ref2, unicode, unicodeCodePoint;
	      if (options == null) {
	        options = {};
	      }
	      invalidEscapeRegex = options.isRegex ? REGEX_INVALID_ESCAPE : STRING_INVALID_ESCAPE;
	      match = invalidEscapeRegex.exec(str);
	      if (!match) {
	        return;
	      }
	      match[0], before = match[1], octal = match[2], hex = match[3], unicodeCodePoint = match[4], unicode = match[5];
	      message = octal ? "octal escape sequences are not allowed" : "invalid escape sequence";
	      invalidEscape = "\\" + (octal || hex || unicodeCodePoint || unicode);
	      return this.error(message + " " + invalidEscape, {
	        offset: ((ref2 = options.offsetInChunk) != null ? ref2 : 0) + match.index + before.length,
	        length: invalidEscape.length
	      });
	    };

	    Lexer.prototype.makeDelimitedLiteral = function(body, options) {
	      var regex;
	      if (options == null) {
	        options = {};
	      }
	      if (body === '' && options.delimiter === '/') {
	        body = '(?:)';
	      }
	      regex = RegExp("(\\\\\\\\)|(\\\\0(?=[1-7]))|\\\\?(" + options.delimiter + ")|\\\\?(?:(\\n)|(\\r)|(\\u2028)|(\\u2029))|(\\\\.)", "g");
	      body = body.replace(regex, function(match, backslash, nul, delimiter, lf, cr, ls, ps, other) {
	        switch (false) {
	          case !backslash:
	            if (options.double) {
	              return backslash + backslash;
	            } else {
	              return backslash;
	            }
	          case !nul:
	            return '\\x00';
	          case !delimiter:
	            return "\\" + delimiter;
	          case !lf:
	            return '\\n';
	          case !cr:
	            return '\\r';
	          case !ls:
	            return '\\u2028';
	          case !ps:
	            return '\\u2029';
	          case !other:
	            if (options.double) {
	              return "\\" + other;
	            } else {
	              return other;
	            }
	        }
	      });
	      return "" + options.delimiter + body + options.delimiter;
	    };

	    Lexer.prototype.error = function(message, options) {
	      var first_column, first_line, location, ref2, ref3, ref4;
	      if (options == null) {
	        options = {};
	      }
	      location = 'first_line' in options ? options : ((ref3 = this.getLineAndColumnFromChunk((ref2 = options.offset) != null ? ref2 : 0), first_line = ref3[0], first_column = ref3[1], ref3), {
	        first_line: first_line,
	        first_column: first_column,
	        last_column: first_column + ((ref4 = options.length) != null ? ref4 : 1) - 1
	      });
	      return throwSyntaxError(message, location);
	    };

	    return Lexer;

	  })();

	  isUnassignable = function(name, displayName) {
	    if (displayName == null) {
	      displayName = name;
	    }
	    switch (false) {
	      case indexOf.call(slice.call(JS_KEYWORDS).concat(slice.call(COFFEE_KEYWORDS)), name) < 0:
	        return "keyword '" + displayName + "' can't be assigned";
	      case indexOf.call(STRICT_PROSCRIBED, name) < 0:
	        return "'" + displayName + "' can't be assigned";
	      case indexOf.call(RESERVED, name) < 0:
	        return "reserved word '" + displayName + "' can't be assigned";
	      default:
	        return false;
	    }
	  };

	  exports.isUnassignable = isUnassignable;

	  isForFrom = function(prev) {
	    var ref2;
	    if (prev[0] === 'IDENTIFIER') {
	      if (prev[1] === 'from') {
	        prev[1][0] = 'IDENTIFIER';
	        true;
	      }
	      return true;
	    } else if (prev[0] === 'FOR') {
	      return false;
	    } else if ((ref2 = prev[1]) === '{' || ref2 === '[' || ref2 === ',' || ref2 === ':') {
	      return false;
	    } else {
	      return true;
	    }
	  };

	  JS_KEYWORDS = ['true', 'false', 'null', 'this', 'new', 'delete', 'typeof', 'in', 'instanceof', 'return', 'throw', 'break', 'continue', 'debugger', 'yield', 'if', 'else', 'switch', 'for', 'while', 'do', 'try', 'catch', 'finally', 'class', 'extends', 'super', 'import', 'export', 'default'];

	  COFFEE_KEYWORDS = ['undefined', 'Infinity', 'NaN', 'then', 'unless', 'until', 'loop', 'of', 'by', 'when'];

	  COFFEE_ALIAS_MAP = {
	    and: '&&',
	    or: '||',
	    is: '==',
	    isnt: '!=',
	    not: '!',
	    yes: 'true',
	    no: 'false',
	    on: 'true',
	    off: 'false'
	  };

	  COFFEE_ALIASES = (function() {
	    var results;
	    results = [];
	    for (key in COFFEE_ALIAS_MAP) {
	      results.push(key);
	    }
	    return results;
	  })();

	  COFFEE_KEYWORDS = COFFEE_KEYWORDS.concat(COFFEE_ALIASES);

	  RESERVED = ['case', 'function', 'var', 'void', 'with', 'const', 'let', 'enum', 'native', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'static'];

	  STRICT_PROSCRIBED = ['arguments', 'eval'];

	  exports.JS_FORBIDDEN = JS_KEYWORDS.concat(RESERVED).concat(STRICT_PROSCRIBED);

	  BOM = 65279;

	  IDENTIFIER = /^(?!\d)((?:(?!\s)[$\w\x7f-\uffff])+)([^\n\S]*:(?!:))?/;

	  NUMBER = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i;

	  OPERATOR = /^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*\/%])\2=?|\?(\.|::)|\.{2,3})/;

	  WHITESPACE = /^[^\n\S]+/;

	  COMMENT = /^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:\s*#(?!##[^#]).*)+/;

	  CODE = /^[-=]>/;

	  MULTI_DENT = /^(?:\n[^\n\S]*)+/;

	  JSTOKEN = /^`(?!``)((?:[^`\\]|\\[\s\S])*)`/;

	  HERE_JSTOKEN = /^```((?:[^`\\]|\\[\s\S]|`(?!``))*)```/;

	  STRING_START = /^(?:'''|"""|'|")/;

	  STRING_SINGLE = /^(?:[^\\']|\\[\s\S])*/;

	  STRING_DOUBLE = /^(?:[^\\"#]|\\[\s\S]|\#(?!\{))*/;

	  HEREDOC_SINGLE = /^(?:[^\\']|\\[\s\S]|'(?!''))*/;

	  HEREDOC_DOUBLE = /^(?:[^\\"#]|\\[\s\S]|"(?!"")|\#(?!\{))*/;

	  STRING_OMIT = /((?:\\\\)+)|\\[^\S\n]*\n\s*/g;

	  SIMPLE_STRING_OMIT = /\s*\n\s*/g;

	  HEREDOC_INDENT = /\n+([^\n\S]*)(?=\S)/g;

	  REGEX = /^\/(?!\/)((?:[^[\/\n\\]|\\[^\n]|\[(?:\\[^\n]|[^\]\n\\])*\])*)(\/)?/;

	  REGEX_FLAGS = /^\w*/;

	  VALID_FLAGS = /^(?!.*(.).*\1)[imguy]*$/;

	  HEREGEX = /^(?:[^\\\/#]|\\[\s\S]|\/(?!\/\/)|\#(?!\{))*/;

	  HEREGEX_OMIT = /((?:\\\\)+)|\\(\s)|\s+(?:#.*)?/g;

	  REGEX_ILLEGAL = /^(\/|\/{3}\s*)(\*)/;

	  POSSIBLY_DIVISION = /^\/=?\s/;

	  HERECOMMENT_ILLEGAL = /\*\//;

	  LINE_CONTINUER = /^\s*(?:,|\??\.(?![.\d])|::)/;

	  STRING_INVALID_ESCAPE = /((?:^|[^\\])(?:\\\\)*)\\(?:(0[0-7]|[1-7])|(x(?![\da-fA-F]{2}).{0,2})|(u\{(?![\da-fA-F]{1,}\})[^}]*\}?)|(u(?!\{|[\da-fA-F]{4}).{0,4}))/;

	  REGEX_INVALID_ESCAPE = /((?:^|[^\\])(?:\\\\)*)\\(?:(0[0-7])|(x(?![\da-fA-F]{2}).{0,2})|(u\{(?![\da-fA-F]{1,}\})[^}]*\}?)|(u(?!\{|[\da-fA-F]{4}).{0,4}))/;

	  UNICODE_CODE_POINT_ESCAPE = /(\\\\)|\\u\{([\da-fA-F]+)\}/g;

	  LEADING_BLANK_LINE = /^[^\n\S]*\n/;

	  TRAILING_BLANK_LINE = /\n[^\n\S]*$/;

	  TRAILING_SPACES = /\s+$/;

	  COMPOUND_ASSIGN = ['-=', '+=', '/=', '*=', '%=', '||=', '&&=', '?=', '<<=', '>>=', '>>>=', '&=', '^=', '|=', '**=', '//=', '%%='];

	  UNARY = ['NEW', 'TYPEOF', 'DELETE', 'DO'];

	  UNARY_MATH = ['!', '~'];

	  SHIFT = ['<<', '>>', '>>>'];

	  COMPARE = ['==', '!=', '<', '>', '<=', '>='];

	  MATH = ['*', '/', '%', '//', '%%'];

	  RELATION = ['IN', 'OF', 'INSTANCEOF'];

	  BOOL = ['TRUE', 'FALSE'];

	  CALLABLE = ['IDENTIFIER', 'PROPERTY', ')', ']', '?', '@', 'THIS', 'SUPER'];

	  INDEXABLE = CALLABLE.concat(['NUMBER', 'INFINITY', 'NAN', 'STRING', 'STRING_END', 'REGEX', 'REGEX_END', 'BOOL', 'NULL', 'UNDEFINED', '}', '::']);

	  NOT_REGEX = INDEXABLE.concat(['++', '--']);

	  LINE_BREAK = ['INDENT', 'OUTDENT', 'TERMINATOR'];

	  INDENTABLE_CLOSERS = [')', '}', ']'];

	  UNFINISHED = ['\\', '.', '?.', '?::', 'UNARY', 'MATH', 'UNARY_MATH', '+', '-', '**', 'SHIFT', 'RELATION', 'COMPARE', '&', '^', '|', '&&', '||', 'BIN?', 'THROW', 'EXTENDS', 'DEFAULT'];

	}).call(this);


/***/ }),
/* 172 */
/***/ (function(module, exports) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var BALANCED_PAIRS, CALL_CLOSERS, EXPRESSION_CLOSE, EXPRESSION_END, EXPRESSION_START, IMPLICIT_CALL, IMPLICIT_END, IMPLICIT_FUNC, IMPLICIT_UNSPACED_CALL, INVERSES, LINEBREAKS, Rewriter, SINGLE_CLOSERS, SINGLE_LINERS, generate, k, left, len, ref, rite,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    slice = [].slice;

	  generate = function(tag, value, origin) {
	    var tok;
	    tok = [tag, value];
	    tok.generated = true;
	    if (origin) {
	      tok.origin = origin;
	    }
	    return tok;
	  };

	  exports.Rewriter = Rewriter = (function() {
	    function Rewriter() {}

	    Rewriter.prototype.rewrite = function(tokens1) {
	      this.tokens = tokens1;
	      this.removeLeadingNewlines();
	      this.closeOpenCalls();
	      this.closeOpenIndexes();
	      this.normalizeLines();
	      this.tagPostfixConditionals();
	      this.addImplicitBracesAndParens();
	      this.addLocationDataToGeneratedTokens();
	      this.fixOutdentLocationData();
	      return this.tokens;
	    };

	    Rewriter.prototype.scanTokens = function(block) {
	      var i, token, tokens;
	      tokens = this.tokens;
	      i = 0;
	      while (token = tokens[i]) {
	        i += block.call(this, token, i, tokens);
	      }
	      return true;
	    };

	    Rewriter.prototype.detectEnd = function(i, condition, action) {
	      var levels, ref, ref1, token, tokens;
	      tokens = this.tokens;
	      levels = 0;
	      while (token = tokens[i]) {
	        if (levels === 0 && condition.call(this, token, i)) {
	          return action.call(this, token, i);
	        }
	        if (!token || levels < 0) {
	          return action.call(this, token, i - 1);
	        }
	        if (ref = token[0], indexOf.call(EXPRESSION_START, ref) >= 0) {
	          levels += 1;
	        } else if (ref1 = token[0], indexOf.call(EXPRESSION_END, ref1) >= 0) {
	          levels -= 1;
	        }
	        i += 1;
	      }
	      return i - 1;
	    };

	    Rewriter.prototype.removeLeadingNewlines = function() {
	      var i, k, len, ref, tag;
	      ref = this.tokens;
	      for (i = k = 0, len = ref.length; k < len; i = ++k) {
	        tag = ref[i][0];
	        if (tag !== 'TERMINATOR') {
	          break;
	        }
	      }
	      if (i) {
	        return this.tokens.splice(0, i);
	      }
	    };

	    Rewriter.prototype.closeOpenCalls = function() {
	      var action, condition;
	      condition = function(token, i) {
	        var ref;
	        return ((ref = token[0]) === ')' || ref === 'CALL_END') || token[0] === 'OUTDENT' && this.tag(i - 1) === ')';
	      };
	      action = function(token, i) {
	        return this.tokens[token[0] === 'OUTDENT' ? i - 1 : i][0] = 'CALL_END';
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] === 'CALL_START') {
	          this.detectEnd(i + 1, condition, action);
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.closeOpenIndexes = function() {
	      var action, condition;
	      condition = function(token, i) {
	        var ref;
	        return (ref = token[0]) === ']' || ref === 'INDEX_END';
	      };
	      action = function(token, i) {
	        return token[0] = 'INDEX_END';
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] === 'INDEX_START') {
	          this.detectEnd(i + 1, condition, action);
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.indexOfTag = function() {
	      var fuzz, i, j, k, pattern, ref, ref1;
	      i = arguments[0], pattern = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	      fuzz = 0;
	      for (j = k = 0, ref = pattern.length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
	        while (this.tag(i + j + fuzz) === 'HERECOMMENT') {
	          fuzz += 2;
	        }
	        if (pattern[j] == null) {
	          continue;
	        }
	        if (typeof pattern[j] === 'string') {
	          pattern[j] = [pattern[j]];
	        }
	        if (ref1 = this.tag(i + j + fuzz), indexOf.call(pattern[j], ref1) < 0) {
	          return -1;
	        }
	      }
	      return i + j + fuzz - 1;
	    };

	    Rewriter.prototype.looksObjectish = function(j) {
	      var end, index;
	      if (this.indexOfTag(j, '@', null, ':') > -1 || this.indexOfTag(j, null, ':') > -1) {
	        return true;
	      }
	      index = this.indexOfTag(j, EXPRESSION_START);
	      if (index > -1) {
	        end = null;
	        this.detectEnd(index + 1, (function(token) {
	          var ref;
	          return ref = token[0], indexOf.call(EXPRESSION_END, ref) >= 0;
	        }), (function(token, i) {
	          return end = i;
	        }));
	        if (this.tag(end + 1) === ':') {
	          return true;
	        }
	      }
	      return false;
	    };

	    Rewriter.prototype.findTagsBackwards = function(i, tags) {
	      var backStack, ref, ref1, ref2, ref3, ref4, ref5;
	      backStack = [];
	      while (i >= 0 && (backStack.length || (ref2 = this.tag(i), indexOf.call(tags, ref2) < 0) && ((ref3 = this.tag(i), indexOf.call(EXPRESSION_START, ref3) < 0) || this.tokens[i].generated) && (ref4 = this.tag(i), indexOf.call(LINEBREAKS, ref4) < 0))) {
	        if (ref = this.tag(i), indexOf.call(EXPRESSION_END, ref) >= 0) {
	          backStack.push(this.tag(i));
	        }
	        if ((ref1 = this.tag(i), indexOf.call(EXPRESSION_START, ref1) >= 0) && backStack.length) {
	          backStack.pop();
	        }
	        i -= 1;
	      }
	      return ref5 = this.tag(i), indexOf.call(tags, ref5) >= 0;
	    };

	    Rewriter.prototype.addImplicitBracesAndParens = function() {
	      var stack, start;
	      stack = [];
	      start = null;
	      return this.scanTokens(function(token, i, tokens) {
	        var endImplicitCall, endImplicitObject, forward, inImplicit, inImplicitCall, inImplicitControl, inImplicitObject, isImplicit, isImplicitCall, isImplicitObject, k, newLine, nextTag, offset, prevTag, prevToken, ref, ref1, ref2, ref3, ref4, ref5, s, sameLine, stackIdx, stackItem, stackTag, stackTop, startIdx, startImplicitCall, startImplicitObject, startsLine, tag;
	        tag = token[0];
	        prevTag = (prevToken = i > 0 ? tokens[i - 1] : [])[0];
	        nextTag = (i < tokens.length - 1 ? tokens[i + 1] : [])[0];
	        stackTop = function() {
	          return stack[stack.length - 1];
	        };
	        startIdx = i;
	        forward = function(n) {
	          return i - startIdx + n;
	        };
	        isImplicit = function(stackItem) {
	          var ref;
	          return stackItem != null ? (ref = stackItem[2]) != null ? ref.ours : void 0 : void 0;
	        };
	        isImplicitObject = function(stackItem) {
	          return isImplicit(stackItem) && (stackItem != null ? stackItem[0] : void 0) === '{';
	        };
	        isImplicitCall = function(stackItem) {
	          return isImplicit(stackItem) && (stackItem != null ? stackItem[0] : void 0) === '(';
	        };
	        inImplicit = function() {
	          return isImplicit(stackTop());
	        };
	        inImplicitCall = function() {
	          return isImplicitCall(stackTop());
	        };
	        inImplicitObject = function() {
	          return isImplicitObject(stackTop());
	        };
	        inImplicitControl = function() {
	          var ref;
	          return inImplicit && ((ref = stackTop()) != null ? ref[0] : void 0) === 'CONTROL';
	        };
	        startImplicitCall = function(j) {
	          var idx;
	          idx = j != null ? j : i;
	          stack.push([
	            '(', idx, {
	              ours: true
	            }
	          ]);
	          tokens.splice(idx, 0, generate('CALL_START', '(', ['', 'implicit function call', token[2]]));
	          if (j == null) {
	            return i += 1;
	          }
	        };
	        endImplicitCall = function() {
	          stack.pop();
	          tokens.splice(i, 0, generate('CALL_END', ')', ['', 'end of input', token[2]]));
	          return i += 1;
	        };
	        startImplicitObject = function(j, startsLine) {
	          var idx, val;
	          if (startsLine == null) {
	            startsLine = true;
	          }
	          idx = j != null ? j : i;
	          stack.push([
	            '{', idx, {
	              sameLine: true,
	              startsLine: startsLine,
	              ours: true
	            }
	          ]);
	          val = new String('{');
	          val.generated = true;
	          tokens.splice(idx, 0, generate('{', val, token));
	          if (j == null) {
	            return i += 1;
	          }
	        };
	        endImplicitObject = function(j) {
	          j = j != null ? j : i;
	          stack.pop();
	          tokens.splice(j, 0, generate('}', '}', token));
	          return i += 1;
	        };
	        if (inImplicitCall() && (tag === 'IF' || tag === 'TRY' || tag === 'FINALLY' || tag === 'CATCH' || tag === 'CLASS' || tag === 'SWITCH')) {
	          stack.push([
	            'CONTROL', i, {
	              ours: true
	            }
	          ]);
	          return forward(1);
	        }
	        if (tag === 'INDENT' && inImplicit()) {
	          if (prevTag !== '=>' && prevTag !== '->' && prevTag !== '[' && prevTag !== '(' && prevTag !== ',' && prevTag !== '{' && prevTag !== 'TRY' && prevTag !== 'ELSE' && prevTag !== '=') {
	            while (inImplicitCall()) {
	              endImplicitCall();
	            }
	          }
	          if (inImplicitControl()) {
	            stack.pop();
	          }
	          stack.push([tag, i]);
	          return forward(1);
	        }
	        if (indexOf.call(EXPRESSION_START, tag) >= 0) {
	          stack.push([tag, i]);
	          return forward(1);
	        }
	        if (indexOf.call(EXPRESSION_END, tag) >= 0) {
	          while (inImplicit()) {
	            if (inImplicitCall()) {
	              endImplicitCall();
	            } else if (inImplicitObject()) {
	              endImplicitObject();
	            } else {
	              stack.pop();
	            }
	          }
	          start = stack.pop();
	        }
	        if ((indexOf.call(IMPLICIT_FUNC, tag) >= 0 && token.spaced || tag === '?' && i > 0 && !tokens[i - 1].spaced) && (indexOf.call(IMPLICIT_CALL, nextTag) >= 0 || indexOf.call(IMPLICIT_UNSPACED_CALL, nextTag) >= 0 && !((ref = tokens[i + 1]) != null ? ref.spaced : void 0) && !((ref1 = tokens[i + 1]) != null ? ref1.newLine : void 0))) {
	          if (tag === '?') {
	            tag = token[0] = 'FUNC_EXIST';
	          }
	          startImplicitCall(i + 1);
	          return forward(2);
	        }
	        if (indexOf.call(IMPLICIT_FUNC, tag) >= 0 && this.indexOfTag(i + 1, 'INDENT') > -1 && this.looksObjectish(i + 2) && !this.findTagsBackwards(i, ['CLASS', 'EXTENDS', 'IF', 'CATCH', 'SWITCH', 'LEADING_WHEN', 'FOR', 'WHILE', 'UNTIL'])) {
	          startImplicitCall(i + 1);
	          stack.push(['INDENT', i + 2]);
	          return forward(3);
	        }
	        if (tag === ':') {
	          s = (function() {
	            var ref2;
	            switch (false) {
	              case ref2 = this.tag(i - 1), indexOf.call(EXPRESSION_END, ref2) < 0:
	                return start[1];
	              case this.tag(i - 2) !== '@':
	                return i - 2;
	              default:
	                return i - 1;
	            }
	          }).call(this);
	          while (this.tag(s - 2) === 'HERECOMMENT') {
	            s -= 2;
	          }
	          this.insideForDeclaration = nextTag === 'FOR';
	          startsLine = s === 0 || (ref2 = this.tag(s - 1), indexOf.call(LINEBREAKS, ref2) >= 0) || tokens[s - 1].newLine;
	          if (stackTop()) {
	            ref3 = stackTop(), stackTag = ref3[0], stackIdx = ref3[1];
	            if ((stackTag === '{' || stackTag === 'INDENT' && this.tag(stackIdx - 1) === '{') && (startsLine || this.tag(s - 1) === ',' || this.tag(s - 1) === '{')) {
	              return forward(1);
	            }
	          }
	          startImplicitObject(s, !!startsLine);
	          return forward(2);
	        }
	        if (indexOf.call(LINEBREAKS, tag) >= 0) {
	          for (k = stack.length - 1; k >= 0; k += -1) {
	            stackItem = stack[k];
	            if (!isImplicit(stackItem)) {
	              break;
	            }
	            if (isImplicitObject(stackItem)) {
	              stackItem[2].sameLine = false;
	            }
	          }
	        }
	        newLine = prevTag === 'OUTDENT' || prevToken.newLine;
	        if (indexOf.call(IMPLICIT_END, tag) >= 0 || indexOf.call(CALL_CLOSERS, tag) >= 0 && newLine) {
	          while (inImplicit()) {
	            ref4 = stackTop(), stackTag = ref4[0], stackIdx = ref4[1], (ref5 = ref4[2], sameLine = ref5.sameLine, startsLine = ref5.startsLine);
	            if (inImplicitCall() && prevTag !== ',') {
	              endImplicitCall();
	            } else if (inImplicitObject() && !this.insideForDeclaration && sameLine && tag !== 'TERMINATOR' && prevTag !== ':') {
	              endImplicitObject();
	            } else if (inImplicitObject() && tag === 'TERMINATOR' && prevTag !== ',' && !(startsLine && this.looksObjectish(i + 1))) {
	              if (nextTag === 'HERECOMMENT') {
	                return forward(1);
	              }
	              endImplicitObject();
	            } else {
	              break;
	            }
	          }
	        }
	        if (tag === ',' && !this.looksObjectish(i + 1) && inImplicitObject() && !this.insideForDeclaration && (nextTag !== 'TERMINATOR' || !this.looksObjectish(i + 2))) {
	          offset = nextTag === 'OUTDENT' ? 1 : 0;
	          while (inImplicitObject()) {
	            endImplicitObject(i + offset);
	          }
	        }
	        return forward(1);
	      });
	    };

	    Rewriter.prototype.addLocationDataToGeneratedTokens = function() {
	      return this.scanTokens(function(token, i, tokens) {
	        var column, line, nextLocation, prevLocation, ref, ref1;
	        if (token[2]) {
	          return 1;
	        }
	        if (!(token.generated || token.explicit)) {
	          return 1;
	        }
	        if (token[0] === '{' && (nextLocation = (ref = tokens[i + 1]) != null ? ref[2] : void 0)) {
	          line = nextLocation.first_line, column = nextLocation.first_column;
	        } else if (prevLocation = (ref1 = tokens[i - 1]) != null ? ref1[2] : void 0) {
	          line = prevLocation.last_line, column = prevLocation.last_column;
	        } else {
	          line = column = 0;
	        }
	        token[2] = {
	          first_line: line,
	          first_column: column,
	          last_line: line,
	          last_column: column
	        };
	        return 1;
	      });
	    };

	    Rewriter.prototype.fixOutdentLocationData = function() {
	      return this.scanTokens(function(token, i, tokens) {
	        var prevLocationData;
	        if (!(token[0] === 'OUTDENT' || (token.generated && token[0] === 'CALL_END') || (token.generated && token[0] === '}'))) {
	          return 1;
	        }
	        prevLocationData = tokens[i - 1][2];
	        token[2] = {
	          first_line: prevLocationData.last_line,
	          first_column: prevLocationData.last_column,
	          last_line: prevLocationData.last_line,
	          last_column: prevLocationData.last_column
	        };
	        return 1;
	      });
	    };

	    Rewriter.prototype.normalizeLines = function() {
	      var action, condition, indent, outdent, starter;
	      starter = indent = outdent = null;
	      condition = function(token, i) {
	        var ref, ref1, ref2, ref3;
	        return token[1] !== ';' && (ref = token[0], indexOf.call(SINGLE_CLOSERS, ref) >= 0) && !(token[0] === 'TERMINATOR' && (ref1 = this.tag(i + 1), indexOf.call(EXPRESSION_CLOSE, ref1) >= 0)) && !(token[0] === 'ELSE' && starter !== 'THEN') && !(((ref2 = token[0]) === 'CATCH' || ref2 === 'FINALLY') && (starter === '->' || starter === '=>')) || (ref3 = token[0], indexOf.call(CALL_CLOSERS, ref3) >= 0) && (this.tokens[i - 1].newLine || this.tokens[i - 1][0] === 'OUTDENT');
	      };
	      action = function(token, i) {
	        return this.tokens.splice((this.tag(i - 1) === ',' ? i - 1 : i), 0, outdent);
	      };
	      return this.scanTokens(function(token, i, tokens) {
	        var j, k, ref, ref1, ref2, tag;
	        tag = token[0];
	        if (tag === 'TERMINATOR') {
	          if (this.tag(i + 1) === 'ELSE' && this.tag(i - 1) !== 'OUTDENT') {
	            tokens.splice.apply(tokens, [i, 1].concat(slice.call(this.indentation())));
	            return 1;
	          }
	          if (ref = this.tag(i + 1), indexOf.call(EXPRESSION_CLOSE, ref) >= 0) {
	            tokens.splice(i, 1);
	            return 0;
	          }
	        }
	        if (tag === 'CATCH') {
	          for (j = k = 1; k <= 2; j = ++k) {
	            if (!((ref1 = this.tag(i + j)) === 'OUTDENT' || ref1 === 'TERMINATOR' || ref1 === 'FINALLY')) {
	              continue;
	            }
	            tokens.splice.apply(tokens, [i + j, 0].concat(slice.call(this.indentation())));
	            return 2 + j;
	          }
	        }
	        if (indexOf.call(SINGLE_LINERS, tag) >= 0 && this.tag(i + 1) !== 'INDENT' && !(tag === 'ELSE' && this.tag(i + 1) === 'IF')) {
	          starter = tag;
	          ref2 = this.indentation(tokens[i]), indent = ref2[0], outdent = ref2[1];
	          if (starter === 'THEN') {
	            indent.fromThen = true;
	          }
	          tokens.splice(i + 1, 0, indent);
	          this.detectEnd(i + 2, condition, action);
	          if (tag === 'THEN') {
	            tokens.splice(i, 1);
	          }
	          return 1;
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.tagPostfixConditionals = function() {
	      var action, condition, original;
	      original = null;
	      condition = function(token, i) {
	        var prevTag, tag;
	        tag = token[0];
	        prevTag = this.tokens[i - 1][0];
	        return tag === 'TERMINATOR' || (tag === 'INDENT' && indexOf.call(SINGLE_LINERS, prevTag) < 0);
	      };
	      action = function(token, i) {
	        if (token[0] !== 'INDENT' || (token.generated && !token.fromThen)) {
	          return original[0] = 'POST_' + original[0];
	        }
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] !== 'IF') {
	          return 1;
	        }
	        original = token;
	        this.detectEnd(i + 1, condition, action);
	        return 1;
	      });
	    };

	    Rewriter.prototype.indentation = function(origin) {
	      var indent, outdent;
	      indent = ['INDENT', 2];
	      outdent = ['OUTDENT', 2];
	      if (origin) {
	        indent.generated = outdent.generated = true;
	        indent.origin = outdent.origin = origin;
	      } else {
	        indent.explicit = outdent.explicit = true;
	      }
	      return [indent, outdent];
	    };

	    Rewriter.prototype.generate = generate;

	    Rewriter.prototype.tag = function(i) {
	      var ref;
	      return (ref = this.tokens[i]) != null ? ref[0] : void 0;
	    };

	    return Rewriter;

	  })();

	  BALANCED_PAIRS = [['(', ')'], ['[', ']'], ['{', '}'], ['INDENT', 'OUTDENT'], ['CALL_START', 'CALL_END'], ['PARAM_START', 'PARAM_END'], ['INDEX_START', 'INDEX_END'], ['STRING_START', 'STRING_END'], ['REGEX_START', 'REGEX_END']];

	  exports.INVERSES = INVERSES = {};

	  EXPRESSION_START = [];

	  EXPRESSION_END = [];

	  for (k = 0, len = BALANCED_PAIRS.length; k < len; k++) {
	    ref = BALANCED_PAIRS[k], left = ref[0], rite = ref[1];
	    EXPRESSION_START.push(INVERSES[rite] = left);
	    EXPRESSION_END.push(INVERSES[left] = rite);
	  }

	  EXPRESSION_CLOSE = ['CATCH', 'THEN', 'ELSE', 'FINALLY'].concat(EXPRESSION_END);

	  IMPLICIT_FUNC = ['IDENTIFIER', 'PROPERTY', 'SUPER', ')', 'CALL_END', ']', 'INDEX_END', '@', 'THIS'];

	  IMPLICIT_CALL = ['IDENTIFIER', 'PROPERTY', 'NUMBER', 'INFINITY', 'NAN', 'STRING', 'STRING_START', 'REGEX', 'REGEX_START', 'JS', 'NEW', 'PARAM_START', 'CLASS', 'IF', 'TRY', 'SWITCH', 'THIS', 'UNDEFINED', 'NULL', 'BOOL', 'UNARY', 'YIELD', 'UNARY_MATH', 'SUPER', 'THROW', '@', '->', '=>', '[', '(', '{', '--', '++'];

	  IMPLICIT_UNSPACED_CALL = ['+', '-'];

	  IMPLICIT_END = ['POST_IF', 'FOR', 'WHILE', 'UNTIL', 'WHEN', 'BY', 'LOOP', 'TERMINATOR'];

	  SINGLE_LINERS = ['ELSE', '->', '=>', 'TRY', 'FINALLY', 'THEN'];

	  SINGLE_CLOSERS = ['TERMINATOR', 'CATCH', 'FINALLY', 'ELSE', 'OUTDENT', 'LEADING_WHEN'];

	  LINEBREAKS = ['TERMINATOR', 'INDENT', 'OUTDENT'];

	  CALL_CLOSERS = ['.', '?.', '::', '?::'];

	}).call(this);


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.12.7
	(function() {
	  var buildLocationData, extend, flatten, ref, repeat, syntaxErrorToString;

	  exports.starts = function(string, literal, start) {
	    return literal === string.substr(start, literal.length);
	  };

	  exports.ends = function(string, literal, back) {
	    var len;
	    len = literal.length;
	    return literal === string.substr(string.length - len - (back || 0), len);
	  };

	  exports.repeat = repeat = function(str, n) {
	    var res;
	    res = '';
	    while (n > 0) {
	      if (n & 1) {
	        res += str;
	      }
	      n >>>= 1;
	      str += str;
	    }
	    return res;
	  };

	  exports.compact = function(array) {
	    var i, item, len1, results;
	    results = [];
	    for (i = 0, len1 = array.length; i < len1; i++) {
	      item = array[i];
	      if (item) {
	        results.push(item);
	      }
	    }
	    return results;
	  };

	  exports.count = function(string, substr) {
	    var num, pos;
	    num = pos = 0;
	    if (!substr.length) {
	      return 1 / 0;
	    }
	    while (pos = 1 + string.indexOf(substr, pos)) {
	      num++;
	    }
	    return num;
	  };

	  exports.merge = function(options, overrides) {
	    return extend(extend({}, options), overrides);
	  };

	  extend = exports.extend = function(object, properties) {
	    var key, val;
	    for (key in properties) {
	      val = properties[key];
	      object[key] = val;
	    }
	    return object;
	  };

	  exports.flatten = flatten = function(array) {
	    var element, flattened, i, len1;
	    flattened = [];
	    for (i = 0, len1 = array.length; i < len1; i++) {
	      element = array[i];
	      if ('[object Array]' === Object.prototype.toString.call(element)) {
	        flattened = flattened.concat(flatten(element));
	      } else {
	        flattened.push(element);
	      }
	    }
	    return flattened;
	  };

	  exports.del = function(obj, key) {
	    var val;
	    val = obj[key];
	    delete obj[key];
	    return val;
	  };

	  exports.some = (ref = Array.prototype.some) != null ? ref : function(fn) {
	    var e, i, len1, ref1;
	    ref1 = this;
	    for (i = 0, len1 = ref1.length; i < len1; i++) {
	      e = ref1[i];
	      if (fn(e)) {
	        return true;
	      }
	    }
	    return false;
	  };

	  exports.invertLiterate = function(code) {
	    var line, lines, maybe_code;
	    maybe_code = true;
	    lines = (function() {
	      var i, len1, ref1, results;
	      ref1 = code.split('\n');
	      results = [];
	      for (i = 0, len1 = ref1.length; i < len1; i++) {
	        line = ref1[i];
	        if (maybe_code && /^([ ]{4}|[ ]{0,3}\t)/.test(line)) {
	          results.push(line);
	        } else if (maybe_code = /^\s*$/.test(line)) {
	          results.push(line);
	        } else {
	          results.push('# ' + line);
	        }
	      }
	      return results;
	    })();
	    return lines.join('\n');
	  };

	  buildLocationData = function(first, last) {
	    if (!last) {
	      return first;
	    } else {
	      return {
	        first_line: first.first_line,
	        first_column: first.first_column,
	        last_line: last.last_line,
	        last_column: last.last_column
	      };
	    }
	  };

	  exports.addLocationDataFn = function(first, last) {
	    return function(obj) {
	      if (((typeof obj) === 'object') && (!!obj['updateLocationDataIfMissing'])) {
	        obj.updateLocationDataIfMissing(buildLocationData(first, last));
	      }
	      return obj;
	    };
	  };

	  exports.locationDataToString = function(obj) {
	    var locationData;
	    if (("2" in obj) && ("first_line" in obj[2])) {
	      locationData = obj[2];
	    } else if ("first_line" in obj) {
	      locationData = obj;
	    }
	    if (locationData) {
	      return ((locationData.first_line + 1) + ":" + (locationData.first_column + 1) + "-") + ((locationData.last_line + 1) + ":" + (locationData.last_column + 1));
	    } else {
	      return "No location data";
	    }
	  };

	  exports.baseFileName = function(file, stripExt, useWinPathSep) {
	    var parts, pathSep;
	    if (stripExt == null) {
	      stripExt = false;
	    }
	    if (useWinPathSep == null) {
	      useWinPathSep = false;
	    }
	    pathSep = useWinPathSep ? /\\|\// : /\//;
	    parts = file.split(pathSep);
	    file = parts[parts.length - 1];
	    if (!(stripExt && file.indexOf('.') >= 0)) {
	      return file;
	    }
	    parts = file.split('.');
	    parts.pop();
	    if (parts[parts.length - 1] === 'coffee' && parts.length > 1) {
	      parts.pop();
	    }
	    return parts.join('.');
	  };

	  exports.isCoffee = function(file) {
	    return /\.((lit)?coffee|coffee\.md)$/.test(file);
	  };

	  exports.isLiterate = function(file) {
	    return /\.(litcoffee|coffee\.md)$/.test(file);
	  };

	  exports.throwSyntaxError = function(message, location) {
	    var error;
	    error = new SyntaxError(message);
	    error.location = location;
	    error.toString = syntaxErrorToString;
	    error.stack = error.toString();
	    throw error;
	  };

	  exports.updateSyntaxError = function(error, code, filename) {
	    if (error.toString === syntaxErrorToString) {
	      error.code || (error.code = code);
	      error.filename || (error.filename = filename);
	      error.stack = error.toString();
	    }
	    return error;
	  };

	  syntaxErrorToString = function() {
	    var codeLine, colorize, colorsEnabled, end, filename, first_column, first_line, last_column, last_line, marker, ref1, ref2, ref3, ref4, start;
	    if (!(this.code && this.location)) {
	      return Error.prototype.toString.call(this);
	    }
	    ref1 = this.location, first_line = ref1.first_line, first_column = ref1.first_column, last_line = ref1.last_line, last_column = ref1.last_column;
	    if (last_line == null) {
	      last_line = first_line;
	    }
	    if (last_column == null) {
	      last_column = first_column;
	    }
	    filename = this.filename || '[stdin]';
	    codeLine = this.code.split('\n')[first_line];
	    start = first_column;
	    end = first_line === last_line ? last_column + 1 : codeLine.length;
	    marker = codeLine.slice(0, start).replace(/[^\s]/g, ' ') + repeat('^', end - start);
	    if (typeof process !== "undefined" && process !== null) {
	      colorsEnabled = ((ref2 = process.stdout) != null ? ref2.isTTY : void 0) && !((ref3 = process.env) != null ? ref3.NODE_DISABLE_COLORS : void 0);
	    }
	    if ((ref4 = this.colorful) != null ? ref4 : colorsEnabled) {
	      colorize = function(str) {
	        return "\x1B[1;31m" + str + "\x1B[0m";
	      };
	      codeLine = codeLine.slice(0, start) + colorize(codeLine.slice(start, end)) + codeLine.slice(end);
	      marker = colorize(marker);
	    }
	    return filename + ":" + (first_line + 1) + ":" + (first_column + 1) + ": error: " + this.message + "\n" + codeLine + "\n" + marker;
	  };

	  exports.nameWhitespaceCharacter = function(string) {
	    switch (string) {
	      case ' ':
	        return 'space';
	      case '\n':
	        return 'newline';
	      case '\r':
	        return 'carriage return';
	      case '\t':
	        return 'tab';
	      default:
	        return string;
	    }
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.17 */
	/*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var parser = (function(){
	var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,22],$V1=[1,25],$V2=[1,83],$V3=[1,79],$V4=[1,84],$V5=[1,85],$V6=[1,81],$V7=[1,82],$V8=[1,56],$V9=[1,58],$Va=[1,59],$Vb=[1,60],$Vc=[1,61],$Vd=[1,62],$Ve=[1,49],$Vf=[1,50],$Vg=[1,32],$Vh=[1,68],$Vi=[1,69],$Vj=[1,78],$Vk=[1,47],$Vl=[1,51],$Vm=[1,52],$Vn=[1,67],$Vo=[1,65],$Vp=[1,66],$Vq=[1,64],$Vr=[1,42],$Vs=[1,48],$Vt=[1,63],$Vu=[1,73],$Vv=[1,74],$Vw=[1,75],$Vx=[1,76],$Vy=[1,46],$Vz=[1,72],$VA=[1,34],$VB=[1,35],$VC=[1,36],$VD=[1,37],$VE=[1,38],$VF=[1,39],$VG=[1,86],$VH=[1,6,32,42,131],$VI=[1,101],$VJ=[1,89],$VK=[1,88],$VL=[1,87],$VM=[1,90],$VN=[1,91],$VO=[1,92],$VP=[1,93],$VQ=[1,94],$VR=[1,95],$VS=[1,96],$VT=[1,97],$VU=[1,98],$VV=[1,99],$VW=[1,100],$VX=[1,104],$VY=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$VZ=[2,167],$V_=[1,110],$V$=[1,111],$V01=[1,112],$V11=[1,113],$V21=[1,115],$V31=[1,116],$V41=[1,109],$V51=[1,6,32,42,131,133,135,139,156],$V61=[2,27],$V71=[1,123],$V81=[1,121],$V91=[1,6,31,32,40,41,42,66,71,74,82,83,84,85,87,89,90,94,113,114,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Va1=[2,95],$Vb1=[1,6,31,32,42,46,66,71,74,82,83,84,85,87,89,90,94,113,114,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Vc1=[2,74],$Vd1=[1,128],$Ve1=[1,133],$Vf1=[1,134],$Vg1=[1,136],$Vh1=[1,6,31,32,40,41,42,55,66,71,74,82,83,84,85,87,89,90,94,113,114,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Vi1=[2,92],$Vj1=[1,6,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Vk1=[2,64],$Vl1=[1,161],$Vm1=[1,167],$Vn1=[1,179],$Vo1=[1,181],$Vp1=[1,176],$Vq1=[1,183],$Vr1=[1,185],$Vs1=[1,6,31,32,40,41,42,55,66,71,74,82,83,84,85,87,89,90,94,96,113,114,115,120,122,131,133,134,135,139,140,156,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175],$Vt1=[2,111],$Vu1=[1,6,31,32,40,41,42,58,66,71,74,82,83,84,85,87,89,90,94,113,114,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Vv1=[1,6,31,32,40,41,42,46,58,66,71,74,82,83,84,85,87,89,90,94,113,114,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Vw1=[40,41,114],$Vx1=[1,242],$Vy1=[1,241],$Vz1=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156],$VA1=[2,72],$VB1=[1,251],$VC1=[6,31,32,66,71],$VD1=[6,31,32,55,66,71,74],$VE1=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,159,160,164,166,167,168,169,170,171,172,173,174],$VF1=[40,41,82,83,84,85,87,90,113,114],$VG1=[1,270],$VH1=[2,62],$VI1=[1,281],$VJ1=[1,283],$VK1=[1,288],$VL1=[1,290],$VM1=[2,188],$VN1=[1,6,31,32,40,41,42,55,66,71,74,82,83,84,85,87,89,90,94,113,114,115,120,122,131,133,134,135,139,140,146,147,148,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$VO1=[1,299],$VP1=[6,31,32,71,115,120],$VQ1=[1,6,31,32,40,41,42,55,58,66,71,74,82,83,84,85,87,89,90,94,96,113,114,115,120,122,131,133,134,135,139,140,146,147,148,156,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175],$VR1=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,140,156],$VS1=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,134,140,156],$VT1=[146,147,148],$VU1=[71,146,147,148],$VV1=[6,31,94],$VW1=[1,313],$VX1=[6,31,32,71,94],$VY1=[6,31,32,58,71,94],$VZ1=[6,31,32,55,58,71,94],$V_1=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,159,160,166,167,168,169,170,171,172,173,174],$V$1=[12,28,34,38,40,41,44,45,48,49,50,51,52,53,61,63,64,68,69,89,92,95,97,105,112,117,118,119,125,129,130,133,135,137,139,149,155,157,158,159,160,161,162],$V02=[2,177],$V12=[6,31,32],$V22=[2,73],$V32=[1,325],$V42=[1,326],$V52=[1,6,31,32,42,66,71,74,89,94,115,120,122,127,128,131,133,134,135,139,140,151,153,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$V62=[32,151,153],$V72=[1,6,32,42,66,71,74,89,94,115,120,122,131,134,140,156],$V82=[1,353],$V92=[1,359],$Va2=[1,6,32,42,131,156],$Vb2=[2,87],$Vc2=[1,370],$Vd2=[1,371],$Ve2=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,151,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Vf2=[1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,135,139,140,156],$Vg2=[1,384],$Vh2=[1,385],$Vi2=[6,31,32,94],$Vj2=[6,31,32,71],$Vk2=[1,6,31,32,42,66,71,74,89,94,115,120,122,127,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],$Vl2=[31,71],$Vm2=[1,411],$Vn2=[1,412],$Vo2=[1,418],$Vp2=[1,419];
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"Root":3,"Body":4,"Line":5,"TERMINATOR":6,"Expression":7,"Statement":8,"YieldReturn":9,"Return":10,"Comment":11,"STATEMENT":12,"Import":13,"Export":14,"Value":15,"Invocation":16,"Code":17,"Operation":18,"Assign":19,"If":20,"Try":21,"While":22,"For":23,"Switch":24,"Class":25,"Throw":26,"Yield":27,"YIELD":28,"FROM":29,"Block":30,"INDENT":31,"OUTDENT":32,"Identifier":33,"IDENTIFIER":34,"Property":35,"PROPERTY":36,"AlphaNumeric":37,"NUMBER":38,"String":39,"STRING":40,"STRING_START":41,"STRING_END":42,"Regex":43,"REGEX":44,"REGEX_START":45,"REGEX_END":46,"Literal":47,"JS":48,"UNDEFINED":49,"NULL":50,"BOOL":51,"INFINITY":52,"NAN":53,"Assignable":54,"=":55,"AssignObj":56,"ObjAssignable":57,":":58,"SimpleObjAssignable":59,"ThisProperty":60,"RETURN":61,"Object":62,"HERECOMMENT":63,"PARAM_START":64,"ParamList":65,"PARAM_END":66,"FuncGlyph":67,"->":68,"=>":69,"OptComma":70,",":71,"Param":72,"ParamVar":73,"...":74,"Array":75,"Splat":76,"SimpleAssignable":77,"Accessor":78,"Parenthetical":79,"Range":80,"This":81,".":82,"?.":83,"::":84,"?::":85,"Index":86,"INDEX_START":87,"IndexValue":88,"INDEX_END":89,"INDEX_SOAK":90,"Slice":91,"{":92,"AssignList":93,"}":94,"CLASS":95,"EXTENDS":96,"IMPORT":97,"ImportDefaultSpecifier":98,"ImportNamespaceSpecifier":99,"ImportSpecifierList":100,"ImportSpecifier":101,"AS":102,"DEFAULT":103,"IMPORT_ALL":104,"EXPORT":105,"ExportSpecifierList":106,"EXPORT_ALL":107,"ExportSpecifier":108,"OptFuncExist":109,"Arguments":110,"Super":111,"SUPER":112,"FUNC_EXIST":113,"CALL_START":114,"CALL_END":115,"ArgList":116,"THIS":117,"@":118,"[":119,"]":120,"RangeDots":121,"..":122,"Arg":123,"SimpleArgs":124,"TRY":125,"Catch":126,"FINALLY":127,"CATCH":128,"THROW":129,"(":130,")":131,"WhileSource":132,"WHILE":133,"WHEN":134,"UNTIL":135,"Loop":136,"LOOP":137,"ForBody":138,"FOR":139,"BY":140,"ForStart":141,"ForSource":142,"ForVariables":143,"OWN":144,"ForValue":145,"FORIN":146,"FOROF":147,"FORFROM":148,"SWITCH":149,"Whens":150,"ELSE":151,"When":152,"LEADING_WHEN":153,"IfBlock":154,"IF":155,"POST_IF":156,"UNARY":157,"UNARY_MATH":158,"-":159,"+":160,"--":161,"++":162,"?":163,"MATH":164,"**":165,"SHIFT":166,"COMPARE":167,"&":168,"^":169,"|":170,"&&":171,"||":172,"BIN?":173,"RELATION":174,"COMPOUND_ASSIGN":175,"$accept":0,"$end":1},
	terminals_: {2:"error",6:"TERMINATOR",12:"STATEMENT",28:"YIELD",29:"FROM",31:"INDENT",32:"OUTDENT",34:"IDENTIFIER",36:"PROPERTY",38:"NUMBER",40:"STRING",41:"STRING_START",42:"STRING_END",44:"REGEX",45:"REGEX_START",46:"REGEX_END",48:"JS",49:"UNDEFINED",50:"NULL",51:"BOOL",52:"INFINITY",53:"NAN",55:"=",58:":",61:"RETURN",63:"HERECOMMENT",64:"PARAM_START",66:"PARAM_END",68:"->",69:"=>",71:",",74:"...",82:".",83:"?.",84:"::",85:"?::",87:"INDEX_START",89:"INDEX_END",90:"INDEX_SOAK",92:"{",94:"}",95:"CLASS",96:"EXTENDS",97:"IMPORT",102:"AS",103:"DEFAULT",104:"IMPORT_ALL",105:"EXPORT",107:"EXPORT_ALL",112:"SUPER",113:"FUNC_EXIST",114:"CALL_START",115:"CALL_END",117:"THIS",118:"@",119:"[",120:"]",122:"..",125:"TRY",127:"FINALLY",128:"CATCH",129:"THROW",130:"(",131:")",133:"WHILE",134:"WHEN",135:"UNTIL",137:"LOOP",139:"FOR",140:"BY",144:"OWN",146:"FORIN",147:"FOROF",148:"FORFROM",149:"SWITCH",151:"ELSE",153:"LEADING_WHEN",155:"IF",156:"POST_IF",157:"UNARY",158:"UNARY_MATH",159:"-",160:"+",161:"--",162:"++",163:"?",164:"MATH",165:"**",166:"SHIFT",167:"COMPARE",168:"&",169:"^",170:"|",171:"&&",172:"||",173:"BIN?",174:"RELATION",175:"COMPOUND_ASSIGN"},
	productions_: [0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[5,1],[8,1],[8,1],[8,1],[8,1],[8,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[27,1],[27,2],[27,3],[30,2],[30,3],[33,1],[35,1],[37,1],[37,1],[39,1],[39,3],[43,1],[43,3],[47,1],[47,1],[47,1],[47,1],[47,1],[47,1],[47,1],[47,1],[19,3],[19,4],[19,5],[56,1],[56,3],[56,5],[56,3],[56,5],[56,1],[59,1],[59,1],[59,1],[57,1],[57,1],[10,2],[10,4],[10,1],[9,3],[9,2],[11,1],[17,5],[17,2],[67,1],[67,1],[70,0],[70,1],[65,0],[65,1],[65,3],[65,4],[65,6],[72,1],[72,2],[72,3],[72,1],[73,1],[73,1],[73,1],[73,1],[76,2],[77,1],[77,2],[77,2],[77,1],[54,1],[54,1],[54,1],[15,1],[15,1],[15,1],[15,1],[15,1],[78,2],[78,2],[78,2],[78,2],[78,1],[78,1],[86,3],[86,2],[88,1],[88,1],[62,4],[93,0],[93,1],[93,3],[93,4],[93,6],[25,1],[25,2],[25,3],[25,4],[25,2],[25,3],[25,4],[25,5],[13,2],[13,4],[13,4],[13,5],[13,7],[13,6],[13,9],[100,1],[100,3],[100,4],[100,4],[100,6],[101,1],[101,3],[101,1],[101,3],[98,1],[99,3],[14,3],[14,5],[14,2],[14,4],[14,5],[14,6],[14,3],[14,4],[14,7],[106,1],[106,3],[106,4],[106,4],[106,6],[108,1],[108,3],[108,3],[108,1],[108,3],[16,3],[16,3],[16,3],[16,1],[111,1],[111,2],[109,0],[109,1],[110,2],[110,4],[81,1],[81,1],[60,2],[75,2],[75,4],[121,1],[121,1],[80,5],[91,3],[91,2],[91,2],[91,1],[116,1],[116,3],[116,4],[116,4],[116,6],[123,1],[123,1],[123,1],[124,1],[124,3],[21,2],[21,3],[21,4],[21,5],[126,3],[126,3],[126,2],[26,2],[79,3],[79,5],[132,2],[132,4],[132,2],[132,4],[22,2],[22,2],[22,2],[22,1],[136,2],[136,2],[23,2],[23,2],[23,2],[138,2],[138,4],[138,2],[141,2],[141,3],[145,1],[145,1],[145,1],[145,1],[143,1],[143,3],[142,2],[142,2],[142,4],[142,4],[142,4],[142,6],[142,6],[142,2],[142,4],[24,5],[24,7],[24,4],[24,6],[150,1],[150,2],[152,3],[152,4],[154,3],[154,5],[20,1],[20,3],[20,3],[20,3],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,2],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,3],[18,5],[18,4],[18,3]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */

	var $0 = $$.length - 1;
	switch (yystate) {
	case 1:
	return this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Block);
	break;
	case 2:
	return this.$ = $$[$0];
	break;
	case 3:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(yy.Block.wrap([$$[$0]]));
	break;
	case 4:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].push($$[$0]));
	break;
	case 5:
	this.$ = $$[$0-1];
	break;
	case 6: case 7: case 8: case 9: case 10: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23: case 24: case 25: case 26: case 35: case 40: case 42: case 56: case 57: case 58: case 59: case 60: case 61: case 72: case 73: case 83: case 84: case 85: case 86: case 91: case 92: case 95: case 99: case 105: case 164: case 188: case 189: case 191: case 221: case 222: case 240: case 246:
	this.$ = $$[$0];
	break;
	case 11:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.StatementLiteral($$[$0]));
	break;
	case 27:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Op($$[$0], new yy.Value(new yy.Literal(''))));
	break;
	case 28: case 250: case 251:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op($$[$0-1], $$[$0]));
	break;
	case 29:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op($$[$0-2].concat($$[$0-1]), $$[$0]));
	break;
	case 30:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Block);
	break;
	case 31: case 106:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-1]);
	break;
	case 32:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.IdentifierLiteral($$[$0]));
	break;
	case 33:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.PropertyName($$[$0]));
	break;
	case 34:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.NumberLiteral($$[$0]));
	break;
	case 36:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.StringLiteral($$[$0]));
	break;
	case 37:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.StringWithInterpolations($$[$0-1]));
	break;
	case 38:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.RegexLiteral($$[$0]));
	break;
	case 39:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.RegexWithInterpolations($$[$0-1].args));
	break;
	case 41:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.PassthroughLiteral($$[$0]));
	break;
	case 43:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.UndefinedLiteral);
	break;
	case 44:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.NullLiteral);
	break;
	case 45:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.BooleanLiteral($$[$0]));
	break;
	case 46:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.InfinityLiteral($$[$0]));
	break;
	case 47:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.NaNLiteral);
	break;
	case 48:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign($$[$0-2], $$[$0]));
	break;
	case 49:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Assign($$[$0-3], $$[$0]));
	break;
	case 50:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign($$[$0-4], $$[$0-1]));
	break;
	case 51: case 88: case 93: case 94: case 96: case 97: case 98: case 223: case 224:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Value($$[$0]));
	break;
	case 52:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])), $$[$0], 'object', {
	          operatorToken: yy.addLocationDataFn(_$[$0-1])(new yy.Literal($$[$0-1]))
	        }));
	break;
	case 53:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-4])(new yy.Value($$[$0-4])), $$[$0-1], 'object', {
	          operatorToken: yy.addLocationDataFn(_$[$0-3])(new yy.Literal($$[$0-3]))
	        }));
	break;
	case 54:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])), $$[$0], null, {
	          operatorToken: yy.addLocationDataFn(_$[$0-1])(new yy.Literal($$[$0-1]))
	        }));
	break;
	case 55:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-4])(new yy.Value($$[$0-4])), $$[$0-1], null, {
	          operatorToken: yy.addLocationDataFn(_$[$0-3])(new yy.Literal($$[$0-3]))
	        }));
	break;
	case 62:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Return($$[$0]));
	break;
	case 63:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Return(new yy.Value($$[$0-1])));
	break;
	case 64:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Return);
	break;
	case 65:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.YieldReturn($$[$0]));
	break;
	case 66:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.YieldReturn);
	break;
	case 67:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Comment($$[$0]));
	break;
	case 68:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Code($$[$0-3], $$[$0], $$[$0-1]));
	break;
	case 69:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Code([], $$[$0], $$[$0-1]));
	break;
	case 70:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('func');
	break;
	case 71:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('boundfunc');
	break;
	case 74: case 111:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])([]);
	break;
	case 75: case 112: case 131: case 151: case 183: case 225:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])([$$[$0]]);
	break;
	case 76: case 113: case 132: case 152: case 184:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].concat($$[$0]));
	break;
	case 77: case 114: case 133: case 153: case 185:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])($$[$0-3].concat($$[$0]));
	break;
	case 78: case 115: case 135: case 155: case 187:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])($$[$0-5].concat($$[$0-2]));
	break;
	case 79:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Param($$[$0]));
	break;
	case 80:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Param($$[$0-1], null, true));
	break;
	case 81:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Param($$[$0-2], $$[$0]));
	break;
	case 82: case 190:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Expansion);
	break;
	case 87:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Splat($$[$0-1]));
	break;
	case 89:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].add($$[$0]));
	break;
	case 90:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Value($$[$0-1], [].concat($$[$0])));
	break;
	case 100:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Access($$[$0]));
	break;
	case 101:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Access($$[$0], 'soak'));
	break;
	case 102:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Access(new yy.PropertyName('prototype'))), yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))]);
	break;
	case 103:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Access(new yy.PropertyName('prototype'), 'soak')), yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))]);
	break;
	case 104:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Access(new yy.PropertyName('prototype')));
	break;
	case 107:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(yy.extend($$[$0], {
	          soak: true
	        }));
	break;
	case 108:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Index($$[$0]));
	break;
	case 109:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Slice($$[$0]));
	break;
	case 110:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Obj($$[$0-2], $$[$0-3].generated));
	break;
	case 116:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Class);
	break;
	case 117:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Class(null, null, $$[$0]));
	break;
	case 118:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Class(null, $$[$0]));
	break;
	case 119:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Class(null, $$[$0-1], $$[$0]));
	break;
	case 120:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Class($$[$0]));
	break;
	case 121:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Class($$[$0-1], null, $$[$0]));
	break;
	case 122:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Class($$[$0-2], $$[$0]));
	break;
	case 123:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Class($$[$0-3], $$[$0-1], $$[$0]));
	break;
	case 124:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.ImportDeclaration(null, $$[$0]));
	break;
	case 125:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.ImportDeclaration(new yy.ImportClause($$[$0-2], null), $$[$0]));
	break;
	case 126:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.ImportDeclaration(new yy.ImportClause(null, $$[$0-2]), $$[$0]));
	break;
	case 127:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.ImportDeclaration(new yy.ImportClause(null, new yy.ImportSpecifierList([])), $$[$0]));
	break;
	case 128:
	this.$ = yy.addLocationDataFn(_$[$0-6], _$[$0])(new yy.ImportDeclaration(new yy.ImportClause(null, new yy.ImportSpecifierList($$[$0-4])), $$[$0]));
	break;
	case 129:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])(new yy.ImportDeclaration(new yy.ImportClause($$[$0-4], $$[$0-2]), $$[$0]));
	break;
	case 130:
	this.$ = yy.addLocationDataFn(_$[$0-8], _$[$0])(new yy.ImportDeclaration(new yy.ImportClause($$[$0-7], new yy.ImportSpecifierList($$[$0-4])), $$[$0]));
	break;
	case 134: case 154: case 170: case 186:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])($$[$0-2]);
	break;
	case 136:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.ImportSpecifier($$[$0]));
	break;
	case 137:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ImportSpecifier($$[$0-2], $$[$0]));
	break;
	case 138:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.ImportSpecifier(new yy.Literal($$[$0])));
	break;
	case 139:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ImportSpecifier(new yy.Literal($$[$0-2]), $$[$0]));
	break;
	case 140:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.ImportDefaultSpecifier($$[$0]));
	break;
	case 141:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ImportNamespaceSpecifier(new yy.Literal($$[$0-2]), $$[$0]));
	break;
	case 142:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ExportNamedDeclaration(new yy.ExportSpecifierList([])));
	break;
	case 143:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.ExportNamedDeclaration(new yy.ExportSpecifierList($$[$0-2])));
	break;
	case 144:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.ExportNamedDeclaration($$[$0]));
	break;
	case 145:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.ExportNamedDeclaration(new yy.Assign($$[$0-2], $$[$0], null, {
	          moduleDeclaration: 'export'
	        })));
	break;
	case 146:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.ExportNamedDeclaration(new yy.Assign($$[$0-3], $$[$0], null, {
	          moduleDeclaration: 'export'
	        })));
	break;
	case 147:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])(new yy.ExportNamedDeclaration(new yy.Assign($$[$0-4], $$[$0-1], null, {
	          moduleDeclaration: 'export'
	        })));
	break;
	case 148:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ExportDefaultDeclaration($$[$0]));
	break;
	case 149:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.ExportAllDeclaration(new yy.Literal($$[$0-2]), $$[$0]));
	break;
	case 150:
	this.$ = yy.addLocationDataFn(_$[$0-6], _$[$0])(new yy.ExportNamedDeclaration(new yy.ExportSpecifierList($$[$0-4]), $$[$0]));
	break;
	case 156:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.ExportSpecifier($$[$0]));
	break;
	case 157:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ExportSpecifier($$[$0-2], $$[$0]));
	break;
	case 158:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ExportSpecifier($$[$0-2], new yy.Literal($$[$0])));
	break;
	case 159:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.ExportSpecifier(new yy.Literal($$[$0])));
	break;
	case 160:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.ExportSpecifier(new yy.Literal($$[$0-2]), $$[$0]));
	break;
	case 161:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.TaggedTemplateCall($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 162: case 163:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Call($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 165:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.SuperCall);
	break;
	case 166:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.SuperCall($$[$0]));
	break;
	case 167:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(false);
	break;
	case 168:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(true);
	break;
	case 169:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([]);
	break;
	case 171: case 172:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Value(new yy.ThisLiteral));
	break;
	case 173:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Value(yy.addLocationDataFn(_$[$0-1])(new yy.ThisLiteral), [yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))], 'this'));
	break;
	case 174:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Arr([]));
	break;
	case 175:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Arr($$[$0-2]));
	break;
	case 176:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('inclusive');
	break;
	case 177:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('exclusive');
	break;
	case 178:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Range($$[$0-3], $$[$0-1], $$[$0-2]));
	break;
	case 179:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Range($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 180:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Range($$[$0-1], null, $$[$0]));
	break;
	case 181:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Range(null, $$[$0], $$[$0-1]));
	break;
	case 182:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Range(null, null, $$[$0]));
	break;
	case 192:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([].concat($$[$0-2], $$[$0]));
	break;
	case 193:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Try($$[$0]));
	break;
	case 194:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Try($$[$0-1], $$[$0][0], $$[$0][1]));
	break;
	case 195:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Try($$[$0-2], null, null, $$[$0]));
	break;
	case 196:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Try($$[$0-3], $$[$0-2][0], $$[$0-2][1], $$[$0]));
	break;
	case 197:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([$$[$0-1], $$[$0]]);
	break;
	case 198:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Value($$[$0-1])), $$[$0]]);
	break;
	case 199:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([null, $$[$0]]);
	break;
	case 200:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Throw($$[$0]));
	break;
	case 201:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Parens($$[$0-1]));
	break;
	case 202:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Parens($$[$0-2]));
	break;
	case 203:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While($$[$0]));
	break;
	case 204:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.While($$[$0-2], {
	          guard: $$[$0]
	        }));
	break;
	case 205:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While($$[$0], {
	          invert: true
	        }));
	break;
	case 206:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.While($$[$0-2], {
	          invert: true,
	          guard: $$[$0]
	        }));
	break;
	case 207:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].addBody($$[$0]));
	break;
	case 208: case 209:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0].addBody(yy.addLocationDataFn(_$[$0-1])(yy.Block.wrap([$$[$0-1]]))));
	break;
	case 210:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])($$[$0]);
	break;
	case 211:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While(yy.addLocationDataFn(_$[$0-1])(new yy.BooleanLiteral('true'))).addBody($$[$0]));
	break;
	case 212:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While(yy.addLocationDataFn(_$[$0-1])(new yy.BooleanLiteral('true'))).addBody(yy.addLocationDataFn(_$[$0])(yy.Block.wrap([$$[$0]]))));
	break;
	case 213: case 214:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.For($$[$0-1], $$[$0]));
	break;
	case 215:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.For($$[$0], $$[$0-1]));
	break;
	case 216:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: yy.addLocationDataFn(_$[$0])(new yy.Value($$[$0]))
	        });
	break;
	case 217:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])),
	          step: $$[$0]
	        });
	break;
	case 218:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])((function () {
	        $$[$0].own = $$[$0-1].own;
	        $$[$0].ownTag = $$[$0-1].ownTag;
	        $$[$0].name = $$[$0-1][0];
	        $$[$0].index = $$[$0-1][1];
	        return $$[$0];
	      }()));
	break;
	case 219:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0]);
	break;
	case 220:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])((function () {
	        $$[$0].own = true;
	        $$[$0].ownTag = yy.addLocationDataFn(_$[$0-1])(new yy.Literal($$[$0-1]));
	        return $$[$0];
	      }()));
	break;
	case 226:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([$$[$0-2], $$[$0]]);
	break;
	case 227:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: $$[$0]
	        });
	break;
	case 228:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: $$[$0],
	          object: true
	        });
	break;
	case 229:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          guard: $$[$0]
	        });
	break;
	case 230:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          guard: $$[$0],
	          object: true
	        });
	break;
	case 231:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          step: $$[$0]
	        });
	break;
	case 232:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])({
	          source: $$[$0-4],
	          guard: $$[$0-2],
	          step: $$[$0]
	        });
	break;
	case 233:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])({
	          source: $$[$0-4],
	          step: $$[$0-2],
	          guard: $$[$0]
	        });
	break;
	case 234:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: $$[$0],
	          from: true
	        });
	break;
	case 235:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          guard: $$[$0],
	          from: true
	        });
	break;
	case 236:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Switch($$[$0-3], $$[$0-1]));
	break;
	case 237:
	this.$ = yy.addLocationDataFn(_$[$0-6], _$[$0])(new yy.Switch($$[$0-5], $$[$0-3], $$[$0-1]));
	break;
	case 238:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Switch(null, $$[$0-1]));
	break;
	case 239:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])(new yy.Switch(null, $$[$0-3], $$[$0-1]));
	break;
	case 241:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].concat($$[$0]));
	break;
	case 242:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([[$$[$0-1], $$[$0]]]);
	break;
	case 243:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])([[$$[$0-2], $$[$0-1]]]);
	break;
	case 244:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0-1], $$[$0], {
	          type: $$[$0-2]
	        }));
	break;
	case 245:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])($$[$0-4].addElse(yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0-1], $$[$0], {
	          type: $$[$0-2]
	        }))));
	break;
	case 247:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].addElse($$[$0]));
	break;
	case 248: case 249:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0], yy.addLocationDataFn(_$[$0-2])(yy.Block.wrap([$$[$0-2]])), {
	          type: $$[$0-1],
	          statement: true
	        }));
	break;
	case 252:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('-', $$[$0]));
	break;
	case 253:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('+', $$[$0]));
	break;
	case 254:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('--', $$[$0]));
	break;
	case 255:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('++', $$[$0]));
	break;
	case 256:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('--', $$[$0-1], null, true));
	break;
	case 257:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('++', $$[$0-1], null, true));
	break;
	case 258:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Existence($$[$0-1]));
	break;
	case 259:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op('+', $$[$0-2], $$[$0]));
	break;
	case 260:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op('-', $$[$0-2], $$[$0]));
	break;
	case 261: case 262: case 263: case 264: case 265: case 266: case 267: case 268: case 269: case 270:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op($$[$0-1], $$[$0-2], $$[$0]));
	break;
	case 271:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])((function () {
	        if ($$[$0-1].charAt(0) === '!') {
	          return new yy.Op($$[$0-1].slice(1), $$[$0-2], $$[$0]).invert();
	        } else {
	          return new yy.Op($$[$0-1], $$[$0-2], $$[$0]);
	        }
	      }()));
	break;
	case 272:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 273:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign($$[$0-4], $$[$0-1], $$[$0-3]));
	break;
	case 274:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Assign($$[$0-3], $$[$0], $$[$0-2]));
	break;
	case 275:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Extends($$[$0-2], $$[$0]));
	break;
	}
	},
	table: [{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:6,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{1:[3]},{1:[2,2],6:$VG},o($VH,[2,3]),o($VH,[2,6],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VH,[2,7],{141:77,132:105,138:106,133:$Vu,135:$Vv,139:$Vx,156:$VX}),o($VH,[2,8]),o($VY,[2,14],{109:107,78:108,86:114,40:$VZ,41:$VZ,114:$VZ,82:$V_,83:$V$,84:$V01,85:$V11,87:$V21,90:$V31,113:$V41}),o($VY,[2,15],{86:114,109:117,78:118,82:$V_,83:$V$,84:$V01,85:$V11,87:$V21,90:$V31,113:$V41,114:$VZ}),o($VY,[2,16]),o($VY,[2,17]),o($VY,[2,18]),o($VY,[2,19]),o($VY,[2,20]),o($VY,[2,21]),o($VY,[2,22]),o($VY,[2,23]),o($VY,[2,24]),o($VY,[2,25]),o($VY,[2,26]),o($V51,[2,9]),o($V51,[2,10]),o($V51,[2,11]),o($V51,[2,12]),o($V51,[2,13]),o([1,6,32,42,131,133,135,139,156,163,164,165,166,167,168,169,170,171,172,173,174],$V61,{15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,10:20,11:21,13:23,14:24,54:26,47:27,79:28,80:29,81:30,111:31,67:33,77:40,154:41,132:43,136:44,138:45,75:53,62:54,37:55,43:57,33:70,60:71,141:77,39:80,7:120,8:122,12:$V0,28:$V71,29:$V81,34:$V2,38:$V3,40:$V4,41:$V5,44:$V6,45:$V7,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,61:[1,119],63:$Vf,64:$Vg,68:$Vh,69:$Vi,92:$Vj,95:$Vk,97:$Vl,105:$Vm,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,137:$Vw,149:$Vy,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF}),o($V91,$Va1,{55:[1,124]}),o($V91,[2,96]),o($V91,[2,97]),o($V91,[2,98]),o($V91,[2,99]),o($Vb1,[2,164]),o([6,31,66,71],$Vc1,{65:125,72:126,73:127,33:129,60:130,75:131,62:132,34:$V2,74:$Vd1,92:$Vj,118:$Ve1,119:$Vf1}),{30:135,31:$Vg1},{7:137,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:138,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:139,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:140,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{15:142,16:143,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:144,60:71,62:54,75:53,77:141,79:28,80:29,81:30,92:$Vj,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,130:$Vt},{15:142,16:143,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:144,60:71,62:54,75:53,77:145,79:28,80:29,81:30,92:$Vj,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,130:$Vt},o($Vh1,$Vi1,{96:[1,149],161:[1,146],162:[1,147],175:[1,148]}),o($VY,[2,246],{151:[1,150]}),{30:151,31:$Vg1},{30:152,31:$Vg1},o($VY,[2,210]),{30:153,31:$Vg1},{7:154,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:[1,155],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($Vj1,[2,116],{47:27,79:28,80:29,81:30,111:31,75:53,62:54,37:55,43:57,33:70,60:71,39:80,15:142,16:143,54:144,30:156,77:158,31:$Vg1,34:$V2,38:$V3,40:$V4,41:$V5,44:$V6,45:$V7,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,92:$Vj,96:[1,157],112:$Vn,117:$Vo,118:$Vp,119:$Vq,130:$Vt}),{7:159,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($V51,$Vk1,{15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,10:20,11:21,13:23,14:24,54:26,47:27,79:28,80:29,81:30,111:31,67:33,77:40,154:41,132:43,136:44,138:45,75:53,62:54,37:55,43:57,33:70,60:71,141:77,39:80,8:122,7:160,12:$V0,28:$V71,31:$Vl1,34:$V2,38:$V3,40:$V4,41:$V5,44:$V6,45:$V7,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,61:$Ve,63:$Vf,64:$Vg,68:$Vh,69:$Vi,92:$Vj,95:$Vk,97:$Vl,105:$Vm,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,137:$Vw,149:$Vy,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF}),o([1,6,31,32,42,71,94,131,133,135,139,156],[2,67]),{33:166,34:$V2,39:162,40:$V4,41:$V5,92:[1,165],98:163,99:164,104:$Vm1},{25:169,33:170,34:$V2,92:[1,168],95:$Vk,103:[1,171],107:[1,172]},o($Vh1,[2,93]),o($Vh1,[2,94]),o($V91,[2,40]),o($V91,[2,41]),o($V91,[2,42]),o($V91,[2,43]),o($V91,[2,44]),o($V91,[2,45]),o($V91,[2,46]),o($V91,[2,47]),{4:173,5:3,7:4,8:5,9:6,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V1,31:[1,174],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:175,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:$Vn1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,74:$Vo1,75:53,76:180,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,116:177,117:$Vo,118:$Vp,119:$Vq,120:$Vp1,123:178,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($V91,[2,171]),o($V91,[2,172],{35:182,36:$Vq1}),o([1,6,31,32,42,46,66,71,74,82,83,84,85,87,89,90,94,113,115,120,122,131,133,134,135,139,140,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],[2,165],{110:184,114:$Vr1}),{31:[2,70]},{31:[2,71]},o($Vs1,[2,88]),o($Vs1,[2,91]),{7:186,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:187,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:188,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:190,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,30:189,31:$Vg1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{33:195,34:$V2,60:196,62:198,75:197,80:191,92:$Vj,118:$Ve1,119:$Vq,143:192,144:[1,193],145:194},{142:199,146:[1,200],147:[1,201],148:[1,202]},o([6,31,71,94],$Vt1,{39:80,93:203,56:204,57:205,59:206,11:207,37:208,33:209,35:210,60:211,34:$V2,36:$Vq1,38:$V3,40:$V4,41:$V5,63:$Vf,118:$Ve1}),o($Vu1,[2,34]),o($Vu1,[2,35]),o($V91,[2,38]),{15:142,16:212,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:144,60:71,62:54,75:53,77:213,79:28,80:29,81:30,92:$Vj,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,130:$Vt},o([1,6,29,31,32,40,41,42,55,58,66,71,74,82,83,84,85,87,89,90,94,96,102,113,114,115,120,122,131,133,134,135,139,140,146,147,148,156,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175],[2,32]),o($Vv1,[2,36]),{4:214,5:3,7:4,8:5,9:6,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VH,[2,5],{7:4,8:5,9:6,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,10:20,11:21,13:23,14:24,54:26,47:27,79:28,80:29,81:30,111:31,67:33,77:40,154:41,132:43,136:44,138:45,75:53,62:54,37:55,43:57,33:70,60:71,141:77,39:80,5:215,12:$V0,28:$V1,34:$V2,38:$V3,40:$V4,41:$V5,44:$V6,45:$V7,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,61:$Ve,63:$Vf,64:$Vg,68:$Vh,69:$Vi,92:$Vj,95:$Vk,97:$Vl,105:$Vm,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,133:$Vu,135:$Vv,137:$Vw,139:$Vx,149:$Vy,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF}),o($VY,[2,258]),{7:216,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:217,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:218,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:219,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:220,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:221,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:222,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:223,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:224,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:225,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:226,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:227,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:228,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:229,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VY,[2,209]),o($VY,[2,214]),{7:230,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VY,[2,208]),o($VY,[2,213]),{39:231,40:$V4,41:$V5,110:232,114:$Vr1},o($Vs1,[2,89]),o($Vw1,[2,168]),{35:233,36:$Vq1},{35:234,36:$Vq1},o($Vs1,[2,104],{35:235,36:$Vq1}),{35:236,36:$Vq1},o($Vs1,[2,105]),{7:238,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,74:$Vx1,75:53,77:40,79:28,80:29,81:30,88:237,91:239,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,121:240,122:$Vy1,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{86:243,87:$V21,90:$V31},{110:244,114:$Vr1},o($Vs1,[2,90]),o($VH,[2,66],{15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,10:20,11:21,13:23,14:24,54:26,47:27,79:28,80:29,81:30,111:31,67:33,77:40,154:41,132:43,136:44,138:45,75:53,62:54,37:55,43:57,33:70,60:71,141:77,39:80,8:122,7:245,12:$V0,28:$V71,31:$Vl1,34:$V2,38:$V3,40:$V4,41:$V5,44:$V6,45:$V7,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,61:$Ve,63:$Vf,64:$Vg,68:$Vh,69:$Vi,92:$Vj,95:$Vk,97:$Vl,105:$Vm,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,133:$Vk1,135:$Vk1,139:$Vk1,156:$Vk1,137:$Vw,149:$Vy,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF}),o($Vz1,[2,28],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{7:246,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{132:105,133:$Vu,135:$Vv,138:106,139:$Vx,141:77,156:$VX},o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,163,164,165,166,167,168,169,170,171,172,173,174],$V61,{15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,10:20,11:21,13:23,14:24,54:26,47:27,79:28,80:29,81:30,111:31,67:33,77:40,154:41,132:43,136:44,138:45,75:53,62:54,37:55,43:57,33:70,60:71,141:77,39:80,7:120,8:122,12:$V0,28:$V71,29:$V81,34:$V2,38:$V3,40:$V4,41:$V5,44:$V6,45:$V7,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,61:$Ve,63:$Vf,64:$Vg,68:$Vh,69:$Vi,92:$Vj,95:$Vk,97:$Vl,105:$Vm,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,137:$Vw,149:$Vy,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF}),{6:[1,248],7:247,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:[1,249],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o([6,31],$VA1,{70:252,66:[1,250],71:$VB1}),o($VC1,[2,75]),o($VC1,[2,79],{55:[1,254],74:[1,253]}),o($VC1,[2,82]),o($VD1,[2,83]),o($VD1,[2,84]),o($VD1,[2,85]),o($VD1,[2,86]),{35:182,36:$Vq1},{7:255,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:$Vn1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,74:$Vo1,75:53,76:180,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,116:177,117:$Vo,118:$Vp,119:$Vq,120:$Vp1,123:178,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VY,[2,69]),{4:257,5:3,7:4,8:5,9:6,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V1,32:[1,256],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,159,160,164,165,166,167,168,169,170,171,172,173,174],[2,250],{141:77,132:102,138:103,163:$VL}),o($VE1,[2,251],{141:77,132:102,138:103,163:$VL,165:$VN}),o($VE1,[2,252],{141:77,132:102,138:103,163:$VL,165:$VN}),o($VE1,[2,253],{141:77,132:102,138:103,163:$VL,165:$VN}),o($VY,[2,254],{40:$Vi1,41:$Vi1,82:$Vi1,83:$Vi1,84:$Vi1,85:$Vi1,87:$Vi1,90:$Vi1,113:$Vi1,114:$Vi1}),o($Vw1,$VZ,{109:107,78:108,86:114,82:$V_,83:$V$,84:$V01,85:$V11,87:$V21,90:$V31,113:$V41}),{78:118,82:$V_,83:$V$,84:$V01,85:$V11,86:114,87:$V21,90:$V31,109:117,113:$V41,114:$VZ},o($VF1,$Va1),o($VY,[2,255],{40:$Vi1,41:$Vi1,82:$Vi1,83:$Vi1,84:$Vi1,85:$Vi1,87:$Vi1,90:$Vi1,113:$Vi1,114:$Vi1}),o($VY,[2,256]),o($VY,[2,257]),{6:[1,260],7:258,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:[1,259],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:261,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{30:262,31:$Vg1,155:[1,263]},o($VY,[2,193],{126:264,127:[1,265],128:[1,266]}),o($VY,[2,207]),o($VY,[2,215]),{31:[1,267],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},{150:268,152:269,153:$VG1},o($VY,[2,117]),{7:271,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($Vj1,[2,120],{30:272,31:$Vg1,40:$Vi1,41:$Vi1,82:$Vi1,83:$Vi1,84:$Vi1,85:$Vi1,87:$Vi1,90:$Vi1,113:$Vi1,114:$Vi1,96:[1,273]}),o($Vz1,[2,200],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($V51,$VH1,{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{62:274,92:$Vj},o($V51,[2,124]),{29:[1,275],71:[1,276]},{29:[1,277]},{31:$VI1,33:282,34:$V2,94:[1,278],100:279,101:280,103:$VJ1},o([29,71],[2,140]),{102:[1,284]},{31:$VK1,33:289,34:$V2,94:[1,285],103:$VL1,106:286,108:287},o($V51,[2,144]),{55:[1,291]},{7:292,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{29:[1,293]},{6:$VG,131:[1,294]},{4:295,5:3,7:4,8:5,9:6,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o([6,31,71,120],$VM1,{141:77,132:102,138:103,121:296,74:[1,297],122:$Vy1,133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VN1,[2,174]),o([6,31,120],$VA1,{70:298,71:$VO1}),o($VP1,[2,183]),{7:255,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:$Vn1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,74:$Vo1,75:53,76:180,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,116:300,117:$Vo,118:$Vp,119:$Vq,123:178,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VP1,[2,189]),o($VP1,[2,190]),o($VQ1,[2,173]),o($VQ1,[2,33]),o($Vb1,[2,166]),{7:255,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:$Vn1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,74:$Vo1,75:53,76:180,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,115:[1,301],116:302,117:$Vo,118:$Vp,119:$Vq,123:178,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{30:303,31:$Vg1,132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},o($VR1,[2,203],{141:77,132:102,138:103,133:$Vu,134:[1,304],135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VR1,[2,205],{141:77,132:102,138:103,133:$Vu,134:[1,305],135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VY,[2,211]),o($VS1,[2,212],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,156,159,160,163,164,165,166,167,168,169,170,171,172,173,174],[2,216],{140:[1,306]}),o($VT1,[2,219]),{33:195,34:$V2,60:196,62:198,75:197,92:$Vj,118:$Ve1,119:$Vf1,143:307,145:194},o($VT1,[2,225],{71:[1,308]}),o($VU1,[2,221]),o($VU1,[2,222]),o($VU1,[2,223]),o($VU1,[2,224]),o($VY,[2,218]),{7:309,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:310,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:311,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VV1,$VA1,{70:312,71:$VW1}),o($VX1,[2,112]),o($VX1,[2,51],{58:[1,314]}),o($VY1,[2,60],{55:[1,315]}),o($VX1,[2,56]),o($VY1,[2,61]),o($VZ1,[2,57]),o($VZ1,[2,58]),o($VZ1,[2,59]),{46:[1,316],78:118,82:$V_,83:$V$,84:$V01,85:$V11,86:114,87:$V21,90:$V31,109:117,113:$V41,114:$VZ},o($VF1,$Vi1),{6:$VG,42:[1,317]},o($VH,[2,4]),o($V_1,[2,259],{141:77,132:102,138:103,163:$VL,164:$VM,165:$VN}),o($V_1,[2,260],{141:77,132:102,138:103,163:$VL,164:$VM,165:$VN}),o($VE1,[2,261],{141:77,132:102,138:103,163:$VL,165:$VN}),o($VE1,[2,262],{141:77,132:102,138:103,163:$VL,165:$VN}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,166,167,168,169,170,171,172,173,174],[2,263],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,167,168,169,170,171,172,173],[2,264],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,168,169,170,171,172,173],[2,265],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,169,170,171,172,173],[2,266],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,170,171,172,173],[2,267],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,171,172,173],[2,268],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,172,173],[2,269],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,173],[2,270],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,174:$VW}),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,140,156,167,168,169,170,171,172,173,174],[2,271],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO}),o($VS1,[2,249],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VS1,[2,248],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vb1,[2,161]),o($Vb1,[2,162]),o($Vs1,[2,100]),o($Vs1,[2,101]),o($Vs1,[2,102]),o($Vs1,[2,103]),{89:[1,318]},{74:$Vx1,89:[2,108],121:319,122:$Vy1,132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},{89:[2,109]},{7:320,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,89:[2,182],92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($V$1,[2,176]),o($V$1,$V02),o($Vs1,[2,107]),o($Vb1,[2,163]),o($VH,[2,65],{141:77,132:102,138:103,133:$VH1,135:$VH1,139:$VH1,156:$VH1,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vz1,[2,29],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vz1,[2,48],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{7:321,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:322,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{67:323,68:$Vh,69:$Vi},o($V12,$V22,{73:127,33:129,60:130,75:131,62:132,72:324,34:$V2,74:$Vd1,92:$Vj,118:$Ve1,119:$Vf1}),{6:$V32,31:$V42},o($VC1,[2,80]),{7:327,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VP1,$VM1,{141:77,132:102,138:103,74:[1,328],133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($V52,[2,30]),{6:$VG,32:[1,329]},o($Vz1,[2,272],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{7:330,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:331,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($Vz1,[2,275],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VY,[2,247]),{7:332,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VY,[2,194],{127:[1,333]}),{30:334,31:$Vg1},{30:337,31:$Vg1,33:335,34:$V2,62:336,92:$Vj},{150:338,152:269,153:$VG1},{32:[1,339],151:[1,340],152:341,153:$VG1},o($V62,[2,240]),{7:343,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,124:342,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($V72,[2,118],{141:77,132:102,138:103,30:344,31:$Vg1,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VY,[2,121]),{7:345,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{32:[1,346]},{39:347,40:$V4,41:$V5},{92:[1,349],99:348,104:$Vm1},{39:350,40:$V4,41:$V5},{29:[1,351]},o($VV1,$VA1,{70:352,71:$V82}),o($VX1,[2,131]),{31:$VI1,33:282,34:$V2,100:354,101:280,103:$VJ1},o($VX1,[2,136],{102:[1,355]}),o($VX1,[2,138],{102:[1,356]}),{33:357,34:$V2},o($V51,[2,142]),o($VV1,$VA1,{70:358,71:$V92}),o($VX1,[2,151]),{31:$VK1,33:289,34:$V2,103:$VL1,106:360,108:287},o($VX1,[2,156],{102:[1,361]}),o($VX1,[2,159],{102:[1,362]}),{6:[1,364],7:363,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:[1,365],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($Va2,[2,148],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{39:366,40:$V4,41:$V5},o($V91,[2,201]),{6:$VG,32:[1,367]},{7:368,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o([12,28,34,38,40,41,44,45,48,49,50,51,52,53,61,63,64,68,69,92,95,97,105,112,117,118,119,125,129,130,133,135,137,139,149,155,157,158,159,160,161,162],$V02,{6:$Vb2,31:$Vb2,71:$Vb2,120:$Vb2}),{6:$Vc2,31:$Vd2,120:[1,369]},o([6,31,32,115,120],$V22,{15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,10:20,11:21,13:23,14:24,54:26,47:27,79:28,80:29,81:30,111:31,67:33,77:40,154:41,132:43,136:44,138:45,75:53,62:54,37:55,43:57,33:70,60:71,141:77,39:80,8:122,76:180,7:255,123:372,12:$V0,28:$V71,34:$V2,38:$V3,40:$V4,41:$V5,44:$V6,45:$V7,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,61:$Ve,63:$Vf,64:$Vg,68:$Vh,69:$Vi,74:$Vo1,92:$Vj,95:$Vk,97:$Vl,105:$Vm,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,133:$Vu,135:$Vv,137:$Vw,139:$Vx,149:$Vy,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF}),o($V12,$VA1,{70:373,71:$VO1}),o($Vb1,[2,169]),o([6,31,115],$VA1,{70:374,71:$VO1}),o($Ve2,[2,244]),{7:375,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:376,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:377,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VT1,[2,220]),{33:195,34:$V2,60:196,62:198,75:197,92:$Vj,118:$Ve1,119:$Vf1,145:378},o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,135,139,156],[2,227],{141:77,132:102,138:103,134:[1,379],140:[1,380],159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vf2,[2,228],{141:77,132:102,138:103,134:[1,381],159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vf2,[2,234],{141:77,132:102,138:103,134:[1,382],159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{6:$Vg2,31:$Vh2,94:[1,383]},o($Vi2,$V22,{39:80,57:205,59:206,11:207,37:208,33:209,35:210,60:211,56:386,34:$V2,36:$Vq1,38:$V3,40:$V4,41:$V5,63:$Vf,118:$Ve1}),{7:387,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:[1,388],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:389,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:[1,390],33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($V91,[2,39]),o($Vv1,[2,37]),o($Vs1,[2,106]),{7:391,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,89:[2,180],92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{89:[2,181],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},o($Vz1,[2,49],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{32:[1,392],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},{30:393,31:$Vg1},o($VC1,[2,76]),{33:129,34:$V2,60:130,62:132,72:394,73:127,74:$Vd1,75:131,92:$Vj,118:$Ve1,119:$Vf1},o($Vj2,$Vc1,{72:126,73:127,33:129,60:130,75:131,62:132,65:395,34:$V2,74:$Vd1,92:$Vj,118:$Ve1,119:$Vf1}),o($VC1,[2,81],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VP1,$Vb2),o($V52,[2,31]),{32:[1,396],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},o($Vz1,[2,274],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{30:397,31:$Vg1,132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},{30:398,31:$Vg1},o($VY,[2,195]),{30:399,31:$Vg1},{30:400,31:$Vg1},o($Vk2,[2,199]),{32:[1,401],151:[1,402],152:341,153:$VG1},o($VY,[2,238]),{30:403,31:$Vg1},o($V62,[2,241]),{30:404,31:$Vg1,71:[1,405]},o($Vl2,[2,191],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VY,[2,119]),o($V72,[2,122],{141:77,132:102,138:103,30:406,31:$Vg1,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($V51,[2,63]),o($V51,[2,125]),{29:[1,407]},{31:$VI1,33:282,34:$V2,100:408,101:280,103:$VJ1},o($V51,[2,126]),{39:409,40:$V4,41:$V5},{6:$Vm2,31:$Vn2,94:[1,410]},o($Vi2,$V22,{33:282,101:413,34:$V2,103:$VJ1}),o($V12,$VA1,{70:414,71:$V82}),{33:415,34:$V2},{33:416,34:$V2},{29:[2,141]},{6:$Vo2,31:$Vp2,94:[1,417]},o($Vi2,$V22,{33:289,108:420,34:$V2,103:$VL1}),o($V12,$VA1,{70:421,71:$V92}),{33:422,34:$V2,103:[1,423]},{33:424,34:$V2},o($Va2,[2,145],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{7:425,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:426,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($V51,[2,149]),{131:[1,427]},{120:[1,428],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},o($VN1,[2,175]),{7:255,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,74:$Vo1,75:53,76:180,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,123:429,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:255,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,31:$Vn1,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,74:$Vo1,75:53,76:180,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,116:430,117:$Vo,118:$Vp,119:$Vq,123:178,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VP1,[2,184]),{6:$Vc2,31:$Vd2,32:[1,431]},{6:$Vc2,31:$Vd2,115:[1,432]},o($VS1,[2,204],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VS1,[2,206],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VS1,[2,217],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VT1,[2,226]),{7:433,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:434,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:435,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:436,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VN1,[2,110]),{11:207,33:209,34:$V2,35:210,36:$Vq1,37:208,38:$V3,39:80,40:$V4,41:$V5,56:437,57:205,59:206,60:211,63:$Vf,118:$Ve1},o($Vj2,$Vt1,{39:80,56:204,57:205,59:206,11:207,37:208,33:209,35:210,60:211,93:438,34:$V2,36:$Vq1,38:$V3,40:$V4,41:$V5,63:$Vf,118:$Ve1}),o($VX1,[2,113]),o($VX1,[2,52],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{7:439,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VX1,[2,54],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{7:440,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{89:[2,179],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},o($VY,[2,50]),o($VY,[2,68]),o($VC1,[2,77]),o($V12,$VA1,{70:441,71:$VB1}),o($VY,[2,273]),o($Ve2,[2,245]),o($VY,[2,196]),o($Vk2,[2,197]),o($Vk2,[2,198]),o($VY,[2,236]),{30:442,31:$Vg1},{32:[1,443]},o($V62,[2,242],{6:[1,444]}),{7:445,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},o($VY,[2,123]),{39:446,40:$V4,41:$V5},o($VV1,$VA1,{70:447,71:$V82}),o($V51,[2,127]),{29:[1,448]},{33:282,34:$V2,101:449,103:$VJ1},{31:$VI1,33:282,34:$V2,100:450,101:280,103:$VJ1},o($VX1,[2,132]),{6:$Vm2,31:$Vn2,32:[1,451]},o($VX1,[2,137]),o($VX1,[2,139]),o($V51,[2,143],{29:[1,452]}),{33:289,34:$V2,103:$VL1,108:453},{31:$VK1,33:289,34:$V2,103:$VL1,106:454,108:287},o($VX1,[2,152]),{6:$Vo2,31:$Vp2,32:[1,455]},o($VX1,[2,157]),o($VX1,[2,158]),o($VX1,[2,160]),o($Va2,[2,146],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),{32:[1,456],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},o($V91,[2,202]),o($V91,[2,178]),o($VP1,[2,185]),o($V12,$VA1,{70:457,71:$VO1}),o($VP1,[2,186]),o($Vb1,[2,170]),o([1,6,31,32,42,66,71,74,89,94,115,120,122,131,133,134,135,139,156],[2,229],{141:77,132:102,138:103,140:[1,458],159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vf2,[2,231],{141:77,132:102,138:103,134:[1,459],159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vz1,[2,230],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vz1,[2,235],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VX1,[2,114]),o($V12,$VA1,{70:460,71:$VW1}),{32:[1,461],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},{32:[1,462],132:102,133:$Vu,135:$Vv,138:103,139:$Vx,141:77,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW},{6:$V32,31:$V42,32:[1,463]},{32:[1,464]},o($VY,[2,239]),o($V62,[2,243]),o($Vl2,[2,192],{141:77,132:102,138:103,133:$Vu,135:$Vv,139:$Vx,156:$VI,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($V51,[2,129]),{6:$Vm2,31:$Vn2,94:[1,465]},{39:466,40:$V4,41:$V5},o($VX1,[2,133]),o($V12,$VA1,{70:467,71:$V82}),o($VX1,[2,134]),{39:468,40:$V4,41:$V5},o($VX1,[2,153]),o($V12,$VA1,{70:469,71:$V92}),o($VX1,[2,154]),o($V51,[2,147]),{6:$Vc2,31:$Vd2,32:[1,470]},{7:471,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{7:472,8:122,10:20,11:21,12:$V0,13:23,14:24,15:7,16:8,17:9,18:10,19:11,20:12,21:13,22:14,23:15,24:16,25:17,26:18,27:19,28:$V71,33:70,34:$V2,37:55,38:$V3,39:80,40:$V4,41:$V5,43:57,44:$V6,45:$V7,47:27,48:$V8,49:$V9,50:$Va,51:$Vb,52:$Vc,53:$Vd,54:26,60:71,61:$Ve,62:54,63:$Vf,64:$Vg,67:33,68:$Vh,69:$Vi,75:53,77:40,79:28,80:29,81:30,92:$Vj,95:$Vk,97:$Vl,105:$Vm,111:31,112:$Vn,117:$Vo,118:$Vp,119:$Vq,125:$Vr,129:$Vs,130:$Vt,132:43,133:$Vu,135:$Vv,136:44,137:$Vw,138:45,139:$Vx,141:77,149:$Vy,154:41,155:$Vz,157:$VA,158:$VB,159:$VC,160:$VD,161:$VE,162:$VF},{6:$Vg2,31:$Vh2,32:[1,473]},o($VX1,[2,53]),o($VX1,[2,55]),o($VC1,[2,78]),o($VY,[2,237]),{29:[1,474]},o($V51,[2,128]),{6:$Vm2,31:$Vn2,32:[1,475]},o($V51,[2,150]),{6:$Vo2,31:$Vp2,32:[1,476]},o($VP1,[2,187]),o($Vz1,[2,232],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($Vz1,[2,233],{141:77,132:102,138:103,159:$VJ,160:$VK,163:$VL,164:$VM,165:$VN,166:$VO,167:$VP,168:$VQ,169:$VR,170:$VS,171:$VT,172:$VU,173:$VV,174:$VW}),o($VX1,[2,115]),{39:477,40:$V4,41:$V5},o($VX1,[2,135]),o($VX1,[2,155]),o($V51,[2,130])],
	defaultActions: {68:[2,70],69:[2,71],239:[2,109],357:[2,141]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        function _parseError (msg, hash) {
	            this.message = msg;
	            this.hash = hash;
	        }
	        _parseError.prototype = Error;

	        throw new _parseError(str, hash);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    var lexer = Object.create(this.lexer);
	    var sharedState = { yy: {} };
	    for (var k in this.yy) {
	        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	            sharedState.yy[k] = this.yy[k];
	        }
	    }
	    lexer.setInput(input, sharedState.yy);
	    sharedState.yy.lexer = lexer;
	    sharedState.yy.parser = this;
	    if (typeof lexer.yylloc == 'undefined') {
	        lexer.yylloc = {};
	    }
	    var yyloc = lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = lexer.options && lexer.options.ranges;
	    if (typeof sharedState.yy.parseError === 'function') {
	        this.parseError = sharedState.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    _token_stack:
	        var lex = function () {
	            var token;
	            token = lexer.lex() || EOF;
	            if (typeof token !== 'number') {
	                token = self.symbols_[token] || token;
	            }
	            return token;
	        };
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(lexer.yytext);
	            lstack.push(lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = lexer.yyleng;
	                yytext = lexer.yytext;
	                yylineno = lexer.yylineno;
	                yyloc = lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                sharedState.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};

	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();


	if (true) {
	exports.parser = parser;
	exports.Parser = parser.Parser;
	exports.parse = function () { return parser.parse.apply(parser, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = '';
	    var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    if (typeof fs !== 'undefined' && fs !== null)
	        source = fs.readFileSync(__webpack_require__(7).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(104)(module)))

/***/ }),
/* 175 */
/***/ (function(module, exports) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var LineMap, SourceMap;

	  LineMap = (function() {
	    function LineMap(line1) {
	      this.line = line1;
	      this.columns = [];
	    }

	    LineMap.prototype.add = function(column, arg, options) {
	      var sourceColumn, sourceLine;
	      sourceLine = arg[0], sourceColumn = arg[1];
	      if (options == null) {
	        options = {};
	      }
	      if (this.columns[column] && options.noReplace) {
	        return;
	      }
	      return this.columns[column] = {
	        line: this.line,
	        column: column,
	        sourceLine: sourceLine,
	        sourceColumn: sourceColumn
	      };
	    };

	    LineMap.prototype.sourceLocation = function(column) {
	      var mapping;
	      while (!((mapping = this.columns[column]) || (column <= 0))) {
	        column--;
	      }
	      return mapping && [mapping.sourceLine, mapping.sourceColumn];
	    };

	    return LineMap;

	  })();

	  SourceMap = (function() {
	    var BASE64_CHARS, VLQ_CONTINUATION_BIT, VLQ_SHIFT, VLQ_VALUE_MASK;

	    function SourceMap() {
	      this.lines = [];
	    }

	    SourceMap.prototype.add = function(sourceLocation, generatedLocation, options) {
	      var base, column, line, lineMap;
	      if (options == null) {
	        options = {};
	      }
	      line = generatedLocation[0], column = generatedLocation[1];
	      lineMap = ((base = this.lines)[line] || (base[line] = new LineMap(line)));
	      return lineMap.add(column, sourceLocation, options);
	    };

	    SourceMap.prototype.sourceLocation = function(arg) {
	      var column, line, lineMap;
	      line = arg[0], column = arg[1];
	      while (!((lineMap = this.lines[line]) || (line <= 0))) {
	        line--;
	      }
	      return lineMap && lineMap.sourceLocation(column);
	    };

	    SourceMap.prototype.generate = function(options, code) {
	      var buffer, i, j, lastColumn, lastSourceColumn, lastSourceLine, len, len1, lineMap, lineNumber, mapping, needComma, ref, ref1, v3, writingline;
	      if (options == null) {
	        options = {};
	      }
	      if (code == null) {
	        code = null;
	      }
	      writingline = 0;
	      lastColumn = 0;
	      lastSourceLine = 0;
	      lastSourceColumn = 0;
	      needComma = false;
	      buffer = "";
	      ref = this.lines;
	      for (lineNumber = i = 0, len = ref.length; i < len; lineNumber = ++i) {
	        lineMap = ref[lineNumber];
	        if (lineMap) {
	          ref1 = lineMap.columns;
	          for (j = 0, len1 = ref1.length; j < len1; j++) {
	            mapping = ref1[j];
	            if (!(mapping)) {
	              continue;
	            }
	            while (writingline < mapping.line) {
	              lastColumn = 0;
	              needComma = false;
	              buffer += ";";
	              writingline++;
	            }
	            if (needComma) {
	              buffer += ",";
	              needComma = false;
	            }
	            buffer += this.encodeVlq(mapping.column - lastColumn);
	            lastColumn = mapping.column;
	            buffer += this.encodeVlq(0);
	            buffer += this.encodeVlq(mapping.sourceLine - lastSourceLine);
	            lastSourceLine = mapping.sourceLine;
	            buffer += this.encodeVlq(mapping.sourceColumn - lastSourceColumn);
	            lastSourceColumn = mapping.sourceColumn;
	            needComma = true;
	          }
	        }
	      }
	      v3 = {
	        version: 3,
	        file: options.generatedFile || '',
	        sourceRoot: options.sourceRoot || '',
	        sources: options.sourceFiles || [''],
	        names: [],
	        mappings: buffer
	      };
	      if (options.inlineMap) {
	        v3.sourcesContent = [code];
	      }
	      return v3;
	    };

	    VLQ_SHIFT = 5;

	    VLQ_CONTINUATION_BIT = 1 << VLQ_SHIFT;

	    VLQ_VALUE_MASK = VLQ_CONTINUATION_BIT - 1;

	    SourceMap.prototype.encodeVlq = function(value) {
	      var answer, nextChunk, signBit, valueToEncode;
	      answer = '';
	      signBit = value < 0 ? 1 : 0;
	      valueToEncode = (Math.abs(value) << 1) + signBit;
	      while (valueToEncode || !answer) {
	        nextChunk = valueToEncode & VLQ_VALUE_MASK;
	        valueToEncode = valueToEncode >> VLQ_SHIFT;
	        if (valueToEncode) {
	          nextChunk |= VLQ_CONTINUATION_BIT;
	        }
	        answer += this.encodeBase64(nextChunk);
	      }
	      return answer;
	    };

	    BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	    SourceMap.prototype.encodeBase64 = function(value) {
	      return BASE64_CHARS[value] || (function() {
	        throw new Error("Cannot Base64 encode value: " + value);
	      })();
	    };

	    return SourceMap;

	  })();

	  module.exports = SourceMap;

	}).call(this);


/***/ }),
/* 176 */,
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./browser": 178,
		"./browser.js": 178,
		"./cake": 179,
		"./cake.js": 179,
		"./coffee-script": 168,
		"./coffee-script.js": 168,
		"./command": 181,
		"./command.js": 181,
		"./grammar": 185,
		"./grammar.js": 185,
		"./helpers": 173,
		"./helpers.js": 173,
		"./index": 186,
		"./index.js": 186,
		"./lexer": 171,
		"./lexer.js": 171,
		"./nodes": 183,
		"./nodes.js": 183,
		"./optparse": 180,
		"./optparse.js": 180,
		"./parser": 174,
		"./parser.js": 174,
		"./register": 187,
		"./register.js": 187,
		"./repl": 182,
		"./repl.js": 182,
		"./rewriter": 172,
		"./rewriter.js": 172,
		"./scope": 184,
		"./scope.js": 184,
		"./sourcemap": 175,
		"./sourcemap.js": 175
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 177;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var CoffeeScript, compile, runScripts,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  CoffeeScript = __webpack_require__(168);

	  CoffeeScript.require = __webpack_require__(177);

	  compile = CoffeeScript.compile;

	  CoffeeScript["eval"] = function(code, options) {
	    if (options == null) {
	      options = {};
	    }
	    if (options.bare == null) {
	      options.bare = true;
	    }
	    return eval(compile(code, options));
	  };

	  CoffeeScript.run = function(code, options) {
	    if (options == null) {
	      options = {};
	    }
	    options.bare = true;
	    options.shiftLine = true;
	    return Function(compile(code, options))();
	  };

	  if (typeof window === "undefined" || window === null) {
	    return;
	  }

	  if ((typeof btoa !== "undefined" && btoa !== null) && (typeof JSON !== "undefined" && JSON !== null)) {
	    compile = function(code, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.inlineMap = true;
	      return CoffeeScript.compile(code, options);
	    };
	  }

	  CoffeeScript.load = function(url, callback, options, hold) {
	    var xhr;
	    if (options == null) {
	      options = {};
	    }
	    if (hold == null) {
	      hold = false;
	    }
	    options.sourceFiles = [url];
	    xhr = window.ActiveXObject ? new window.ActiveXObject('Microsoft.XMLHTTP') : new window.XMLHttpRequest();
	    xhr.open('GET', url, true);
	    if ('overrideMimeType' in xhr) {
	      xhr.overrideMimeType('text/plain');
	    }
	    xhr.onreadystatechange = function() {
	      var param, ref;
	      if (xhr.readyState === 4) {
	        if ((ref = xhr.status) === 0 || ref === 200) {
	          param = [xhr.responseText, options];
	          if (!hold) {
	            CoffeeScript.run.apply(CoffeeScript, param);
	          }
	        } else {
	          throw new Error("Could not load " + url);
	        }
	        if (callback) {
	          return callback(param);
	        }
	      }
	    };
	    return xhr.send(null);
	  };

	  runScripts = function() {
	    var coffees, coffeetypes, execute, fn, i, index, j, len, s, script, scripts;
	    scripts = window.document.getElementsByTagName('script');
	    coffeetypes = ['text/coffeescript', 'text/literate-coffeescript'];
	    coffees = (function() {
	      var j, len, ref, results;
	      results = [];
	      for (j = 0, len = scripts.length; j < len; j++) {
	        s = scripts[j];
	        if (ref = s.type, indexOf.call(coffeetypes, ref) >= 0) {
	          results.push(s);
	        }
	      }
	      return results;
	    })();
	    index = 0;
	    execute = function() {
	      var param;
	      param = coffees[index];
	      if (param instanceof Array) {
	        CoffeeScript.run.apply(CoffeeScript, param);
	        index++;
	        return execute();
	      }
	    };
	    fn = function(script, i) {
	      var options, source;
	      options = {
	        literate: script.type === coffeetypes[1]
	      };
	      source = script.src || script.getAttribute('data-src');
	      if (source) {
	        return CoffeeScript.load(source, function(param) {
	          coffees[i] = param;
	          return execute();
	        }, options, true);
	      } else {
	        options.sourceFiles = ['embedded'];
	        return coffees[i] = [script.innerHTML, options];
	      }
	    };
	    for (i = j = 0, len = coffees.length; j < len; i = ++j) {
	      script = coffees[i];
	      fn(script, i);
	    }
	    return execute();
	  };

	  if (window.addEventListener) {
	    window.addEventListener('DOMContentLoaded', runScripts, false);
	  } else {
	    window.attachEvent('onload', runScripts);
	  }

	}).call(this);


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Generated by CoffeeScript 1.12.7
	(function() {
	  var CoffeeScript, cakefileDirectory, fatalError, fs, helpers, missingTask, oparse, options, optparse, path, printTasks, switches, tasks;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(7);

	  helpers = __webpack_require__(173);

	  optparse = __webpack_require__(180);

	  CoffeeScript = __webpack_require__(168);

	  CoffeeScript.register();

	  tasks = {};

	  options = {};

	  switches = [];

	  oparse = null;

	  helpers.extend(global, {
	    task: function(name, description, action) {
	      var ref;
	      if (!action) {
	        ref = [description, action], action = ref[0], description = ref[1];
	      }
	      return tasks[name] = {
	        name: name,
	        description: description,
	        action: action
	      };
	    },
	    option: function(letter, flag, description) {
	      return switches.push([letter, flag, description]);
	    },
	    invoke: function(name) {
	      if (!tasks[name]) {
	        missingTask(name);
	      }
	      return tasks[name].action(options);
	    }
	  });

	  exports.run = function() {
	    var arg, args, e, i, len, ref, results;
	    global.__originalDirname = fs.realpathSync('.');
	    process.chdir(cakefileDirectory(__originalDirname));
	    args = process.argv.slice(2);
	    CoffeeScript.run(fs.readFileSync('Cakefile').toString(), {
	      filename: 'Cakefile'
	    });
	    oparse = new optparse.OptionParser(switches);
	    if (!args.length) {
	      return printTasks();
	    }
	    try {
	      options = oparse.parse(args);
	    } catch (error) {
	      e = error;
	      return fatalError("" + e);
	    }
	    ref = options["arguments"];
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      arg = ref[i];
	      results.push(invoke(arg));
	    }
	    return results;
	  };

	  printTasks = function() {
	    var cakefilePath, desc, name, relative, spaces, task;
	    relative = path.relative || path.resolve;
	    cakefilePath = path.join(relative(__originalDirname, process.cwd()), 'Cakefile');
	    console.log(cakefilePath + " defines the following tasks:\n");
	    for (name in tasks) {
	      task = tasks[name];
	      spaces = 20 - name.length;
	      spaces = spaces > 0 ? Array(spaces + 1).join(' ') : '';
	      desc = task.description ? "# " + task.description : '';
	      console.log("cake " + name + spaces + " " + desc);
	    }
	    if (switches.length) {
	      return console.log(oparse.help());
	    }
	  };

	  fatalError = function(message) {
	    console.error(message + '\n');
	    console.log('To see a list of all tasks/options, run "cake"');
	    return process.exit(1);
	  };

	  missingTask = function(task) {
	    return fatalError("No such task: " + task);
	  };

	  cakefileDirectory = function(dir) {
	    var parent;
	    if (fs.existsSync(path.join(dir, 'Cakefile'))) {
	      return dir;
	    }
	    parent = path.normalize(path.join(dir, '..'));
	    if (parent !== dir) {
	      return cakefileDirectory(parent);
	    }
	    throw new Error("Cakefile not found in " + (process.cwd()));
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(4)))

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var LONG_FLAG, MULTI_FLAG, OPTIONAL, OptionParser, SHORT_FLAG, buildRule, buildRules, normalizeArguments, repeat;

	  repeat = __webpack_require__(173).repeat;

	  exports.OptionParser = OptionParser = (function() {
	    function OptionParser(rules, banner) {
	      this.banner = banner;
	      this.rules = buildRules(rules);
	    }

	    OptionParser.prototype.parse = function(args) {
	      var arg, i, isOption, j, k, len, len1, matchedRule, options, originalArgs, pos, ref, rule, seenNonOptionArg, skippingArgument, value;
	      options = {
	        "arguments": []
	      };
	      skippingArgument = false;
	      originalArgs = args;
	      args = normalizeArguments(args);
	      for (i = j = 0, len = args.length; j < len; i = ++j) {
	        arg = args[i];
	        if (skippingArgument) {
	          skippingArgument = false;
	          continue;
	        }
	        if (arg === '--') {
	          pos = originalArgs.indexOf('--');
	          options["arguments"] = options["arguments"].concat(originalArgs.slice(pos + 1));
	          break;
	        }
	        isOption = !!(arg.match(LONG_FLAG) || arg.match(SHORT_FLAG));
	        seenNonOptionArg = options["arguments"].length > 0;
	        if (!seenNonOptionArg) {
	          matchedRule = false;
	          ref = this.rules;
	          for (k = 0, len1 = ref.length; k < len1; k++) {
	            rule = ref[k];
	            if (rule.shortFlag === arg || rule.longFlag === arg) {
	              value = true;
	              if (rule.hasArgument) {
	                skippingArgument = true;
	                value = args[i + 1];
	              }
	              options[rule.name] = rule.isList ? (options[rule.name] || []).concat(value) : value;
	              matchedRule = true;
	              break;
	            }
	          }
	          if (isOption && !matchedRule) {
	            throw new Error("unrecognized option: " + arg);
	          }
	        }
	        if (seenNonOptionArg || !isOption) {
	          options["arguments"].push(arg);
	        }
	      }
	      return options;
	    };

	    OptionParser.prototype.help = function() {
	      var j, len, letPart, lines, ref, rule, spaces;
	      lines = [];
	      if (this.banner) {
	        lines.unshift(this.banner + "\n");
	      }
	      ref = this.rules;
	      for (j = 0, len = ref.length; j < len; j++) {
	        rule = ref[j];
	        spaces = 15 - rule.longFlag.length;
	        spaces = spaces > 0 ? repeat(' ', spaces) : '';
	        letPart = rule.shortFlag ? rule.shortFlag + ', ' : '    ';
	        lines.push('  ' + letPart + rule.longFlag + spaces + rule.description);
	      }
	      return "\n" + (lines.join('\n')) + "\n";
	    };

	    return OptionParser;

	  })();

	  LONG_FLAG = /^(--\w[\w\-]*)/;

	  SHORT_FLAG = /^(-\w)$/;

	  MULTI_FLAG = /^-(\w{2,})/;

	  OPTIONAL = /\[(\w+(\*?))\]/;

	  buildRules = function(rules) {
	    var j, len, results, tuple;
	    results = [];
	    for (j = 0, len = rules.length; j < len; j++) {
	      tuple = rules[j];
	      if (tuple.length < 3) {
	        tuple.unshift(null);
	      }
	      results.push(buildRule.apply(null, tuple));
	    }
	    return results;
	  };

	  buildRule = function(shortFlag, longFlag, description, options) {
	    var match;
	    if (options == null) {
	      options = {};
	    }
	    match = longFlag.match(OPTIONAL);
	    longFlag = longFlag.match(LONG_FLAG)[1];
	    return {
	      name: longFlag.substr(2),
	      shortFlag: shortFlag,
	      longFlag: longFlag,
	      description: description,
	      hasArgument: !!(match && match[1]),
	      isList: !!(match && match[2])
	    };
	  };

	  normalizeArguments = function(args) {
	    var arg, j, k, l, len, len1, match, ref, result;
	    args = args.slice(0);
	    result = [];
	    for (j = 0, len = args.length; j < len; j++) {
	      arg = args[j];
	      if (match = arg.match(MULTI_FLAG)) {
	        ref = match[1].split('');
	        for (k = 0, len1 = ref.length; k < len1; k++) {
	          l = ref[k];
	          result.push('-' + l);
	        }
	      } else {
	        result.push(arg);
	      }
	    }
	    return result;
	  };

	}).call(this);


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, Buffer) {// Generated by CoffeeScript 1.12.7
	(function() {
	  var BANNER, CoffeeScript, EventEmitter, SWITCHES, compileJoin, compileOptions, compilePath, compileScript, compileStdio, exec, findDirectoryIndex, forkNode, fs, helpers, hidden, joinTimeout, makePrelude, mkdirp, notSources, optionParser, optparse, opts, outputPath, parseOptions, path, printLine, printTokens, printWarn, ref, removeSource, removeSourceDir, silentUnlink, sourceCode, sources, spawn, timeLog, usage, useWinPathSep, version, wait, watch, watchDir, watchedDirs, writeJs,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(7);

	  helpers = __webpack_require__(173);

	  optparse = __webpack_require__(180);

	  CoffeeScript = __webpack_require__(168);

	  ref = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), spawn = ref.spawn, exec = ref.exec;

	  EventEmitter = __webpack_require__(5).EventEmitter;

	  useWinPathSep = path.sep === '\\';

	  helpers.extend(CoffeeScript, new EventEmitter);

	  printLine = function(line) {
	    return process.stdout.write(line + '\n');
	  };

	  printWarn = function(line) {
	    return process.stderr.write(line + '\n');
	  };

	  hidden = function(file) {
	    return /^\.|~$/.test(file);
	  };

	  BANNER = 'Usage: coffee [options] path/to/script.coffee -- [args]\n\nIf called without options, `coffee` will run your script.';

	  SWITCHES = [['-b', '--bare', 'compile without a top-level function wrapper'], ['-c', '--compile', 'compile to JavaScript and save as .js files'], ['-e', '--eval', 'pass a string from the command line as input'], ['-h', '--help', 'display this help message'], ['-i', '--interactive', 'run an interactive CoffeeScript REPL'], ['-j', '--join [FILE]', 'concatenate the source CoffeeScript before compiling'], ['-m', '--map', 'generate source map and save as .js.map files'], ['-M', '--inline-map', 'generate source map and include it directly in output'], ['-n', '--nodes', 'print out the parse tree that the parser produces'], ['--nodejs [ARGS]', 'pass options directly to the "node" binary'], ['--no-header', 'suppress the "Generated by" header'], ['-o', '--output [DIR]', 'set the output directory for compiled JavaScript'], ['-p', '--print', 'print out the compiled JavaScript'], ['-r', '--require [MODULE*]', 'require the given module before eval or REPL'], ['-s', '--stdio', 'listen for and compile scripts over stdio'], ['-l', '--literate', 'treat stdio as literate style coffee-script'], ['-t', '--tokens', 'print out the tokens that the lexer/rewriter produce'], ['-v', '--version', 'display the version number'], ['-w', '--watch', 'watch scripts for changes and rerun commands']];

	  opts = {};

	  sources = [];

	  sourceCode = [];

	  notSources = {};

	  watchedDirs = {};

	  optionParser = null;

	  exports.run = function() {
	    var i, len, literals, ref1, replCliOpts, results, source;
	    parseOptions();
	    replCliOpts = {
	      useGlobal: true
	    };
	    if (opts.require) {
	      opts.prelude = makePrelude(opts.require);
	    }
	    replCliOpts.prelude = opts.prelude;
	    if (opts.nodejs) {
	      return forkNode();
	    }
	    if (opts.help) {
	      return usage();
	    }
	    if (opts.version) {
	      return version();
	    }
	    if (opts.interactive) {
	      return __webpack_require__(182).start(replCliOpts);
	    }
	    if (opts.stdio) {
	      return compileStdio();
	    }
	    if (opts["eval"]) {
	      return compileScript(null, opts["arguments"][0]);
	    }
	    if (!opts["arguments"].length) {
	      return __webpack_require__(182).start(replCliOpts);
	    }
	    literals = opts.run ? opts["arguments"].splice(1) : [];
	    process.argv = process.argv.slice(0, 2).concat(literals);
	    process.argv[0] = 'coffee';
	    if (opts.output) {
	      opts.output = path.resolve(opts.output);
	    }
	    if (opts.join) {
	      opts.join = path.resolve(opts.join);
	      console.error('\nThe --join option is deprecated and will be removed in a future version.\n\nIf for some reason it\'s necessary to share local variables between files,\nreplace...\n\n    $ coffee --compile --join bundle.js -- a.coffee b.coffee c.coffee\n\nwith...\n\n    $ cat a.coffee b.coffee c.coffee | coffee --compile --stdio > bundle.js\n');
	    }
	    ref1 = opts["arguments"];
	    results = [];
	    for (i = 0, len = ref1.length; i < len; i++) {
	      source = ref1[i];
	      source = path.resolve(source);
	      results.push(compilePath(source, true, source));
	    }
	    return results;
	  };

	  makePrelude = function(requires) {
	    return requires.map(function(module) {
	      var _, match, name;
	      if (match = module.match(/^(.*)=(.*)$/)) {
	        _ = match[0], name = match[1], module = match[2];
	      }
	      name || (name = helpers.baseFileName(module, true, useWinPathSep));
	      return name + " = require('" + module + "')";
	    }).join(';');
	  };

	  compilePath = function(source, topLevel, base) {
	    var code, err, file, files, i, len, results, stats;
	    if (indexOf.call(sources, source) >= 0 || watchedDirs[source] || !topLevel && (notSources[source] || hidden(source))) {
	      return;
	    }
	    try {
	      stats = fs.statSync(source);
	    } catch (error) {
	      err = error;
	      if (err.code === 'ENOENT') {
	        console.error("File not found: " + source);
	        process.exit(1);
	      }
	      throw err;
	    }
	    if (stats.isDirectory()) {
	      if (path.basename(source) === 'node_modules') {
	        notSources[source] = true;
	        return;
	      }
	      if (opts.run) {
	        compilePath(findDirectoryIndex(source), topLevel, base);
	        return;
	      }
	      if (opts.watch) {
	        watchDir(source, base);
	      }
	      try {
	        files = fs.readdirSync(source);
	      } catch (error) {
	        err = error;
	        if (err.code === 'ENOENT') {
	          return;
	        } else {
	          throw err;
	        }
	      }
	      results = [];
	      for (i = 0, len = files.length; i < len; i++) {
	        file = files[i];
	        results.push(compilePath(path.join(source, file), false, base));
	      }
	      return results;
	    } else if (topLevel || helpers.isCoffee(source)) {
	      sources.push(source);
	      sourceCode.push(null);
	      delete notSources[source];
	      if (opts.watch) {
	        watch(source, base);
	      }
	      try {
	        code = fs.readFileSync(source);
	      } catch (error) {
	        err = error;
	        if (err.code === 'ENOENT') {
	          return;
	        } else {
	          throw err;
	        }
	      }
	      return compileScript(source, code.toString(), base);
	    } else {
	      return notSources[source] = true;
	    }
	  };

	  findDirectoryIndex = function(source) {
	    var err, ext, i, index, len, ref1;
	    ref1 = CoffeeScript.FILE_EXTENSIONS;
	    for (i = 0, len = ref1.length; i < len; i++) {
	      ext = ref1[i];
	      index = path.join(source, "index" + ext);
	      try {
	        if ((fs.statSync(index)).isFile()) {
	          return index;
	        }
	      } catch (error) {
	        err = error;
	        if (err.code !== 'ENOENT') {
	          throw err;
	        }
	      }
	    }
	    console.error("Missing index.coffee or index.litcoffee in " + source);
	    return process.exit(1);
	  };

	  compileScript = function(file, input, base) {
	    var compiled, err, message, o, options, t, task;
	    if (base == null) {
	      base = null;
	    }
	    o = opts;
	    options = compileOptions(file, base);
	    try {
	      t = task = {
	        file: file,
	        input: input,
	        options: options
	      };
	      CoffeeScript.emit('compile', task);
	      if (o.tokens) {
	        return printTokens(CoffeeScript.tokens(t.input, t.options));
	      } else if (o.nodes) {
	        return printLine(CoffeeScript.nodes(t.input, t.options).toString().trim());
	      } else if (o.run) {
	        CoffeeScript.register();
	        if (opts.prelude) {
	          CoffeeScript["eval"](opts.prelude, t.options);
	        }
	        return CoffeeScript.run(t.input, t.options);
	      } else if (o.join && t.file !== o.join) {
	        if (helpers.isLiterate(file)) {
	          t.input = helpers.invertLiterate(t.input);
	        }
	        sourceCode[sources.indexOf(t.file)] = t.input;
	        return compileJoin();
	      } else {
	        compiled = CoffeeScript.compile(t.input, t.options);
	        t.output = compiled;
	        if (o.map) {
	          t.output = compiled.js;
	          t.sourceMap = compiled.v3SourceMap;
	        }
	        CoffeeScript.emit('success', task);
	        if (o.print) {
	          return printLine(t.output.trim());
	        } else if (o.compile || o.map) {
	          return writeJs(base, t.file, t.output, options.jsPath, t.sourceMap);
	        }
	      }
	    } catch (error) {
	      err = error;
	      CoffeeScript.emit('failure', err, task);
	      if (CoffeeScript.listeners('failure').length) {
	        return;
	      }
	      message = (err != null ? err.stack : void 0) || ("" + err);
	      if (o.watch) {
	        return printLine(message + '\x07');
	      } else {
	        printWarn(message);
	        return process.exit(1);
	      }
	    }
	  };

	  compileStdio = function() {
	    var buffers, stdin;
	    buffers = [];
	    stdin = process.openStdin();
	    stdin.on('data', function(buffer) {
	      if (buffer) {
	        return buffers.push(buffer);
	      }
	    });
	    return stdin.on('end', function() {
	      return compileScript(null, Buffer.concat(buffers).toString());
	    });
	  };

	  joinTimeout = null;

	  compileJoin = function() {
	    if (!opts.join) {
	      return;
	    }
	    if (!sourceCode.some(function(code) {
	      return code === null;
	    })) {
	      clearTimeout(joinTimeout);
	      return joinTimeout = wait(100, function() {
	        return compileScript(opts.join, sourceCode.join('\n'), opts.join);
	      });
	    }
	  };

	  watch = function(source, base) {
	    var compile, compileTimeout, err, prevStats, rewatch, startWatcher, watchErr, watcher;
	    watcher = null;
	    prevStats = null;
	    compileTimeout = null;
	    watchErr = function(err) {
	      if (err.code !== 'ENOENT') {
	        throw err;
	      }
	      if (indexOf.call(sources, source) < 0) {
	        return;
	      }
	      try {
	        rewatch();
	        return compile();
	      } catch (error) {
	        removeSource(source, base);
	        return compileJoin();
	      }
	    };
	    compile = function() {
	      clearTimeout(compileTimeout);
	      return compileTimeout = wait(25, function() {
	        return fs.stat(source, function(err, stats) {
	          if (err) {
	            return watchErr(err);
	          }
	          if (prevStats && stats.size === prevStats.size && stats.mtime.getTime() === prevStats.mtime.getTime()) {
	            return rewatch();
	          }
	          prevStats = stats;
	          return fs.readFile(source, function(err, code) {
	            if (err) {
	              return watchErr(err);
	            }
	            compileScript(source, code.toString(), base);
	            return rewatch();
	          });
	        });
	      });
	    };
	    startWatcher = function() {
	      return watcher = fs.watch(source).on('change', compile).on('error', function(err) {
	        if (err.code !== 'EPERM') {
	          throw err;
	        }
	        return removeSource(source, base);
	      });
	    };
	    rewatch = function() {
	      if (watcher != null) {
	        watcher.close();
	      }
	      return startWatcher();
	    };
	    try {
	      return startWatcher();
	    } catch (error) {
	      err = error;
	      return watchErr(err);
	    }
	  };

	  watchDir = function(source, base) {
	    var err, readdirTimeout, startWatcher, stopWatcher, watcher;
	    watcher = null;
	    readdirTimeout = null;
	    startWatcher = function() {
	      return watcher = fs.watch(source).on('error', function(err) {
	        if (err.code !== 'EPERM') {
	          throw err;
	        }
	        return stopWatcher();
	      }).on('change', function() {
	        clearTimeout(readdirTimeout);
	        return readdirTimeout = wait(25, function() {
	          var err, file, files, i, len, results;
	          try {
	            files = fs.readdirSync(source);
	          } catch (error) {
	            err = error;
	            if (err.code !== 'ENOENT') {
	              throw err;
	            }
	            return stopWatcher();
	          }
	          results = [];
	          for (i = 0, len = files.length; i < len; i++) {
	            file = files[i];
	            results.push(compilePath(path.join(source, file), false, base));
	          }
	          return results;
	        });
	      });
	    };
	    stopWatcher = function() {
	      watcher.close();
	      return removeSourceDir(source, base);
	    };
	    watchedDirs[source] = true;
	    try {
	      return startWatcher();
	    } catch (error) {
	      err = error;
	      if (err.code !== 'ENOENT') {
	        throw err;
	      }
	    }
	  };

	  removeSourceDir = function(source, base) {
	    var file, i, len, sourcesChanged;
	    delete watchedDirs[source];
	    sourcesChanged = false;
	    for (i = 0, len = sources.length; i < len; i++) {
	      file = sources[i];
	      if (!(source === path.dirname(file))) {
	        continue;
	      }
	      removeSource(file, base);
	      sourcesChanged = true;
	    }
	    if (sourcesChanged) {
	      return compileJoin();
	    }
	  };

	  removeSource = function(source, base) {
	    var index;
	    index = sources.indexOf(source);
	    sources.splice(index, 1);
	    sourceCode.splice(index, 1);
	    if (!opts.join) {
	      silentUnlink(outputPath(source, base));
	      silentUnlink(outputPath(source, base, '.js.map'));
	      return timeLog("removed " + source);
	    }
	  };

	  silentUnlink = function(path) {
	    var err, ref1;
	    try {
	      return fs.unlinkSync(path);
	    } catch (error) {
	      err = error;
	      if ((ref1 = err.code) !== 'ENOENT' && ref1 !== 'EPERM') {
	        throw err;
	      }
	    }
	  };

	  outputPath = function(source, base, extension) {
	    var basename, dir, srcDir;
	    if (extension == null) {
	      extension = ".js";
	    }
	    basename = helpers.baseFileName(source, true, useWinPathSep);
	    srcDir = path.dirname(source);
	    if (!opts.output) {
	      dir = srcDir;
	    } else if (source === base) {
	      dir = opts.output;
	    } else {
	      dir = path.join(opts.output, path.relative(base, srcDir));
	    }
	    return path.join(dir, basename + extension);
	  };

	  mkdirp = function(dir, fn) {
	    var mkdirs, mode;
	    mode = 0x1ff & ~process.umask();
	    return (mkdirs = function(p, fn) {
	      return fs.exists(p, function(exists) {
	        if (exists) {
	          return fn();
	        } else {
	          return mkdirs(path.dirname(p), function() {
	            return fs.mkdir(p, mode, function(err) {
	              if (err) {
	                return fn(err);
	              }
	              return fn();
	            });
	          });
	        }
	      });
	    })(dir, fn);
	  };

	  writeJs = function(base, sourcePath, js, jsPath, generatedSourceMap) {
	    var compile, jsDir, sourceMapPath;
	    if (generatedSourceMap == null) {
	      generatedSourceMap = null;
	    }
	    sourceMapPath = outputPath(sourcePath, base, ".js.map");
	    jsDir = path.dirname(jsPath);
	    compile = function() {
	      if (opts.compile) {
	        if (js.length <= 0) {
	          js = ' ';
	        }
	        if (generatedSourceMap) {
	          js = js + "\n//# sourceMappingURL=" + (helpers.baseFileName(sourceMapPath, false, useWinPathSep)) + "\n";
	        }
	        fs.writeFile(jsPath, js, function(err) {
	          if (err) {
	            printLine(err.message);
	            return process.exit(1);
	          } else if (opts.compile && opts.watch) {
	            return timeLog("compiled " + sourcePath);
	          }
	        });
	      }
	      if (generatedSourceMap) {
	        return fs.writeFile(sourceMapPath, generatedSourceMap, function(err) {
	          if (err) {
	            printLine("Could not write source map: " + err.message);
	            return process.exit(1);
	          }
	        });
	      }
	    };
	    return fs.exists(jsDir, function(itExists) {
	      if (itExists) {
	        return compile();
	      } else {
	        return mkdirp(jsDir, compile);
	      }
	    });
	  };

	  wait = function(milliseconds, func) {
	    return setTimeout(func, milliseconds);
	  };

	  timeLog = function(message) {
	    return console.log(((new Date).toLocaleTimeString()) + " - " + message);
	  };

	  printTokens = function(tokens) {
	    var strings, tag, token, value;
	    strings = (function() {
	      var i, len, results;
	      results = [];
	      for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        tag = token[0];
	        value = token[1].toString().replace(/\n/, '\\n');
	        results.push("[" + tag + " " + value + "]");
	      }
	      return results;
	    })();
	    return printLine(strings.join(' '));
	  };

	  parseOptions = function() {
	    var o;
	    optionParser = new optparse.OptionParser(SWITCHES, BANNER);
	    o = opts = optionParser.parse(process.argv.slice(2));
	    o.compile || (o.compile = !!o.output);
	    o.run = !(o.compile || o.print || o.map);
	    return o.print = !!(o.print || (o["eval"] || o.stdio && o.compile));
	  };

	  compileOptions = function(filename, base) {
	    var answer, cwd, jsDir, jsPath;
	    answer = {
	      filename: filename,
	      literate: opts.literate || helpers.isLiterate(filename),
	      bare: opts.bare,
	      header: opts.compile && !opts['no-header'],
	      sourceMap: opts.map,
	      inlineMap: opts['inline-map']
	    };
	    if (filename) {
	      if (base) {
	        cwd = process.cwd();
	        jsPath = outputPath(filename, base);
	        jsDir = path.dirname(jsPath);
	        answer = helpers.merge(answer, {
	          jsPath: jsPath,
	          sourceRoot: path.relative(jsDir, cwd),
	          sourceFiles: [path.relative(cwd, filename)],
	          generatedFile: helpers.baseFileName(jsPath, false, useWinPathSep)
	        });
	      } else {
	        answer = helpers.merge(answer, {
	          sourceRoot: "",
	          sourceFiles: [helpers.baseFileName(filename, false, useWinPathSep)],
	          generatedFile: helpers.baseFileName(filename, true, useWinPathSep) + ".js"
	        });
	      }
	    }
	    return answer;
	  };

	  forkNode = function() {
	    var args, nodeArgs, p;
	    nodeArgs = opts.nodejs.split(/\s+/);
	    args = process.argv.slice(1);
	    args.splice(args.indexOf('--nodejs'), 2);
	    p = spawn(process.execPath, nodeArgs.concat(args), {
	      cwd: process.cwd(),
	      env: process.env,
	      stdio: [0, 1, 2]
	    });
	    return p.on('exit', function(code) {
	      return process.exit(code);
	    });
	  };

	  usage = function() {
	    return printLine((new optparse.OptionParser(SWITCHES, BANNER)).help());
	  };

	  version = function() {
	    return printLine("CoffeeScript version " + CoffeeScript.VERSION);
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(75).Buffer))

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global, Buffer) {// Generated by CoffeeScript 1.12.7
	(function() {
	  var CoffeeScript, addHistory, addMultilineHandler, fs, getCommandId, merge, nodeREPL, path, ref, replDefaults, runInContext, updateSyntaxError, vm;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(7);

	  vm = __webpack_require__(169);

	  nodeREPL = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"repl\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  CoffeeScript = __webpack_require__(168);

	  ref = __webpack_require__(173), merge = ref.merge, updateSyntaxError = ref.updateSyntaxError;

	  replDefaults = {
	    prompt: 'coffee> ',
	    historyFile: process.env.HOME ? path.join(process.env.HOME, '.coffee_history') : void 0,
	    historyMaxInputSize: 10240,
	    "eval": function(input, context, filename, cb) {
	      var Assign, Block, Literal, Value, ast, err, js, ref1, referencedVars, token, tokens;
	      input = input.replace(/\uFF00/g, '\n');
	      input = input.replace(/^\(([\s\S]*)\n\)$/m, '$1');
	      input = input.replace(/^\s*try\s*{([\s\S]*)}\s*catch.*$/m, '$1');
	      ref1 = __webpack_require__(183), Block = ref1.Block, Assign = ref1.Assign, Value = ref1.Value, Literal = ref1.Literal;
	      try {
	        tokens = CoffeeScript.tokens(input);
	        referencedVars = (function() {
	          var i, len, results;
	          results = [];
	          for (i = 0, len = tokens.length; i < len; i++) {
	            token = tokens[i];
	            if (token[0] === 'IDENTIFIER') {
	              results.push(token[1]);
	            }
	          }
	          return results;
	        })();
	        ast = CoffeeScript.nodes(tokens);
	        ast = new Block([new Assign(new Value(new Literal('__')), ast, '=')]);
	        js = ast.compile({
	          bare: true,
	          locals: Object.keys(context),
	          referencedVars: referencedVars
	        });
	        return cb(null, runInContext(js, context, filename));
	      } catch (error) {
	        err = error;
	        updateSyntaxError(err, input);
	        return cb(err);
	      }
	    }
	  };

	  runInContext = function(js, context, filename) {
	    if (context === global) {
	      return vm.runInThisContext(js, filename);
	    } else {
	      return vm.runInContext(js, context, filename);
	    }
	  };

	  addMultilineHandler = function(repl) {
	    var inputStream, multiline, nodeLineListener, origPrompt, outputStream, ref1, rli;
	    rli = repl.rli, inputStream = repl.inputStream, outputStream = repl.outputStream;
	    origPrompt = (ref1 = repl._prompt) != null ? ref1 : repl.prompt;
	    multiline = {
	      enabled: false,
	      initialPrompt: origPrompt.replace(/^[^> ]*/, function(x) {
	        return x.replace(/./g, '-');
	      }),
	      prompt: origPrompt.replace(/^[^> ]*>?/, function(x) {
	        return x.replace(/./g, '.');
	      }),
	      buffer: ''
	    };
	    nodeLineListener = rli.listeners('line')[0];
	    rli.removeListener('line', nodeLineListener);
	    rli.on('line', function(cmd) {
	      if (multiline.enabled) {
	        multiline.buffer += cmd + "\n";
	        rli.setPrompt(multiline.prompt);
	        rli.prompt(true);
	      } else {
	        rli.setPrompt(origPrompt);
	        nodeLineListener(cmd);
	      }
	    });
	    return inputStream.on('keypress', function(char, key) {
	      if (!(key && key.ctrl && !key.meta && !key.shift && key.name === 'v')) {
	        return;
	      }
	      if (multiline.enabled) {
	        if (!multiline.buffer.match(/\n/)) {
	          multiline.enabled = !multiline.enabled;
	          rli.setPrompt(origPrompt);
	          rli.prompt(true);
	          return;
	        }
	        if ((rli.line != null) && !rli.line.match(/^\s*$/)) {
	          return;
	        }
	        multiline.enabled = !multiline.enabled;
	        rli.line = '';
	        rli.cursor = 0;
	        rli.output.cursorTo(0);
	        rli.output.clearLine(1);
	        multiline.buffer = multiline.buffer.replace(/\n/g, '\uFF00');
	        rli.emit('line', multiline.buffer);
	        multiline.buffer = '';
	      } else {
	        multiline.enabled = !multiline.enabled;
	        rli.setPrompt(multiline.initialPrompt);
	        rli.prompt(true);
	      }
	    });
	  };

	  addHistory = function(repl, filename, maxSize) {
	    var buffer, fd, lastLine, readFd, size, stat;
	    lastLine = null;
	    try {
	      stat = fs.statSync(filename);
	      size = Math.min(maxSize, stat.size);
	      readFd = fs.openSync(filename, 'r');
	      buffer = new Buffer(size);
	      fs.readSync(readFd, buffer, 0, size, stat.size - size);
	      fs.closeSync(readFd);
	      repl.rli.history = buffer.toString().split('\n').reverse();
	      if (stat.size > maxSize) {
	        repl.rli.history.pop();
	      }
	      if (repl.rli.history[0] === '') {
	        repl.rli.history.shift();
	      }
	      repl.rli.historyIndex = -1;
	      lastLine = repl.rli.history[0];
	    } catch (error) {}
	    fd = fs.openSync(filename, 'a');
	    repl.rli.addListener('line', function(code) {
	      if (code && code.length && code !== '.history' && code !== '.exit' && lastLine !== code) {
	        fs.writeSync(fd, code + "\n");
	        return lastLine = code;
	      }
	    });
	    repl.on('exit', function() {
	      return fs.closeSync(fd);
	    });
	    return repl.commands[getCommandId(repl, 'history')] = {
	      help: 'Show command history',
	      action: function() {
	        repl.outputStream.write((repl.rli.history.slice(0).reverse().join('\n')) + "\n");
	        return repl.displayPrompt();
	      }
	    };
	  };

	  getCommandId = function(repl, commandName) {
	    var commandsHaveLeadingDot;
	    commandsHaveLeadingDot = repl.commands['.help'] != null;
	    if (commandsHaveLeadingDot) {
	      return "." + commandName;
	    } else {
	      return commandName;
	    }
	  };

	  module.exports = {
	    start: function(opts) {
	      var build, major, minor, ref1, repl;
	      if (opts == null) {
	        opts = {};
	      }
	      ref1 = process.versions.node.split('.').map(function(n) {
	        return parseInt(n, 10);
	      }), major = ref1[0], minor = ref1[1], build = ref1[2];
	      if (major === 0 && minor < 8) {
	        console.warn("Node 0.8.0+ required for CoffeeScript REPL");
	        process.exit(1);
	      }
	      CoffeeScript.register();
	      process.argv = ['coffee'].concat(process.argv.slice(2));
	      opts = merge(replDefaults, opts);
	      repl = nodeREPL.start(opts);
	      if (opts.prelude) {
	        runInContext(opts.prelude, repl.context, 'prelude');
	      }
	      repl.on('exit', function() {
	        if (!repl.rli.closed) {
	          return repl.outputStream.write('\n');
	        }
	      });
	      addMultilineHandler(repl);
	      if (opts.historyFile) {
	        addHistory(repl, opts.historyFile, opts.historyMaxInputSize);
	      }
	      repl.commands[getCommandId(repl, 'load')].help = 'Load code from a file into this REPL session';
	      return repl;
	    }
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), (function() { return this; }()), __webpack_require__(75).Buffer))

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var Access, Arr, Assign, Base, Block, BooleanLiteral, Call, Class, Code, CodeFragment, Comment, Existence, Expansion, ExportAllDeclaration, ExportDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier, ExportSpecifierList, Extends, For, IdentifierLiteral, If, ImportClause, ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, ImportSpecifierList, In, Index, InfinityLiteral, JS_FORBIDDEN, LEVEL_ACCESS, LEVEL_COND, LEVEL_LIST, LEVEL_OP, LEVEL_PAREN, LEVEL_TOP, Literal, ModuleDeclaration, ModuleSpecifier, ModuleSpecifierList, NEGATE, NO, NaNLiteral, NullLiteral, NumberLiteral, Obj, Op, Param, Parens, PassthroughLiteral, PropertyName, Range, RegexLiteral, RegexWithInterpolations, Return, SIMPLENUM, Scope, Slice, Splat, StatementLiteral, StringLiteral, StringWithInterpolations, SuperCall, Switch, TAB, THIS, TaggedTemplateCall, ThisLiteral, Throw, Try, UTILITIES, UndefinedLiteral, Value, While, YES, YieldReturn, addLocationDataFn, compact, del, ends, extend, flatten, fragmentsToText, isComplexOrAssignable, isLiteralArguments, isLiteralThis, isUnassignable, locationDataToString, merge, multident, ref1, ref2, some, starts, throwSyntaxError, unfoldSoak, utility,
	    extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    slice = [].slice;

	  Error.stackTraceLimit = 2e308;

	  Scope = __webpack_require__(184).Scope;

	  ref1 = __webpack_require__(171), isUnassignable = ref1.isUnassignable, JS_FORBIDDEN = ref1.JS_FORBIDDEN;

	  ref2 = __webpack_require__(173), compact = ref2.compact, flatten = ref2.flatten, extend = ref2.extend, merge = ref2.merge, del = ref2.del, starts = ref2.starts, ends = ref2.ends, some = ref2.some, addLocationDataFn = ref2.addLocationDataFn, locationDataToString = ref2.locationDataToString, throwSyntaxError = ref2.throwSyntaxError;

	  exports.extend = extend;

	  exports.addLocationDataFn = addLocationDataFn;

	  YES = function() {
	    return true;
	  };

	  NO = function() {
	    return false;
	  };

	  THIS = function() {
	    return this;
	  };

	  NEGATE = function() {
	    this.negated = !this.negated;
	    return this;
	  };

	  exports.CodeFragment = CodeFragment = (function() {
	    function CodeFragment(parent, code) {
	      var ref3;
	      this.code = "" + code;
	      this.locationData = parent != null ? parent.locationData : void 0;
	      this.type = (parent != null ? (ref3 = parent.constructor) != null ? ref3.name : void 0 : void 0) || 'unknown';
	    }

	    CodeFragment.prototype.toString = function() {
	      return "" + this.code + (this.locationData ? ": " + locationDataToString(this.locationData) : '');
	    };

	    return CodeFragment;

	  })();

	  fragmentsToText = function(fragments) {
	    var fragment;
	    return ((function() {
	      var j, len1, results;
	      results = [];
	      for (j = 0, len1 = fragments.length; j < len1; j++) {
	        fragment = fragments[j];
	        results.push(fragment.code);
	      }
	      return results;
	    })()).join('');
	  };

	  exports.Base = Base = (function() {
	    function Base() {}

	    Base.prototype.compile = function(o, lvl) {
	      return fragmentsToText(this.compileToFragments(o, lvl));
	    };

	    Base.prototype.compileToFragments = function(o, lvl) {
	      var node;
	      o = extend({}, o);
	      if (lvl) {
	        o.level = lvl;
	      }
	      node = this.unfoldSoak(o) || this;
	      node.tab = o.indent;
	      if (o.level === LEVEL_TOP || !node.isStatement(o)) {
	        return node.compileNode(o);
	      } else {
	        return node.compileClosure(o);
	      }
	    };

	    Base.prototype.compileClosure = function(o) {
	      var args, argumentsNode, func, jumpNode, meth, parts, ref3;
	      if (jumpNode = this.jumps()) {
	        jumpNode.error('cannot use a pure statement in an expression');
	      }
	      o.sharedScope = true;
	      func = new Code([], Block.wrap([this]));
	      args = [];
	      if ((argumentsNode = this.contains(isLiteralArguments)) || this.contains(isLiteralThis)) {
	        args = [new ThisLiteral];
	        if (argumentsNode) {
	          meth = 'apply';
	          args.push(new IdentifierLiteral('arguments'));
	        } else {
	          meth = 'call';
	        }
	        func = new Value(func, [new Access(new PropertyName(meth))]);
	      }
	      parts = (new Call(func, args)).compileNode(o);
	      if (func.isGenerator || ((ref3 = func.base) != null ? ref3.isGenerator : void 0)) {
	        parts.unshift(this.makeCode("(yield* "));
	        parts.push(this.makeCode(")"));
	      }
	      return parts;
	    };

	    Base.prototype.cache = function(o, level, isComplex) {
	      var complex, ref, sub;
	      complex = isComplex != null ? isComplex(this) : this.isComplex();
	      if (complex) {
	        ref = new IdentifierLiteral(o.scope.freeVariable('ref'));
	        sub = new Assign(ref, this);
	        if (level) {
	          return [sub.compileToFragments(o, level), [this.makeCode(ref.value)]];
	        } else {
	          return [sub, ref];
	        }
	      } else {
	        ref = level ? this.compileToFragments(o, level) : this;
	        return [ref, ref];
	      }
	    };

	    Base.prototype.cacheToCodeFragments = function(cacheValues) {
	      return [fragmentsToText(cacheValues[0]), fragmentsToText(cacheValues[1])];
	    };

	    Base.prototype.makeReturn = function(res) {
	      var me;
	      me = this.unwrapAll();
	      if (res) {
	        return new Call(new Literal(res + ".push"), [me]);
	      } else {
	        return new Return(me);
	      }
	    };

	    Base.prototype.contains = function(pred) {
	      var node;
	      node = void 0;
	      this.traverseChildren(false, function(n) {
	        if (pred(n)) {
	          node = n;
	          return false;
	        }
	      });
	      return node;
	    };

	    Base.prototype.lastNonComment = function(list) {
	      var i;
	      i = list.length;
	      while (i--) {
	        if (!(list[i] instanceof Comment)) {
	          return list[i];
	        }
	      }
	      return null;
	    };

	    Base.prototype.toString = function(idt, name) {
	      var tree;
	      if (idt == null) {
	        idt = '';
	      }
	      if (name == null) {
	        name = this.constructor.name;
	      }
	      tree = '\n' + idt + name;
	      if (this.soak) {
	        tree += '?';
	      }
	      this.eachChild(function(node) {
	        return tree += node.toString(idt + TAB);
	      });
	      return tree;
	    };

	    Base.prototype.eachChild = function(func) {
	      var attr, child, j, k, len1, len2, ref3, ref4;
	      if (!this.children) {
	        return this;
	      }
	      ref3 = this.children;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        attr = ref3[j];
	        if (this[attr]) {
	          ref4 = flatten([this[attr]]);
	          for (k = 0, len2 = ref4.length; k < len2; k++) {
	            child = ref4[k];
	            if (func(child) === false) {
	              return this;
	            }
	          }
	        }
	      }
	      return this;
	    };

	    Base.prototype.traverseChildren = function(crossScope, func) {
	      return this.eachChild(function(child) {
	        var recur;
	        recur = func(child);
	        if (recur !== false) {
	          return child.traverseChildren(crossScope, func);
	        }
	      });
	    };

	    Base.prototype.invert = function() {
	      return new Op('!', this);
	    };

	    Base.prototype.unwrapAll = function() {
	      var node;
	      node = this;
	      while (node !== (node = node.unwrap())) {
	        continue;
	      }
	      return node;
	    };

	    Base.prototype.children = [];

	    Base.prototype.isStatement = NO;

	    Base.prototype.jumps = NO;

	    Base.prototype.isComplex = YES;

	    Base.prototype.isChainable = NO;

	    Base.prototype.isAssignable = NO;

	    Base.prototype.isNumber = NO;

	    Base.prototype.unwrap = THIS;

	    Base.prototype.unfoldSoak = NO;

	    Base.prototype.assigns = NO;

	    Base.prototype.updateLocationDataIfMissing = function(locationData) {
	      if (this.locationData) {
	        return this;
	      }
	      this.locationData = locationData;
	      return this.eachChild(function(child) {
	        return child.updateLocationDataIfMissing(locationData);
	      });
	    };

	    Base.prototype.error = function(message) {
	      return throwSyntaxError(message, this.locationData);
	    };

	    Base.prototype.makeCode = function(code) {
	      return new CodeFragment(this, code);
	    };

	    Base.prototype.wrapInBraces = function(fragments) {
	      return [].concat(this.makeCode('('), fragments, this.makeCode(')'));
	    };

	    Base.prototype.joinFragmentArrays = function(fragmentsList, joinStr) {
	      var answer, fragments, i, j, len1;
	      answer = [];
	      for (i = j = 0, len1 = fragmentsList.length; j < len1; i = ++j) {
	        fragments = fragmentsList[i];
	        if (i) {
	          answer.push(this.makeCode(joinStr));
	        }
	        answer = answer.concat(fragments);
	      }
	      return answer;
	    };

	    return Base;

	  })();

	  exports.Block = Block = (function(superClass1) {
	    extend1(Block, superClass1);

	    function Block(nodes) {
	      this.expressions = compact(flatten(nodes || []));
	    }

	    Block.prototype.children = ['expressions'];

	    Block.prototype.push = function(node) {
	      this.expressions.push(node);
	      return this;
	    };

	    Block.prototype.pop = function() {
	      return this.expressions.pop();
	    };

	    Block.prototype.unshift = function(node) {
	      this.expressions.unshift(node);
	      return this;
	    };

	    Block.prototype.unwrap = function() {
	      if (this.expressions.length === 1) {
	        return this.expressions[0];
	      } else {
	        return this;
	      }
	    };

	    Block.prototype.isEmpty = function() {
	      return !this.expressions.length;
	    };

	    Block.prototype.isStatement = function(o) {
	      var exp, j, len1, ref3;
	      ref3 = this.expressions;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        exp = ref3[j];
	        if (exp.isStatement(o)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    Block.prototype.jumps = function(o) {
	      var exp, j, jumpNode, len1, ref3;
	      ref3 = this.expressions;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        exp = ref3[j];
	        if (jumpNode = exp.jumps(o)) {
	          return jumpNode;
	        }
	      }
	    };

	    Block.prototype.makeReturn = function(res) {
	      var expr, len;
	      len = this.expressions.length;
	      while (len--) {
	        expr = this.expressions[len];
	        if (!(expr instanceof Comment)) {
	          this.expressions[len] = expr.makeReturn(res);
	          if (expr instanceof Return && !expr.expression) {
	            this.expressions.splice(len, 1);
	          }
	          break;
	        }
	      }
	      return this;
	    };

	    Block.prototype.compileToFragments = function(o, level) {
	      if (o == null) {
	        o = {};
	      }
	      if (o.scope) {
	        return Block.__super__.compileToFragments.call(this, o, level);
	      } else {
	        return this.compileRoot(o);
	      }
	    };

	    Block.prototype.compileNode = function(o) {
	      var answer, compiledNodes, fragments, index, j, len1, node, ref3, top;
	      this.tab = o.indent;
	      top = o.level === LEVEL_TOP;
	      compiledNodes = [];
	      ref3 = this.expressions;
	      for (index = j = 0, len1 = ref3.length; j < len1; index = ++j) {
	        node = ref3[index];
	        node = node.unwrapAll();
	        node = node.unfoldSoak(o) || node;
	        if (node instanceof Block) {
	          compiledNodes.push(node.compileNode(o));
	        } else if (top) {
	          node.front = true;
	          fragments = node.compileToFragments(o);
	          if (!node.isStatement(o)) {
	            fragments.unshift(this.makeCode("" + this.tab));
	            fragments.push(this.makeCode(";"));
	          }
	          compiledNodes.push(fragments);
	        } else {
	          compiledNodes.push(node.compileToFragments(o, LEVEL_LIST));
	        }
	      }
	      if (top) {
	        if (this.spaced) {
	          return [].concat(this.joinFragmentArrays(compiledNodes, '\n\n'), this.makeCode("\n"));
	        } else {
	          return this.joinFragmentArrays(compiledNodes, '\n');
	        }
	      }
	      if (compiledNodes.length) {
	        answer = this.joinFragmentArrays(compiledNodes, ', ');
	      } else {
	        answer = [this.makeCode("void 0")];
	      }
	      if (compiledNodes.length > 1 && o.level >= LEVEL_LIST) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Block.prototype.compileRoot = function(o) {
	      var exp, fragments, i, j, len1, name, prelude, preludeExps, ref3, ref4, rest;
	      o.indent = o.bare ? '' : TAB;
	      o.level = LEVEL_TOP;
	      this.spaced = true;
	      o.scope = new Scope(null, this, null, (ref3 = o.referencedVars) != null ? ref3 : []);
	      ref4 = o.locals || [];
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        name = ref4[j];
	        o.scope.parameter(name);
	      }
	      prelude = [];
	      if (!o.bare) {
	        preludeExps = (function() {
	          var k, len2, ref5, results;
	          ref5 = this.expressions;
	          results = [];
	          for (i = k = 0, len2 = ref5.length; k < len2; i = ++k) {
	            exp = ref5[i];
	            if (!(exp.unwrap() instanceof Comment)) {
	              break;
	            }
	            results.push(exp);
	          }
	          return results;
	        }).call(this);
	        rest = this.expressions.slice(preludeExps.length);
	        this.expressions = preludeExps;
	        if (preludeExps.length) {
	          prelude = this.compileNode(merge(o, {
	            indent: ''
	          }));
	          prelude.push(this.makeCode("\n"));
	        }
	        this.expressions = rest;
	      }
	      fragments = this.compileWithDeclarations(o);
	      if (o.bare) {
	        return fragments;
	      }
	      return [].concat(prelude, this.makeCode("(function() {\n"), fragments, this.makeCode("\n}).call(this);\n"));
	    };

	    Block.prototype.compileWithDeclarations = function(o) {
	      var assigns, declars, exp, fragments, i, j, len1, post, ref3, ref4, ref5, rest, scope, spaced;
	      fragments = [];
	      post = [];
	      ref3 = this.expressions;
	      for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	        exp = ref3[i];
	        exp = exp.unwrap();
	        if (!(exp instanceof Comment || exp instanceof Literal)) {
	          break;
	        }
	      }
	      o = merge(o, {
	        level: LEVEL_TOP
	      });
	      if (i) {
	        rest = this.expressions.splice(i, 9e9);
	        ref4 = [this.spaced, false], spaced = ref4[0], this.spaced = ref4[1];
	        ref5 = [this.compileNode(o), spaced], fragments = ref5[0], this.spaced = ref5[1];
	        this.expressions = rest;
	      }
	      post = this.compileNode(o);
	      scope = o.scope;
	      if (scope.expressions === this) {
	        declars = o.scope.hasDeclarations();
	        assigns = scope.hasAssignments;
	        if (declars || assigns) {
	          if (i) {
	            fragments.push(this.makeCode('\n'));
	          }
	          fragments.push(this.makeCode(this.tab + "var "));
	          if (declars) {
	            fragments.push(this.makeCode(scope.declaredVariables().join(', ')));
	          }
	          if (assigns) {
	            if (declars) {
	              fragments.push(this.makeCode(",\n" + (this.tab + TAB)));
	            }
	            fragments.push(this.makeCode(scope.assignedVariables().join(",\n" + (this.tab + TAB))));
	          }
	          fragments.push(this.makeCode(";\n" + (this.spaced ? '\n' : '')));
	        } else if (fragments.length && post.length) {
	          fragments.push(this.makeCode("\n"));
	        }
	      }
	      return fragments.concat(post);
	    };

	    Block.wrap = function(nodes) {
	      if (nodes.length === 1 && nodes[0] instanceof Block) {
	        return nodes[0];
	      }
	      return new Block(nodes);
	    };

	    return Block;

	  })(Base);

	  exports.Literal = Literal = (function(superClass1) {
	    extend1(Literal, superClass1);

	    function Literal(value1) {
	      this.value = value1;
	    }

	    Literal.prototype.isComplex = NO;

	    Literal.prototype.assigns = function(name) {
	      return name === this.value;
	    };

	    Literal.prototype.compileNode = function(o) {
	      return [this.makeCode(this.value)];
	    };

	    Literal.prototype.toString = function() {
	      return " " + (this.isStatement() ? Literal.__super__.toString.apply(this, arguments) : this.constructor.name) + ": " + this.value;
	    };

	    return Literal;

	  })(Base);

	  exports.NumberLiteral = NumberLiteral = (function(superClass1) {
	    extend1(NumberLiteral, superClass1);

	    function NumberLiteral() {
	      return NumberLiteral.__super__.constructor.apply(this, arguments);
	    }

	    return NumberLiteral;

	  })(Literal);

	  exports.InfinityLiteral = InfinityLiteral = (function(superClass1) {
	    extend1(InfinityLiteral, superClass1);

	    function InfinityLiteral() {
	      return InfinityLiteral.__super__.constructor.apply(this, arguments);
	    }

	    InfinityLiteral.prototype.compileNode = function() {
	      return [this.makeCode('2e308')];
	    };

	    return InfinityLiteral;

	  })(NumberLiteral);

	  exports.NaNLiteral = NaNLiteral = (function(superClass1) {
	    extend1(NaNLiteral, superClass1);

	    function NaNLiteral() {
	      NaNLiteral.__super__.constructor.call(this, 'NaN');
	    }

	    NaNLiteral.prototype.compileNode = function(o) {
	      var code;
	      code = [this.makeCode('0/0')];
	      if (o.level >= LEVEL_OP) {
	        return this.wrapInBraces(code);
	      } else {
	        return code;
	      }
	    };

	    return NaNLiteral;

	  })(NumberLiteral);

	  exports.StringLiteral = StringLiteral = (function(superClass1) {
	    extend1(StringLiteral, superClass1);

	    function StringLiteral() {
	      return StringLiteral.__super__.constructor.apply(this, arguments);
	    }

	    return StringLiteral;

	  })(Literal);

	  exports.RegexLiteral = RegexLiteral = (function(superClass1) {
	    extend1(RegexLiteral, superClass1);

	    function RegexLiteral() {
	      return RegexLiteral.__super__.constructor.apply(this, arguments);
	    }

	    return RegexLiteral;

	  })(Literal);

	  exports.PassthroughLiteral = PassthroughLiteral = (function(superClass1) {
	    extend1(PassthroughLiteral, superClass1);

	    function PassthroughLiteral() {
	      return PassthroughLiteral.__super__.constructor.apply(this, arguments);
	    }

	    return PassthroughLiteral;

	  })(Literal);

	  exports.IdentifierLiteral = IdentifierLiteral = (function(superClass1) {
	    extend1(IdentifierLiteral, superClass1);

	    function IdentifierLiteral() {
	      return IdentifierLiteral.__super__.constructor.apply(this, arguments);
	    }

	    IdentifierLiteral.prototype.isAssignable = YES;

	    return IdentifierLiteral;

	  })(Literal);

	  exports.PropertyName = PropertyName = (function(superClass1) {
	    extend1(PropertyName, superClass1);

	    function PropertyName() {
	      return PropertyName.__super__.constructor.apply(this, arguments);
	    }

	    PropertyName.prototype.isAssignable = YES;

	    return PropertyName;

	  })(Literal);

	  exports.StatementLiteral = StatementLiteral = (function(superClass1) {
	    extend1(StatementLiteral, superClass1);

	    function StatementLiteral() {
	      return StatementLiteral.__super__.constructor.apply(this, arguments);
	    }

	    StatementLiteral.prototype.isStatement = YES;

	    StatementLiteral.prototype.makeReturn = THIS;

	    StatementLiteral.prototype.jumps = function(o) {
	      if (this.value === 'break' && !((o != null ? o.loop : void 0) || (o != null ? o.block : void 0))) {
	        return this;
	      }
	      if (this.value === 'continue' && !(o != null ? o.loop : void 0)) {
	        return this;
	      }
	    };

	    StatementLiteral.prototype.compileNode = function(o) {
	      return [this.makeCode("" + this.tab + this.value + ";")];
	    };

	    return StatementLiteral;

	  })(Literal);

	  exports.ThisLiteral = ThisLiteral = (function(superClass1) {
	    extend1(ThisLiteral, superClass1);

	    function ThisLiteral() {
	      ThisLiteral.__super__.constructor.call(this, 'this');
	    }

	    ThisLiteral.prototype.compileNode = function(o) {
	      var code, ref3;
	      code = ((ref3 = o.scope.method) != null ? ref3.bound : void 0) ? o.scope.method.context : this.value;
	      return [this.makeCode(code)];
	    };

	    return ThisLiteral;

	  })(Literal);

	  exports.UndefinedLiteral = UndefinedLiteral = (function(superClass1) {
	    extend1(UndefinedLiteral, superClass1);

	    function UndefinedLiteral() {
	      UndefinedLiteral.__super__.constructor.call(this, 'undefined');
	    }

	    UndefinedLiteral.prototype.compileNode = function(o) {
	      return [this.makeCode(o.level >= LEVEL_ACCESS ? '(void 0)' : 'void 0')];
	    };

	    return UndefinedLiteral;

	  })(Literal);

	  exports.NullLiteral = NullLiteral = (function(superClass1) {
	    extend1(NullLiteral, superClass1);

	    function NullLiteral() {
	      NullLiteral.__super__.constructor.call(this, 'null');
	    }

	    return NullLiteral;

	  })(Literal);

	  exports.BooleanLiteral = BooleanLiteral = (function(superClass1) {
	    extend1(BooleanLiteral, superClass1);

	    function BooleanLiteral() {
	      return BooleanLiteral.__super__.constructor.apply(this, arguments);
	    }

	    return BooleanLiteral;

	  })(Literal);

	  exports.Return = Return = (function(superClass1) {
	    extend1(Return, superClass1);

	    function Return(expression) {
	      this.expression = expression;
	    }

	    Return.prototype.children = ['expression'];

	    Return.prototype.isStatement = YES;

	    Return.prototype.makeReturn = THIS;

	    Return.prototype.jumps = THIS;

	    Return.prototype.compileToFragments = function(o, level) {
	      var expr, ref3;
	      expr = (ref3 = this.expression) != null ? ref3.makeReturn() : void 0;
	      if (expr && !(expr instanceof Return)) {
	        return expr.compileToFragments(o, level);
	      } else {
	        return Return.__super__.compileToFragments.call(this, o, level);
	      }
	    };

	    Return.prototype.compileNode = function(o) {
	      var answer;
	      answer = [];
	      answer.push(this.makeCode(this.tab + ("return" + (this.expression ? " " : ""))));
	      if (this.expression) {
	        answer = answer.concat(this.expression.compileToFragments(o, LEVEL_PAREN));
	      }
	      answer.push(this.makeCode(";"));
	      return answer;
	    };

	    return Return;

	  })(Base);

	  exports.YieldReturn = YieldReturn = (function(superClass1) {
	    extend1(YieldReturn, superClass1);

	    function YieldReturn() {
	      return YieldReturn.__super__.constructor.apply(this, arguments);
	    }

	    YieldReturn.prototype.compileNode = function(o) {
	      if (o.scope.parent == null) {
	        this.error('yield can only occur inside functions');
	      }
	      return YieldReturn.__super__.compileNode.apply(this, arguments);
	    };

	    return YieldReturn;

	  })(Return);

	  exports.Value = Value = (function(superClass1) {
	    extend1(Value, superClass1);

	    function Value(base, props, tag) {
	      if (!props && base instanceof Value) {
	        return base;
	      }
	      this.base = base;
	      this.properties = props || [];
	      if (tag) {
	        this[tag] = true;
	      }
	      return this;
	    }

	    Value.prototype.children = ['base', 'properties'];

	    Value.prototype.add = function(props) {
	      this.properties = this.properties.concat(props);
	      return this;
	    };

	    Value.prototype.hasProperties = function() {
	      return !!this.properties.length;
	    };

	    Value.prototype.bareLiteral = function(type) {
	      return !this.properties.length && this.base instanceof type;
	    };

	    Value.prototype.isArray = function() {
	      return this.bareLiteral(Arr);
	    };

	    Value.prototype.isRange = function() {
	      return this.bareLiteral(Range);
	    };

	    Value.prototype.isComplex = function() {
	      return this.hasProperties() || this.base.isComplex();
	    };

	    Value.prototype.isAssignable = function() {
	      return this.hasProperties() || this.base.isAssignable();
	    };

	    Value.prototype.isNumber = function() {
	      return this.bareLiteral(NumberLiteral);
	    };

	    Value.prototype.isString = function() {
	      return this.bareLiteral(StringLiteral);
	    };

	    Value.prototype.isRegex = function() {
	      return this.bareLiteral(RegexLiteral);
	    };

	    Value.prototype.isUndefined = function() {
	      return this.bareLiteral(UndefinedLiteral);
	    };

	    Value.prototype.isNull = function() {
	      return this.bareLiteral(NullLiteral);
	    };

	    Value.prototype.isBoolean = function() {
	      return this.bareLiteral(BooleanLiteral);
	    };

	    Value.prototype.isAtomic = function() {
	      var j, len1, node, ref3;
	      ref3 = this.properties.concat(this.base);
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        node = ref3[j];
	        if (node.soak || node instanceof Call) {
	          return false;
	        }
	      }
	      return true;
	    };

	    Value.prototype.isNotCallable = function() {
	      return this.isNumber() || this.isString() || this.isRegex() || this.isArray() || this.isRange() || this.isSplice() || this.isObject() || this.isUndefined() || this.isNull() || this.isBoolean();
	    };

	    Value.prototype.isStatement = function(o) {
	      return !this.properties.length && this.base.isStatement(o);
	    };

	    Value.prototype.assigns = function(name) {
	      return !this.properties.length && this.base.assigns(name);
	    };

	    Value.prototype.jumps = function(o) {
	      return !this.properties.length && this.base.jumps(o);
	    };

	    Value.prototype.isObject = function(onlyGenerated) {
	      if (this.properties.length) {
	        return false;
	      }
	      return (this.base instanceof Obj) && (!onlyGenerated || this.base.generated);
	    };

	    Value.prototype.isSplice = function() {
	      var lastProp, ref3;
	      ref3 = this.properties, lastProp = ref3[ref3.length - 1];
	      return lastProp instanceof Slice;
	    };

	    Value.prototype.looksStatic = function(className) {
	      var ref3;
	      return this.base.value === className && this.properties.length === 1 && ((ref3 = this.properties[0].name) != null ? ref3.value : void 0) !== 'prototype';
	    };

	    Value.prototype.unwrap = function() {
	      if (this.properties.length) {
	        return this;
	      } else {
	        return this.base;
	      }
	    };

	    Value.prototype.cacheReference = function(o) {
	      var base, bref, name, nref, ref3;
	      ref3 = this.properties, name = ref3[ref3.length - 1];
	      if (this.properties.length < 2 && !this.base.isComplex() && !(name != null ? name.isComplex() : void 0)) {
	        return [this, this];
	      }
	      base = new Value(this.base, this.properties.slice(0, -1));
	      if (base.isComplex()) {
	        bref = new IdentifierLiteral(o.scope.freeVariable('base'));
	        base = new Value(new Parens(new Assign(bref, base)));
	      }
	      if (!name) {
	        return [base, bref];
	      }
	      if (name.isComplex()) {
	        nref = new IdentifierLiteral(o.scope.freeVariable('name'));
	        name = new Index(new Assign(nref, name.index));
	        nref = new Index(nref);
	      }
	      return [base.add(name), new Value(bref || base.base, [nref || name])];
	    };

	    Value.prototype.compileNode = function(o) {
	      var fragments, j, len1, prop, props;
	      this.base.front = this.front;
	      props = this.properties;
	      fragments = this.base.compileToFragments(o, (props.length ? LEVEL_ACCESS : null));
	      if (props.length && SIMPLENUM.test(fragmentsToText(fragments))) {
	        fragments.push(this.makeCode('.'));
	      }
	      for (j = 0, len1 = props.length; j < len1; j++) {
	        prop = props[j];
	        fragments.push.apply(fragments, prop.compileToFragments(o));
	      }
	      return fragments;
	    };

	    Value.prototype.unfoldSoak = function(o) {
	      return this.unfoldedSoak != null ? this.unfoldedSoak : this.unfoldedSoak = (function(_this) {
	        return function() {
	          var fst, i, ifn, j, len1, prop, ref, ref3, ref4, snd;
	          if (ifn = _this.base.unfoldSoak(o)) {
	            (ref3 = ifn.body.properties).push.apply(ref3, _this.properties);
	            return ifn;
	          }
	          ref4 = _this.properties;
	          for (i = j = 0, len1 = ref4.length; j < len1; i = ++j) {
	            prop = ref4[i];
	            if (!prop.soak) {
	              continue;
	            }
	            prop.soak = false;
	            fst = new Value(_this.base, _this.properties.slice(0, i));
	            snd = new Value(_this.base, _this.properties.slice(i));
	            if (fst.isComplex()) {
	              ref = new IdentifierLiteral(o.scope.freeVariable('ref'));
	              fst = new Parens(new Assign(ref, fst));
	              snd.base = ref;
	            }
	            return new If(new Existence(fst), snd, {
	              soak: true
	            });
	          }
	          return false;
	        };
	      })(this)();
	    };

	    return Value;

	  })(Base);

	  exports.Comment = Comment = (function(superClass1) {
	    extend1(Comment, superClass1);

	    function Comment(comment1) {
	      this.comment = comment1;
	    }

	    Comment.prototype.isStatement = YES;

	    Comment.prototype.makeReturn = THIS;

	    Comment.prototype.compileNode = function(o, level) {
	      var code, comment;
	      comment = this.comment.replace(/^(\s*)#(?=\s)/gm, "$1 *");
	      code = "/*" + (multident(comment, this.tab)) + (indexOf.call(comment, '\n') >= 0 ? "\n" + this.tab : '') + " */";
	      if ((level || o.level) === LEVEL_TOP) {
	        code = o.indent + code;
	      }
	      return [this.makeCode("\n"), this.makeCode(code)];
	    };

	    return Comment;

	  })(Base);

	  exports.Call = Call = (function(superClass1) {
	    extend1(Call, superClass1);

	    function Call(variable1, args1, soak1) {
	      this.variable = variable1;
	      this.args = args1 != null ? args1 : [];
	      this.soak = soak1;
	      this.isNew = false;
	      if (this.variable instanceof Value && this.variable.isNotCallable()) {
	        this.variable.error("literal is not a function");
	      }
	    }

	    Call.prototype.children = ['variable', 'args'];

	    Call.prototype.updateLocationDataIfMissing = function(locationData) {
	      var base, ref3;
	      if (this.locationData && this.needsUpdatedStartLocation) {
	        this.locationData.first_line = locationData.first_line;
	        this.locationData.first_column = locationData.first_column;
	        base = ((ref3 = this.variable) != null ? ref3.base : void 0) || this.variable;
	        if (base.needsUpdatedStartLocation) {
	          this.variable.locationData.first_line = locationData.first_line;
	          this.variable.locationData.first_column = locationData.first_column;
	          base.updateLocationDataIfMissing(locationData);
	        }
	        delete this.needsUpdatedStartLocation;
	      }
	      return Call.__super__.updateLocationDataIfMissing.apply(this, arguments);
	    };

	    Call.prototype.newInstance = function() {
	      var base, ref3;
	      base = ((ref3 = this.variable) != null ? ref3.base : void 0) || this.variable;
	      if (base instanceof Call && !base.isNew) {
	        base.newInstance();
	      } else {
	        this.isNew = true;
	      }
	      this.needsUpdatedStartLocation = true;
	      return this;
	    };

	    Call.prototype.unfoldSoak = function(o) {
	      var call, ifn, j, left, len1, list, ref3, ref4, rite;
	      if (this.soak) {
	        if (this instanceof SuperCall) {
	          left = new Literal(this.superReference(o));
	          rite = new Value(left);
	        } else {
	          if (ifn = unfoldSoak(o, this, 'variable')) {
	            return ifn;
	          }
	          ref3 = new Value(this.variable).cacheReference(o), left = ref3[0], rite = ref3[1];
	        }
	        rite = new Call(rite, this.args);
	        rite.isNew = this.isNew;
	        left = new Literal("typeof " + (left.compile(o)) + " === \"function\"");
	        return new If(left, new Value(rite), {
	          soak: true
	        });
	      }
	      call = this;
	      list = [];
	      while (true) {
	        if (call.variable instanceof Call) {
	          list.push(call);
	          call = call.variable;
	          continue;
	        }
	        if (!(call.variable instanceof Value)) {
	          break;
	        }
	        list.push(call);
	        if (!((call = call.variable.base) instanceof Call)) {
	          break;
	        }
	      }
	      ref4 = list.reverse();
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        call = ref4[j];
	        if (ifn) {
	          if (call.variable instanceof Call) {
	            call.variable = ifn;
	          } else {
	            call.variable.base = ifn;
	          }
	        }
	        ifn = unfoldSoak(o, call, 'variable');
	      }
	      return ifn;
	    };

	    Call.prototype.compileNode = function(o) {
	      var arg, argIndex, compiledArgs, compiledArray, fragments, j, len1, preface, ref3, ref4;
	      if ((ref3 = this.variable) != null) {
	        ref3.front = this.front;
	      }
	      compiledArray = Splat.compileSplattedArray(o, this.args, true);
	      if (compiledArray.length) {
	        return this.compileSplat(o, compiledArray);
	      }
	      compiledArgs = [];
	      ref4 = this.args;
	      for (argIndex = j = 0, len1 = ref4.length; j < len1; argIndex = ++j) {
	        arg = ref4[argIndex];
	        if (argIndex) {
	          compiledArgs.push(this.makeCode(", "));
	        }
	        compiledArgs.push.apply(compiledArgs, arg.compileToFragments(o, LEVEL_LIST));
	      }
	      fragments = [];
	      if (this instanceof SuperCall) {
	        preface = this.superReference(o) + (".call(" + (this.superThis(o)));
	        if (compiledArgs.length) {
	          preface += ", ";
	        }
	        fragments.push(this.makeCode(preface));
	      } else {
	        if (this.isNew) {
	          fragments.push(this.makeCode('new '));
	        }
	        fragments.push.apply(fragments, this.variable.compileToFragments(o, LEVEL_ACCESS));
	        fragments.push(this.makeCode("("));
	      }
	      fragments.push.apply(fragments, compiledArgs);
	      fragments.push(this.makeCode(")"));
	      return fragments;
	    };

	    Call.prototype.compileSplat = function(o, splatArgs) {
	      var answer, base, fun, idt, name, ref;
	      if (this instanceof SuperCall) {
	        return [].concat(this.makeCode((this.superReference(o)) + ".apply(" + (this.superThis(o)) + ", "), splatArgs, this.makeCode(")"));
	      }
	      if (this.isNew) {
	        idt = this.tab + TAB;
	        return [].concat(this.makeCode("(function(func, args, ctor) {\n" + idt + "ctor.prototype = func.prototype;\n" + idt + "var child = new ctor, result = func.apply(child, args);\n" + idt + "return Object(result) === result ? result : child;\n" + this.tab + "})("), this.variable.compileToFragments(o, LEVEL_LIST), this.makeCode(", "), splatArgs, this.makeCode(", function(){})"));
	      }
	      answer = [];
	      base = new Value(this.variable);
	      if ((name = base.properties.pop()) && base.isComplex()) {
	        ref = o.scope.freeVariable('ref');
	        answer = answer.concat(this.makeCode("(" + ref + " = "), base.compileToFragments(o, LEVEL_LIST), this.makeCode(")"), name.compileToFragments(o));
	      } else {
	        fun = base.compileToFragments(o, LEVEL_ACCESS);
	        if (SIMPLENUM.test(fragmentsToText(fun))) {
	          fun = this.wrapInBraces(fun);
	        }
	        if (name) {
	          ref = fragmentsToText(fun);
	          fun.push.apply(fun, name.compileToFragments(o));
	        } else {
	          ref = 'null';
	        }
	        answer = answer.concat(fun);
	      }
	      return answer = answer.concat(this.makeCode(".apply(" + ref + ", "), splatArgs, this.makeCode(")"));
	    };

	    return Call;

	  })(Base);

	  exports.SuperCall = SuperCall = (function(superClass1) {
	    extend1(SuperCall, superClass1);

	    function SuperCall(args) {
	      SuperCall.__super__.constructor.call(this, null, args != null ? args : [new Splat(new IdentifierLiteral('arguments'))]);
	      this.isBare = args != null;
	    }

	    SuperCall.prototype.superReference = function(o) {
	      var accesses, base, bref, klass, method, name, nref, variable;
	      method = o.scope.namedMethod();
	      if (method != null ? method.klass : void 0) {
	        klass = method.klass, name = method.name, variable = method.variable;
	        if (klass.isComplex()) {
	          bref = new IdentifierLiteral(o.scope.parent.freeVariable('base'));
	          base = new Value(new Parens(new Assign(bref, klass)));
	          variable.base = base;
	          variable.properties.splice(0, klass.properties.length);
	        }
	        if (name.isComplex() || (name instanceof Index && name.index.isAssignable())) {
	          nref = new IdentifierLiteral(o.scope.parent.freeVariable('name'));
	          name = new Index(new Assign(nref, name.index));
	          variable.properties.pop();
	          variable.properties.push(name);
	        }
	        accesses = [new Access(new PropertyName('__super__'))];
	        if (method["static"]) {
	          accesses.push(new Access(new PropertyName('constructor')));
	        }
	        accesses.push(nref != null ? new Index(nref) : name);
	        return (new Value(bref != null ? bref : klass, accesses)).compile(o);
	      } else if (method != null ? method.ctor : void 0) {
	        return method.name + ".__super__.constructor";
	      } else {
	        return this.error('cannot call super outside of an instance method.');
	      }
	    };

	    SuperCall.prototype.superThis = function(o) {
	      var method;
	      method = o.scope.method;
	      return (method && !method.klass && method.context) || "this";
	    };

	    return SuperCall;

	  })(Call);

	  exports.RegexWithInterpolations = RegexWithInterpolations = (function(superClass1) {
	    extend1(RegexWithInterpolations, superClass1);

	    function RegexWithInterpolations(args) {
	      if (args == null) {
	        args = [];
	      }
	      RegexWithInterpolations.__super__.constructor.call(this, new Value(new IdentifierLiteral('RegExp')), args, false);
	    }

	    return RegexWithInterpolations;

	  })(Call);

	  exports.TaggedTemplateCall = TaggedTemplateCall = (function(superClass1) {
	    extend1(TaggedTemplateCall, superClass1);

	    function TaggedTemplateCall(variable, arg, soak) {
	      if (arg instanceof StringLiteral) {
	        arg = new StringWithInterpolations(Block.wrap([new Value(arg)]));
	      }
	      TaggedTemplateCall.__super__.constructor.call(this, variable, [arg], soak);
	    }

	    TaggedTemplateCall.prototype.compileNode = function(o) {
	      o.inTaggedTemplateCall = true;
	      return this.variable.compileToFragments(o, LEVEL_ACCESS).concat(this.args[0].compileToFragments(o, LEVEL_LIST));
	    };

	    return TaggedTemplateCall;

	  })(Call);

	  exports.Extends = Extends = (function(superClass1) {
	    extend1(Extends, superClass1);

	    function Extends(child1, parent1) {
	      this.child = child1;
	      this.parent = parent1;
	    }

	    Extends.prototype.children = ['child', 'parent'];

	    Extends.prototype.compileToFragments = function(o) {
	      return new Call(new Value(new Literal(utility('extend', o))), [this.child, this.parent]).compileToFragments(o);
	    };

	    return Extends;

	  })(Base);

	  exports.Access = Access = (function(superClass1) {
	    extend1(Access, superClass1);

	    function Access(name1, tag) {
	      this.name = name1;
	      this.soak = tag === 'soak';
	    }

	    Access.prototype.children = ['name'];

	    Access.prototype.compileToFragments = function(o) {
	      var name, node, ref3;
	      name = this.name.compileToFragments(o);
	      node = this.name.unwrap();
	      if (node instanceof PropertyName) {
	        if (ref3 = node.value, indexOf.call(JS_FORBIDDEN, ref3) >= 0) {
	          return [this.makeCode('["')].concat(slice.call(name), [this.makeCode('"]')]);
	        } else {
	          return [this.makeCode('.')].concat(slice.call(name));
	        }
	      } else {
	        return [this.makeCode('[')].concat(slice.call(name), [this.makeCode(']')]);
	      }
	    };

	    Access.prototype.isComplex = NO;

	    return Access;

	  })(Base);

	  exports.Index = Index = (function(superClass1) {
	    extend1(Index, superClass1);

	    function Index(index1) {
	      this.index = index1;
	    }

	    Index.prototype.children = ['index'];

	    Index.prototype.compileToFragments = function(o) {
	      return [].concat(this.makeCode("["), this.index.compileToFragments(o, LEVEL_PAREN), this.makeCode("]"));
	    };

	    Index.prototype.isComplex = function() {
	      return this.index.isComplex();
	    };

	    return Index;

	  })(Base);

	  exports.Range = Range = (function(superClass1) {
	    extend1(Range, superClass1);

	    Range.prototype.children = ['from', 'to'];

	    function Range(from1, to1, tag) {
	      this.from = from1;
	      this.to = to1;
	      this.exclusive = tag === 'exclusive';
	      this.equals = this.exclusive ? '' : '=';
	    }

	    Range.prototype.compileVariables = function(o) {
	      var isComplex, ref3, ref4, ref5, step;
	      o = merge(o, {
	        top: true
	      });
	      isComplex = del(o, 'isComplex');
	      ref3 = this.cacheToCodeFragments(this.from.cache(o, LEVEL_LIST, isComplex)), this.fromC = ref3[0], this.fromVar = ref3[1];
	      ref4 = this.cacheToCodeFragments(this.to.cache(o, LEVEL_LIST, isComplex)), this.toC = ref4[0], this.toVar = ref4[1];
	      if (step = del(o, 'step')) {
	        ref5 = this.cacheToCodeFragments(step.cache(o, LEVEL_LIST, isComplex)), this.step = ref5[0], this.stepVar = ref5[1];
	      }
	      this.fromNum = this.from.isNumber() ? Number(this.fromVar) : null;
	      this.toNum = this.to.isNumber() ? Number(this.toVar) : null;
	      return this.stepNum = (step != null ? step.isNumber() : void 0) ? Number(this.stepVar) : null;
	    };

	    Range.prototype.compileNode = function(o) {
	      var cond, condPart, from, gt, idx, idxName, known, lt, namedIndex, ref3, ref4, stepPart, to, varPart;
	      if (!this.fromVar) {
	        this.compileVariables(o);
	      }
	      if (!o.index) {
	        return this.compileArray(o);
	      }
	      known = (this.fromNum != null) && (this.toNum != null);
	      idx = del(o, 'index');
	      idxName = del(o, 'name');
	      namedIndex = idxName && idxName !== idx;
	      varPart = idx + " = " + this.fromC;
	      if (this.toC !== this.toVar) {
	        varPart += ", " + this.toC;
	      }
	      if (this.step !== this.stepVar) {
	        varPart += ", " + this.step;
	      }
	      ref3 = [idx + " <" + this.equals, idx + " >" + this.equals], lt = ref3[0], gt = ref3[1];
	      condPart = this.stepNum != null ? this.stepNum > 0 ? lt + " " + this.toVar : gt + " " + this.toVar : known ? ((ref4 = [this.fromNum, this.toNum], from = ref4[0], to = ref4[1], ref4), from <= to ? lt + " " + to : gt + " " + to) : (cond = this.stepVar ? this.stepVar + " > 0" : this.fromVar + " <= " + this.toVar, cond + " ? " + lt + " " + this.toVar + " : " + gt + " " + this.toVar);
	      stepPart = this.stepVar ? idx + " += " + this.stepVar : known ? namedIndex ? from <= to ? "++" + idx : "--" + idx : from <= to ? idx + "++" : idx + "--" : namedIndex ? cond + " ? ++" + idx + " : --" + idx : cond + " ? " + idx + "++ : " + idx + "--";
	      if (namedIndex) {
	        varPart = idxName + " = " + varPart;
	      }
	      if (namedIndex) {
	        stepPart = idxName + " = " + stepPart;
	      }
	      return [this.makeCode(varPart + "; " + condPart + "; " + stepPart)];
	    };

	    Range.prototype.compileArray = function(o) {
	      var args, body, cond, hasArgs, i, idt, j, known, post, pre, range, ref3, ref4, result, results, vars;
	      known = (this.fromNum != null) && (this.toNum != null);
	      if (known && Math.abs(this.fromNum - this.toNum) <= 20) {
	        range = (function() {
	          results = [];
	          for (var j = ref3 = this.fromNum, ref4 = this.toNum; ref3 <= ref4 ? j <= ref4 : j >= ref4; ref3 <= ref4 ? j++ : j--){ results.push(j); }
	          return results;
	        }).apply(this);
	        if (this.exclusive) {
	          range.pop();
	        }
	        return [this.makeCode("[" + (range.join(', ')) + "]")];
	      }
	      idt = this.tab + TAB;
	      i = o.scope.freeVariable('i', {
	        single: true
	      });
	      result = o.scope.freeVariable('results');
	      pre = "\n" + idt + result + " = [];";
	      if (known) {
	        o.index = i;
	        body = fragmentsToText(this.compileNode(o));
	      } else {
	        vars = (i + " = " + this.fromC) + (this.toC !== this.toVar ? ", " + this.toC : '');
	        cond = this.fromVar + " <= " + this.toVar;
	        body = "var " + vars + "; " + cond + " ? " + i + " <" + this.equals + " " + this.toVar + " : " + i + " >" + this.equals + " " + this.toVar + "; " + cond + " ? " + i + "++ : " + i + "--";
	      }
	      post = "{ " + result + ".push(" + i + "); }\n" + idt + "return " + result + ";\n" + o.indent;
	      hasArgs = function(node) {
	        return node != null ? node.contains(isLiteralArguments) : void 0;
	      };
	      if (hasArgs(this.from) || hasArgs(this.to)) {
	        args = ', arguments';
	      }
	      return [this.makeCode("(function() {" + pre + "\n" + idt + "for (" + body + ")" + post + "}).apply(this" + (args != null ? args : '') + ")")];
	    };

	    return Range;

	  })(Base);

	  exports.Slice = Slice = (function(superClass1) {
	    extend1(Slice, superClass1);

	    Slice.prototype.children = ['range'];

	    function Slice(range1) {
	      this.range = range1;
	      Slice.__super__.constructor.call(this);
	    }

	    Slice.prototype.compileNode = function(o) {
	      var compiled, compiledText, from, fromCompiled, ref3, to, toStr;
	      ref3 = this.range, to = ref3.to, from = ref3.from;
	      fromCompiled = from && from.compileToFragments(o, LEVEL_PAREN) || [this.makeCode('0')];
	      if (to) {
	        compiled = to.compileToFragments(o, LEVEL_PAREN);
	        compiledText = fragmentsToText(compiled);
	        if (!(!this.range.exclusive && +compiledText === -1)) {
	          toStr = ', ' + (this.range.exclusive ? compiledText : to.isNumber() ? "" + (+compiledText + 1) : (compiled = to.compileToFragments(o, LEVEL_ACCESS), "+" + (fragmentsToText(compiled)) + " + 1 || 9e9"));
	        }
	      }
	      return [this.makeCode(".slice(" + (fragmentsToText(fromCompiled)) + (toStr || '') + ")")];
	    };

	    return Slice;

	  })(Base);

	  exports.Obj = Obj = (function(superClass1) {
	    extend1(Obj, superClass1);

	    function Obj(props, generated) {
	      this.generated = generated != null ? generated : false;
	      this.objects = this.properties = props || [];
	    }

	    Obj.prototype.children = ['properties'];

	    Obj.prototype.compileNode = function(o) {
	      var answer, dynamicIndex, hasDynamic, i, idt, indent, j, join, k, key, l, lastNoncom, len1, len2, len3, node, oref, prop, props, ref3, value;
	      props = this.properties;
	      if (this.generated) {
	        for (j = 0, len1 = props.length; j < len1; j++) {
	          node = props[j];
	          if (node instanceof Value) {
	            node.error('cannot have an implicit value in an implicit object');
	          }
	        }
	      }
	      for (dynamicIndex = k = 0, len2 = props.length; k < len2; dynamicIndex = ++k) {
	        prop = props[dynamicIndex];
	        if ((prop.variable || prop).base instanceof Parens) {
	          break;
	        }
	      }
	      hasDynamic = dynamicIndex < props.length;
	      idt = o.indent += TAB;
	      lastNoncom = this.lastNonComment(this.properties);
	      answer = [];
	      if (hasDynamic) {
	        oref = o.scope.freeVariable('obj');
	        answer.push(this.makeCode("(\n" + idt + oref + " = "));
	      }
	      answer.push(this.makeCode("{" + (props.length === 0 || dynamicIndex === 0 ? '}' : '\n')));
	      for (i = l = 0, len3 = props.length; l < len3; i = ++l) {
	        prop = props[i];
	        if (i === dynamicIndex) {
	          if (i !== 0) {
	            answer.push(this.makeCode("\n" + idt + "}"));
	          }
	          answer.push(this.makeCode(',\n'));
	        }
	        join = i === props.length - 1 || i === dynamicIndex - 1 ? '' : prop === lastNoncom || prop instanceof Comment ? '\n' : ',\n';
	        indent = prop instanceof Comment ? '' : idt;
	        if (hasDynamic && i < dynamicIndex) {
	          indent += TAB;
	        }
	        if (prop instanceof Assign) {
	          if (prop.context !== 'object') {
	            prop.operatorToken.error("unexpected " + prop.operatorToken.value);
	          }
	          if (prop.variable instanceof Value && prop.variable.hasProperties()) {
	            prop.variable.error('invalid object key');
	          }
	        }
	        if (prop instanceof Value && prop["this"]) {
	          prop = new Assign(prop.properties[0].name, prop, 'object');
	        }
	        if (!(prop instanceof Comment)) {
	          if (i < dynamicIndex) {
	            if (!(prop instanceof Assign)) {
	              prop = new Assign(prop, prop, 'object');
	            }
	          } else {
	            if (prop instanceof Assign) {
	              key = prop.variable;
	              value = prop.value;
	            } else {
	              ref3 = prop.base.cache(o), key = ref3[0], value = ref3[1];
	              if (key instanceof IdentifierLiteral) {
	                key = new PropertyName(key.value);
	              }
	            }
	            prop = new Assign(new Value(new IdentifierLiteral(oref), [new Access(key)]), value);
	          }
	        }
	        if (indent) {
	          answer.push(this.makeCode(indent));
	        }
	        answer.push.apply(answer, prop.compileToFragments(o, LEVEL_TOP));
	        if (join) {
	          answer.push(this.makeCode(join));
	        }
	      }
	      if (hasDynamic) {
	        answer.push(this.makeCode(",\n" + idt + oref + "\n" + this.tab + ")"));
	      } else {
	        if (props.length !== 0) {
	          answer.push(this.makeCode("\n" + this.tab + "}"));
	        }
	      }
	      if (this.front && !hasDynamic) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Obj.prototype.assigns = function(name) {
	      var j, len1, prop, ref3;
	      ref3 = this.properties;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        prop = ref3[j];
	        if (prop.assigns(name)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    return Obj;

	  })(Base);

	  exports.Arr = Arr = (function(superClass1) {
	    extend1(Arr, superClass1);

	    function Arr(objs) {
	      this.objects = objs || [];
	    }

	    Arr.prototype.children = ['objects'];

	    Arr.prototype.compileNode = function(o) {
	      var answer, compiledObjs, fragments, index, j, len1, obj;
	      if (!this.objects.length) {
	        return [this.makeCode('[]')];
	      }
	      o.indent += TAB;
	      answer = Splat.compileSplattedArray(o, this.objects);
	      if (answer.length) {
	        return answer;
	      }
	      answer = [];
	      compiledObjs = (function() {
	        var j, len1, ref3, results;
	        ref3 = this.objects;
	        results = [];
	        for (j = 0, len1 = ref3.length; j < len1; j++) {
	          obj = ref3[j];
	          results.push(obj.compileToFragments(o, LEVEL_LIST));
	        }
	        return results;
	      }).call(this);
	      for (index = j = 0, len1 = compiledObjs.length; j < len1; index = ++j) {
	        fragments = compiledObjs[index];
	        if (index) {
	          answer.push(this.makeCode(", "));
	        }
	        answer.push.apply(answer, fragments);
	      }
	      if (fragmentsToText(answer).indexOf('\n') >= 0) {
	        answer.unshift(this.makeCode("[\n" + o.indent));
	        answer.push(this.makeCode("\n" + this.tab + "]"));
	      } else {
	        answer.unshift(this.makeCode("["));
	        answer.push(this.makeCode("]"));
	      }
	      return answer;
	    };

	    Arr.prototype.assigns = function(name) {
	      var j, len1, obj, ref3;
	      ref3 = this.objects;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        obj = ref3[j];
	        if (obj.assigns(name)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    return Arr;

	  })(Base);

	  exports.Class = Class = (function(superClass1) {
	    extend1(Class, superClass1);

	    function Class(variable1, parent1, body1) {
	      this.variable = variable1;
	      this.parent = parent1;
	      this.body = body1 != null ? body1 : new Block;
	      this.boundFuncs = [];
	      this.body.classBody = true;
	    }

	    Class.prototype.children = ['variable', 'parent', 'body'];

	    Class.prototype.defaultClassVariableName = '_Class';

	    Class.prototype.determineName = function() {
	      var message, name, node, ref3, tail;
	      if (!this.variable) {
	        return this.defaultClassVariableName;
	      }
	      ref3 = this.variable.properties, tail = ref3[ref3.length - 1];
	      node = tail ? tail instanceof Access && tail.name : this.variable.base;
	      if (!(node instanceof IdentifierLiteral || node instanceof PropertyName)) {
	        return this.defaultClassVariableName;
	      }
	      name = node.value;
	      if (!tail) {
	        message = isUnassignable(name);
	        if (message) {
	          this.variable.error(message);
	        }
	      }
	      if (indexOf.call(JS_FORBIDDEN, name) >= 0) {
	        return "_" + name;
	      } else {
	        return name;
	      }
	    };

	    Class.prototype.setContext = function(name) {
	      return this.body.traverseChildren(false, function(node) {
	        if (node.classBody) {
	          return false;
	        }
	        if (node instanceof ThisLiteral) {
	          return node.value = name;
	        } else if (node instanceof Code) {
	          if (node.bound) {
	            return node.context = name;
	          }
	        }
	      });
	    };

	    Class.prototype.addBoundFunctions = function(o) {
	      var bvar, j, len1, lhs, ref3;
	      ref3 = this.boundFuncs;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        bvar = ref3[j];
	        lhs = (new Value(new ThisLiteral, [new Access(bvar)])).compile(o);
	        this.ctor.body.unshift(new Literal(lhs + " = " + (utility('bind', o)) + "(" + lhs + ", this)"));
	      }
	    };

	    Class.prototype.addProperties = function(node, name, o) {
	      var acc, assign, base, exprs, func, props;
	      props = node.base.properties.slice(0);
	      exprs = (function() {
	        var results;
	        results = [];
	        while (assign = props.shift()) {
	          if (assign instanceof Assign) {
	            base = assign.variable.base;
	            delete assign.context;
	            func = assign.value;
	            if (base.value === 'constructor') {
	              if (this.ctor) {
	                assign.error('cannot define more than one constructor in a class');
	              }
	              if (func.bound) {
	                assign.error('cannot define a constructor as a bound function');
	              }
	              if (func instanceof Code) {
	                assign = this.ctor = func;
	              } else {
	                this.externalCtor = o.classScope.freeVariable('ctor');
	                assign = new Assign(new IdentifierLiteral(this.externalCtor), func);
	              }
	            } else {
	              if (assign.variable["this"]) {
	                func["static"] = true;
	              } else {
	                acc = base.isComplex() ? new Index(base) : new Access(base);
	                assign.variable = new Value(new IdentifierLiteral(name), [new Access(new PropertyName('prototype')), acc]);
	                if (func instanceof Code && func.bound) {
	                  this.boundFuncs.push(base);
	                  func.bound = false;
	                }
	              }
	            }
	          }
	          results.push(assign);
	        }
	        return results;
	      }).call(this);
	      return compact(exprs);
	    };

	    Class.prototype.walkBody = function(name, o) {
	      return this.traverseChildren(false, (function(_this) {
	        return function(child) {
	          var cont, exps, i, j, len1, node, ref3;
	          cont = true;
	          if (child instanceof Class) {
	            return false;
	          }
	          if (child instanceof Block) {
	            ref3 = exps = child.expressions;
	            for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	              node = ref3[i];
	              if (node instanceof Assign && node.variable.looksStatic(name)) {
	                node.value["static"] = true;
	              } else if (node instanceof Value && node.isObject(true)) {
	                cont = false;
	                exps[i] = _this.addProperties(node, name, o);
	              }
	            }
	            child.expressions = exps = flatten(exps);
	          }
	          return cont && !(child instanceof Class);
	        };
	      })(this));
	    };

	    Class.prototype.hoistDirectivePrologue = function() {
	      var expressions, index, node;
	      index = 0;
	      expressions = this.body.expressions;
	      while ((node = expressions[index]) && node instanceof Comment || node instanceof Value && node.isString()) {
	        ++index;
	      }
	      return this.directives = expressions.splice(0, index);
	    };

	    Class.prototype.ensureConstructor = function(name) {
	      if (!this.ctor) {
	        this.ctor = new Code;
	        if (this.externalCtor) {
	          this.ctor.body.push(new Literal(this.externalCtor + ".apply(this, arguments)"));
	        } else if (this.parent) {
	          this.ctor.body.push(new Literal(name + ".__super__.constructor.apply(this, arguments)"));
	        }
	        this.ctor.body.makeReturn();
	        this.body.expressions.unshift(this.ctor);
	      }
	      this.ctor.ctor = this.ctor.name = name;
	      this.ctor.klass = null;
	      return this.ctor.noReturn = true;
	    };

	    Class.prototype.compileNode = function(o) {
	      var args, argumentsNode, func, jumpNode, klass, lname, name, ref3, superClass;
	      if (jumpNode = this.body.jumps()) {
	        jumpNode.error('Class bodies cannot contain pure statements');
	      }
	      if (argumentsNode = this.body.contains(isLiteralArguments)) {
	        argumentsNode.error("Class bodies shouldn't reference arguments");
	      }
	      name = this.determineName();
	      lname = new IdentifierLiteral(name);
	      func = new Code([], Block.wrap([this.body]));
	      args = [];
	      o.classScope = func.makeScope(o.scope);
	      this.hoistDirectivePrologue();
	      this.setContext(name);
	      this.walkBody(name, o);
	      this.ensureConstructor(name);
	      this.addBoundFunctions(o);
	      this.body.spaced = true;
	      this.body.expressions.push(lname);
	      if (this.parent) {
	        superClass = new IdentifierLiteral(o.classScope.freeVariable('superClass', {
	          reserve: false
	        }));
	        this.body.expressions.unshift(new Extends(lname, superClass));
	        func.params.push(new Param(superClass));
	        args.push(this.parent);
	      }
	      (ref3 = this.body.expressions).unshift.apply(ref3, this.directives);
	      klass = new Parens(new Call(func, args));
	      if (this.variable) {
	        klass = new Assign(this.variable, klass, null, {
	          moduleDeclaration: this.moduleDeclaration
	        });
	      }
	      return klass.compileToFragments(o);
	    };

	    return Class;

	  })(Base);

	  exports.ModuleDeclaration = ModuleDeclaration = (function(superClass1) {
	    extend1(ModuleDeclaration, superClass1);

	    function ModuleDeclaration(clause, source1) {
	      this.clause = clause;
	      this.source = source1;
	      this.checkSource();
	    }

	    ModuleDeclaration.prototype.children = ['clause', 'source'];

	    ModuleDeclaration.prototype.isStatement = YES;

	    ModuleDeclaration.prototype.jumps = THIS;

	    ModuleDeclaration.prototype.makeReturn = THIS;

	    ModuleDeclaration.prototype.checkSource = function() {
	      if ((this.source != null) && this.source instanceof StringWithInterpolations) {
	        return this.source.error('the name of the module to be imported from must be an uninterpolated string');
	      }
	    };

	    ModuleDeclaration.prototype.checkScope = function(o, moduleDeclarationType) {
	      if (o.indent.length !== 0) {
	        return this.error(moduleDeclarationType + " statements must be at top-level scope");
	      }
	    };

	    return ModuleDeclaration;

	  })(Base);

	  exports.ImportDeclaration = ImportDeclaration = (function(superClass1) {
	    extend1(ImportDeclaration, superClass1);

	    function ImportDeclaration() {
	      return ImportDeclaration.__super__.constructor.apply(this, arguments);
	    }

	    ImportDeclaration.prototype.compileNode = function(o) {
	      var code, ref3;
	      this.checkScope(o, 'import');
	      o.importedSymbols = [];
	      code = [];
	      code.push(this.makeCode(this.tab + "import "));
	      if (this.clause != null) {
	        code.push.apply(code, this.clause.compileNode(o));
	      }
	      if (((ref3 = this.source) != null ? ref3.value : void 0) != null) {
	        if (this.clause !== null) {
	          code.push(this.makeCode(' from '));
	        }
	        code.push(this.makeCode(this.source.value));
	      }
	      code.push(this.makeCode(';'));
	      return code;
	    };

	    return ImportDeclaration;

	  })(ModuleDeclaration);

	  exports.ImportClause = ImportClause = (function(superClass1) {
	    extend1(ImportClause, superClass1);

	    function ImportClause(defaultBinding, namedImports) {
	      this.defaultBinding = defaultBinding;
	      this.namedImports = namedImports;
	    }

	    ImportClause.prototype.children = ['defaultBinding', 'namedImports'];

	    ImportClause.prototype.compileNode = function(o) {
	      var code;
	      code = [];
	      if (this.defaultBinding != null) {
	        code.push.apply(code, this.defaultBinding.compileNode(o));
	        if (this.namedImports != null) {
	          code.push(this.makeCode(', '));
	        }
	      }
	      if (this.namedImports != null) {
	        code.push.apply(code, this.namedImports.compileNode(o));
	      }
	      return code;
	    };

	    return ImportClause;

	  })(Base);

	  exports.ExportDeclaration = ExportDeclaration = (function(superClass1) {
	    extend1(ExportDeclaration, superClass1);

	    function ExportDeclaration() {
	      return ExportDeclaration.__super__.constructor.apply(this, arguments);
	    }

	    ExportDeclaration.prototype.compileNode = function(o) {
	      var code, ref3;
	      this.checkScope(o, 'export');
	      code = [];
	      code.push(this.makeCode(this.tab + "export "));
	      if (this instanceof ExportDefaultDeclaration) {
	        code.push(this.makeCode('default '));
	      }
	      if (!(this instanceof ExportDefaultDeclaration) && (this.clause instanceof Assign || this.clause instanceof Class)) {
	        if (this.clause instanceof Class && !this.clause.variable) {
	          this.clause.error('anonymous classes cannot be exported');
	        }
	        code.push(this.makeCode('var '));
	        this.clause.moduleDeclaration = 'export';
	      }
	      if ((this.clause.body != null) && this.clause.body instanceof Block) {
	        code = code.concat(this.clause.compileToFragments(o, LEVEL_TOP));
	      } else {
	        code = code.concat(this.clause.compileNode(o));
	      }
	      if (((ref3 = this.source) != null ? ref3.value : void 0) != null) {
	        code.push(this.makeCode(" from " + this.source.value));
	      }
	      code.push(this.makeCode(';'));
	      return code;
	    };

	    return ExportDeclaration;

	  })(ModuleDeclaration);

	  exports.ExportNamedDeclaration = ExportNamedDeclaration = (function(superClass1) {
	    extend1(ExportNamedDeclaration, superClass1);

	    function ExportNamedDeclaration() {
	      return ExportNamedDeclaration.__super__.constructor.apply(this, arguments);
	    }

	    return ExportNamedDeclaration;

	  })(ExportDeclaration);

	  exports.ExportDefaultDeclaration = ExportDefaultDeclaration = (function(superClass1) {
	    extend1(ExportDefaultDeclaration, superClass1);

	    function ExportDefaultDeclaration() {
	      return ExportDefaultDeclaration.__super__.constructor.apply(this, arguments);
	    }

	    return ExportDefaultDeclaration;

	  })(ExportDeclaration);

	  exports.ExportAllDeclaration = ExportAllDeclaration = (function(superClass1) {
	    extend1(ExportAllDeclaration, superClass1);

	    function ExportAllDeclaration() {
	      return ExportAllDeclaration.__super__.constructor.apply(this, arguments);
	    }

	    return ExportAllDeclaration;

	  })(ExportDeclaration);

	  exports.ModuleSpecifierList = ModuleSpecifierList = (function(superClass1) {
	    extend1(ModuleSpecifierList, superClass1);

	    function ModuleSpecifierList(specifiers) {
	      this.specifiers = specifiers;
	    }

	    ModuleSpecifierList.prototype.children = ['specifiers'];

	    ModuleSpecifierList.prototype.compileNode = function(o) {
	      var code, compiledList, fragments, index, j, len1, specifier;
	      code = [];
	      o.indent += TAB;
	      compiledList = (function() {
	        var j, len1, ref3, results;
	        ref3 = this.specifiers;
	        results = [];
	        for (j = 0, len1 = ref3.length; j < len1; j++) {
	          specifier = ref3[j];
	          results.push(specifier.compileToFragments(o, LEVEL_LIST));
	        }
	        return results;
	      }).call(this);
	      if (this.specifiers.length !== 0) {
	        code.push(this.makeCode("{\n" + o.indent));
	        for (index = j = 0, len1 = compiledList.length; j < len1; index = ++j) {
	          fragments = compiledList[index];
	          if (index) {
	            code.push(this.makeCode(",\n" + o.indent));
	          }
	          code.push.apply(code, fragments);
	        }
	        code.push(this.makeCode("\n}"));
	      } else {
	        code.push(this.makeCode('{}'));
	      }
	      return code;
	    };

	    return ModuleSpecifierList;

	  })(Base);

	  exports.ImportSpecifierList = ImportSpecifierList = (function(superClass1) {
	    extend1(ImportSpecifierList, superClass1);

	    function ImportSpecifierList() {
	      return ImportSpecifierList.__super__.constructor.apply(this, arguments);
	    }

	    return ImportSpecifierList;

	  })(ModuleSpecifierList);

	  exports.ExportSpecifierList = ExportSpecifierList = (function(superClass1) {
	    extend1(ExportSpecifierList, superClass1);

	    function ExportSpecifierList() {
	      return ExportSpecifierList.__super__.constructor.apply(this, arguments);
	    }

	    return ExportSpecifierList;

	  })(ModuleSpecifierList);

	  exports.ModuleSpecifier = ModuleSpecifier = (function(superClass1) {
	    extend1(ModuleSpecifier, superClass1);

	    function ModuleSpecifier(original, alias, moduleDeclarationType1) {
	      this.original = original;
	      this.alias = alias;
	      this.moduleDeclarationType = moduleDeclarationType1;
	      this.identifier = this.alias != null ? this.alias.value : this.original.value;
	    }

	    ModuleSpecifier.prototype.children = ['original', 'alias'];

	    ModuleSpecifier.prototype.compileNode = function(o) {
	      var code;
	      o.scope.find(this.identifier, this.moduleDeclarationType);
	      code = [];
	      code.push(this.makeCode(this.original.value));
	      if (this.alias != null) {
	        code.push(this.makeCode(" as " + this.alias.value));
	      }
	      return code;
	    };

	    return ModuleSpecifier;

	  })(Base);

	  exports.ImportSpecifier = ImportSpecifier = (function(superClass1) {
	    extend1(ImportSpecifier, superClass1);

	    function ImportSpecifier(imported, local) {
	      ImportSpecifier.__super__.constructor.call(this, imported, local, 'import');
	    }

	    ImportSpecifier.prototype.compileNode = function(o) {
	      var ref3;
	      if ((ref3 = this.identifier, indexOf.call(o.importedSymbols, ref3) >= 0) || o.scope.check(this.identifier)) {
	        this.error("'" + this.identifier + "' has already been declared");
	      } else {
	        o.importedSymbols.push(this.identifier);
	      }
	      return ImportSpecifier.__super__.compileNode.call(this, o);
	    };

	    return ImportSpecifier;

	  })(ModuleSpecifier);

	  exports.ImportDefaultSpecifier = ImportDefaultSpecifier = (function(superClass1) {
	    extend1(ImportDefaultSpecifier, superClass1);

	    function ImportDefaultSpecifier() {
	      return ImportDefaultSpecifier.__super__.constructor.apply(this, arguments);
	    }

	    return ImportDefaultSpecifier;

	  })(ImportSpecifier);

	  exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier = (function(superClass1) {
	    extend1(ImportNamespaceSpecifier, superClass1);

	    function ImportNamespaceSpecifier() {
	      return ImportNamespaceSpecifier.__super__.constructor.apply(this, arguments);
	    }

	    return ImportNamespaceSpecifier;

	  })(ImportSpecifier);

	  exports.ExportSpecifier = ExportSpecifier = (function(superClass1) {
	    extend1(ExportSpecifier, superClass1);

	    function ExportSpecifier(local, exported) {
	      ExportSpecifier.__super__.constructor.call(this, local, exported, 'export');
	    }

	    return ExportSpecifier;

	  })(ModuleSpecifier);

	  exports.Assign = Assign = (function(superClass1) {
	    extend1(Assign, superClass1);

	    function Assign(variable1, value1, context, options) {
	      this.variable = variable1;
	      this.value = value1;
	      this.context = context;
	      if (options == null) {
	        options = {};
	      }
	      this.param = options.param, this.subpattern = options.subpattern, this.operatorToken = options.operatorToken, this.moduleDeclaration = options.moduleDeclaration;
	    }

	    Assign.prototype.children = ['variable', 'value'];

	    Assign.prototype.isStatement = function(o) {
	      return (o != null ? o.level : void 0) === LEVEL_TOP && (this.context != null) && (this.moduleDeclaration || indexOf.call(this.context, "?") >= 0);
	    };

	    Assign.prototype.checkAssignability = function(o, varBase) {
	      if (Object.prototype.hasOwnProperty.call(o.scope.positions, varBase.value) && o.scope.variables[o.scope.positions[varBase.value]].type === 'import') {
	        return varBase.error("'" + varBase.value + "' is read-only");
	      }
	    };

	    Assign.prototype.assigns = function(name) {
	      return this[this.context === 'object' ? 'value' : 'variable'].assigns(name);
	    };

	    Assign.prototype.unfoldSoak = function(o) {
	      return unfoldSoak(o, this, 'variable');
	    };

	    Assign.prototype.compileNode = function(o) {
	      var answer, compiledName, isValue, j, name, properties, prototype, ref3, ref4, ref5, ref6, ref7, ref8, val, varBase;
	      if (isValue = this.variable instanceof Value) {
	        if (this.variable.isArray() || this.variable.isObject()) {
	          return this.compilePatternMatch(o);
	        }
	        if (this.variable.isSplice()) {
	          return this.compileSplice(o);
	        }
	        if ((ref3 = this.context) === '||=' || ref3 === '&&=' || ref3 === '?=') {
	          return this.compileConditional(o);
	        }
	        if ((ref4 = this.context) === '**=' || ref4 === '//=' || ref4 === '%%=') {
	          return this.compileSpecialMath(o);
	        }
	      }
	      if (this.value instanceof Code) {
	        if (this.value["static"]) {
	          this.value.klass = this.variable.base;
	          this.value.name = this.variable.properties[0];
	          this.value.variable = this.variable;
	        } else if (((ref5 = this.variable.properties) != null ? ref5.length : void 0) >= 2) {
	          ref6 = this.variable.properties, properties = 3 <= ref6.length ? slice.call(ref6, 0, j = ref6.length - 2) : (j = 0, []), prototype = ref6[j++], name = ref6[j++];
	          if (((ref7 = prototype.name) != null ? ref7.value : void 0) === 'prototype') {
	            this.value.klass = new Value(this.variable.base, properties);
	            this.value.name = name;
	            this.value.variable = this.variable;
	          }
	        }
	      }
	      if (!this.context) {
	        varBase = this.variable.unwrapAll();
	        if (!varBase.isAssignable()) {
	          this.variable.error("'" + (this.variable.compile(o)) + "' can't be assigned");
	        }
	        if (!(typeof varBase.hasProperties === "function" ? varBase.hasProperties() : void 0)) {
	          if (this.moduleDeclaration) {
	            this.checkAssignability(o, varBase);
	            o.scope.add(varBase.value, this.moduleDeclaration);
	          } else if (this.param) {
	            o.scope.add(varBase.value, 'var');
	          } else {
	            this.checkAssignability(o, varBase);
	            o.scope.find(varBase.value);
	          }
	        }
	      }
	      val = this.value.compileToFragments(o, LEVEL_LIST);
	      if (isValue && this.variable.base instanceof Obj) {
	        this.variable.front = true;
	      }
	      compiledName = this.variable.compileToFragments(o, LEVEL_LIST);
	      if (this.context === 'object') {
	        if (ref8 = fragmentsToText(compiledName), indexOf.call(JS_FORBIDDEN, ref8) >= 0) {
	          compiledName.unshift(this.makeCode('"'));
	          compiledName.push(this.makeCode('"'));
	        }
	        return compiledName.concat(this.makeCode(": "), val);
	      }
	      answer = compiledName.concat(this.makeCode(" " + (this.context || '=') + " "), val);
	      if (o.level <= LEVEL_LIST) {
	        return answer;
	      } else {
	        return this.wrapInBraces(answer);
	      }
	    };

	    Assign.prototype.compilePatternMatch = function(o) {
	      var acc, assigns, code, defaultValue, expandedIdx, fragments, i, idx, isObject, ivar, j, len1, message, name, obj, objects, olen, ref, ref3, ref4, ref5, ref6, rest, top, val, value, vvar, vvarText;
	      top = o.level === LEVEL_TOP;
	      value = this.value;
	      objects = this.variable.base.objects;
	      if (!(olen = objects.length)) {
	        code = value.compileToFragments(o);
	        if (o.level >= LEVEL_OP) {
	          return this.wrapInBraces(code);
	        } else {
	          return code;
	        }
	      }
	      obj = objects[0];
	      if (olen === 1 && obj instanceof Expansion) {
	        obj.error('Destructuring assignment has no target');
	      }
	      isObject = this.variable.isObject();
	      if (top && olen === 1 && !(obj instanceof Splat)) {
	        defaultValue = null;
	        if (obj instanceof Assign && obj.context === 'object') {
	          ref3 = obj, (ref4 = ref3.variable, idx = ref4.base), obj = ref3.value;
	          if (obj instanceof Assign) {
	            defaultValue = obj.value;
	            obj = obj.variable;
	          }
	        } else {
	          if (obj instanceof Assign) {
	            defaultValue = obj.value;
	            obj = obj.variable;
	          }
	          idx = isObject ? obj["this"] ? obj.properties[0].name : new PropertyName(obj.unwrap().value) : new NumberLiteral(0);
	        }
	        acc = idx.unwrap() instanceof PropertyName;
	        value = new Value(value);
	        value.properties.push(new (acc ? Access : Index)(idx));
	        message = isUnassignable(obj.unwrap().value);
	        if (message) {
	          obj.error(message);
	        }
	        if (defaultValue) {
	          value = new Op('?', value, defaultValue);
	        }
	        return new Assign(obj, value, null, {
	          param: this.param
	        }).compileToFragments(o, LEVEL_TOP);
	      }
	      vvar = value.compileToFragments(o, LEVEL_LIST);
	      vvarText = fragmentsToText(vvar);
	      assigns = [];
	      expandedIdx = false;
	      if (!(value.unwrap() instanceof IdentifierLiteral) || this.variable.assigns(vvarText)) {
	        assigns.push([this.makeCode((ref = o.scope.freeVariable('ref')) + " = ")].concat(slice.call(vvar)));
	        vvar = [this.makeCode(ref)];
	        vvarText = ref;
	      }
	      for (i = j = 0, len1 = objects.length; j < len1; i = ++j) {
	        obj = objects[i];
	        idx = i;
	        if (!expandedIdx && obj instanceof Splat) {
	          name = obj.name.unwrap().value;
	          obj = obj.unwrap();
	          val = olen + " <= " + vvarText + ".length ? " + (utility('slice', o)) + ".call(" + vvarText + ", " + i;
	          if (rest = olen - i - 1) {
	            ivar = o.scope.freeVariable('i', {
	              single: true
	            });
	            val += ", " + ivar + " = " + vvarText + ".length - " + rest + ") : (" + ivar + " = " + i + ", [])";
	          } else {
	            val += ") : []";
	          }
	          val = new Literal(val);
	          expandedIdx = ivar + "++";
	        } else if (!expandedIdx && obj instanceof Expansion) {
	          if (rest = olen - i - 1) {
	            if (rest === 1) {
	              expandedIdx = vvarText + ".length - 1";
	            } else {
	              ivar = o.scope.freeVariable('i', {
	                single: true
	              });
	              val = new Literal(ivar + " = " + vvarText + ".length - " + rest);
	              expandedIdx = ivar + "++";
	              assigns.push(val.compileToFragments(o, LEVEL_LIST));
	            }
	          }
	          continue;
	        } else {
	          if (obj instanceof Splat || obj instanceof Expansion) {
	            obj.error("multiple splats/expansions are disallowed in an assignment");
	          }
	          defaultValue = null;
	          if (obj instanceof Assign && obj.context === 'object') {
	            ref5 = obj, (ref6 = ref5.variable, idx = ref6.base), obj = ref5.value;
	            if (obj instanceof Assign) {
	              defaultValue = obj.value;
	              obj = obj.variable;
	            }
	          } else {
	            if (obj instanceof Assign) {
	              defaultValue = obj.value;
	              obj = obj.variable;
	            }
	            idx = isObject ? obj["this"] ? obj.properties[0].name : new PropertyName(obj.unwrap().value) : new Literal(expandedIdx || idx);
	          }
	          name = obj.unwrap().value;
	          acc = idx.unwrap() instanceof PropertyName;
	          val = new Value(new Literal(vvarText), [new (acc ? Access : Index)(idx)]);
	          if (defaultValue) {
	            val = new Op('?', val, defaultValue);
	          }
	        }
	        if (name != null) {
	          message = isUnassignable(name);
	          if (message) {
	            obj.error(message);
	          }
	        }
	        assigns.push(new Assign(obj, val, null, {
	          param: this.param,
	          subpattern: true
	        }).compileToFragments(o, LEVEL_LIST));
	      }
	      if (!(top || this.subpattern)) {
	        assigns.push(vvar);
	      }
	      fragments = this.joinFragmentArrays(assigns, ', ');
	      if (o.level < LEVEL_LIST) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    Assign.prototype.compileConditional = function(o) {
	      var fragments, left, ref3, right;
	      ref3 = this.variable.cacheReference(o), left = ref3[0], right = ref3[1];
	      if (!left.properties.length && left.base instanceof Literal && !(left.base instanceof ThisLiteral) && !o.scope.check(left.base.value)) {
	        this.variable.error("the variable \"" + left.base.value + "\" can't be assigned with " + this.context + " because it has not been declared before");
	      }
	      if (indexOf.call(this.context, "?") >= 0) {
	        o.isExistentialEquals = true;
	        return new If(new Existence(left), right, {
	          type: 'if'
	        }).addElse(new Assign(right, this.value, '=')).compileToFragments(o);
	      } else {
	        fragments = new Op(this.context.slice(0, -1), left, new Assign(right, this.value, '=')).compileToFragments(o);
	        if (o.level <= LEVEL_LIST) {
	          return fragments;
	        } else {
	          return this.wrapInBraces(fragments);
	        }
	      }
	    };

	    Assign.prototype.compileSpecialMath = function(o) {
	      var left, ref3, right;
	      ref3 = this.variable.cacheReference(o), left = ref3[0], right = ref3[1];
	      return new Assign(left, new Op(this.context.slice(0, -1), right, this.value)).compileToFragments(o);
	    };

	    Assign.prototype.compileSplice = function(o) {
	      var answer, exclusive, from, fromDecl, fromRef, name, ref3, ref4, ref5, to, valDef, valRef;
	      ref3 = this.variable.properties.pop().range, from = ref3.from, to = ref3.to, exclusive = ref3.exclusive;
	      name = this.variable.compile(o);
	      if (from) {
	        ref4 = this.cacheToCodeFragments(from.cache(o, LEVEL_OP)), fromDecl = ref4[0], fromRef = ref4[1];
	      } else {
	        fromDecl = fromRef = '0';
	      }
	      if (to) {
	        if ((from != null ? from.isNumber() : void 0) && to.isNumber()) {
	          to = to.compile(o) - fromRef;
	          if (!exclusive) {
	            to += 1;
	          }
	        } else {
	          to = to.compile(o, LEVEL_ACCESS) + ' - ' + fromRef;
	          if (!exclusive) {
	            to += ' + 1';
	          }
	        }
	      } else {
	        to = "9e9";
	      }
	      ref5 = this.value.cache(o, LEVEL_LIST), valDef = ref5[0], valRef = ref5[1];
	      answer = [].concat(this.makeCode("[].splice.apply(" + name + ", [" + fromDecl + ", " + to + "].concat("), valDef, this.makeCode(")), "), valRef);
	      if (o.level > LEVEL_TOP) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    return Assign;

	  })(Base);

	  exports.Code = Code = (function(superClass1) {
	    extend1(Code, superClass1);

	    function Code(params, body, tag) {
	      this.params = params || [];
	      this.body = body || new Block;
	      this.bound = tag === 'boundfunc';
	      this.isGenerator = !!this.body.contains(function(node) {
	        return (node instanceof Op && node.isYield()) || node instanceof YieldReturn;
	      });
	    }

	    Code.prototype.children = ['params', 'body'];

	    Code.prototype.isStatement = function() {
	      return !!this.ctor;
	    };

	    Code.prototype.jumps = NO;

	    Code.prototype.makeScope = function(parentScope) {
	      return new Scope(parentScope, this.body, this);
	    };

	    Code.prototype.compileNode = function(o) {
	      var answer, boundfunc, code, exprs, i, j, k, l, len1, len2, len3, len4, len5, len6, lit, m, p, param, params, q, r, ref, ref3, ref4, ref5, ref6, ref7, ref8, splats, uniqs, val, wasEmpty, wrapper;
	      if (this.bound && ((ref3 = o.scope.method) != null ? ref3.bound : void 0)) {
	        this.context = o.scope.method.context;
	      }
	      if (this.bound && !this.context) {
	        this.context = '_this';
	        wrapper = new Code([new Param(new IdentifierLiteral(this.context))], new Block([this]));
	        boundfunc = new Call(wrapper, [new ThisLiteral]);
	        boundfunc.updateLocationDataIfMissing(this.locationData);
	        return boundfunc.compileNode(o);
	      }
	      o.scope = del(o, 'classScope') || this.makeScope(o.scope);
	      o.scope.shared = del(o, 'sharedScope');
	      o.indent += TAB;
	      delete o.bare;
	      delete o.isExistentialEquals;
	      params = [];
	      exprs = [];
	      ref4 = this.params;
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        param = ref4[j];
	        if (!(param instanceof Expansion)) {
	          o.scope.parameter(param.asReference(o));
	        }
	      }
	      ref5 = this.params;
	      for (k = 0, len2 = ref5.length; k < len2; k++) {
	        param = ref5[k];
	        if (!(param.splat || param instanceof Expansion)) {
	          continue;
	        }
	        ref6 = this.params;
	        for (l = 0, len3 = ref6.length; l < len3; l++) {
	          p = ref6[l];
	          if (!(p instanceof Expansion) && p.name.value) {
	            o.scope.add(p.name.value, 'var', true);
	          }
	        }
	        splats = new Assign(new Value(new Arr((function() {
	          var len4, m, ref7, results;
	          ref7 = this.params;
	          results = [];
	          for (m = 0, len4 = ref7.length; m < len4; m++) {
	            p = ref7[m];
	            results.push(p.asReference(o));
	          }
	          return results;
	        }).call(this))), new Value(new IdentifierLiteral('arguments')));
	        break;
	      }
	      ref7 = this.params;
	      for (m = 0, len4 = ref7.length; m < len4; m++) {
	        param = ref7[m];
	        if (param.isComplex()) {
	          val = ref = param.asReference(o);
	          if (param.value) {
	            val = new Op('?', ref, param.value);
	          }
	          exprs.push(new Assign(new Value(param.name), val, '=', {
	            param: true
	          }));
	        } else {
	          ref = param;
	          if (param.value) {
	            lit = new Literal(ref.name.value + ' == null');
	            val = new Assign(new Value(param.name), param.value, '=');
	            exprs.push(new If(lit, val));
	          }
	        }
	        if (!splats) {
	          params.push(ref);
	        }
	      }
	      wasEmpty = this.body.isEmpty();
	      if (splats) {
	        exprs.unshift(splats);
	      }
	      if (exprs.length) {
	        (ref8 = this.body.expressions).unshift.apply(ref8, exprs);
	      }
	      for (i = q = 0, len5 = params.length; q < len5; i = ++q) {
	        p = params[i];
	        params[i] = p.compileToFragments(o);
	        o.scope.parameter(fragmentsToText(params[i]));
	      }
	      uniqs = [];
	      this.eachParamName(function(name, node) {
	        if (indexOf.call(uniqs, name) >= 0) {
	          node.error("multiple parameters named " + name);
	        }
	        return uniqs.push(name);
	      });
	      if (!(wasEmpty || this.noReturn)) {
	        this.body.makeReturn();
	      }
	      code = 'function';
	      if (this.isGenerator) {
	        code += '*';
	      }
	      if (this.ctor) {
	        code += ' ' + this.name;
	      }
	      code += '(';
	      answer = [this.makeCode(code)];
	      for (i = r = 0, len6 = params.length; r < len6; i = ++r) {
	        p = params[i];
	        if (i) {
	          answer.push(this.makeCode(", "));
	        }
	        answer.push.apply(answer, p);
	      }
	      answer.push(this.makeCode(') {'));
	      if (!this.body.isEmpty()) {
	        answer = answer.concat(this.makeCode("\n"), this.body.compileWithDeclarations(o), this.makeCode("\n" + this.tab));
	      }
	      answer.push(this.makeCode('}'));
	      if (this.ctor) {
	        return [this.makeCode(this.tab)].concat(slice.call(answer));
	      }
	      if (this.front || (o.level >= LEVEL_ACCESS)) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Code.prototype.eachParamName = function(iterator) {
	      var j, len1, param, ref3, results;
	      ref3 = this.params;
	      results = [];
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        param = ref3[j];
	        results.push(param.eachName(iterator));
	      }
	      return results;
	    };

	    Code.prototype.traverseChildren = function(crossScope, func) {
	      if (crossScope) {
	        return Code.__super__.traverseChildren.call(this, crossScope, func);
	      }
	    };

	    return Code;

	  })(Base);

	  exports.Param = Param = (function(superClass1) {
	    extend1(Param, superClass1);

	    function Param(name1, value1, splat) {
	      var message, token;
	      this.name = name1;
	      this.value = value1;
	      this.splat = splat;
	      message = isUnassignable(this.name.unwrapAll().value);
	      if (message) {
	        this.name.error(message);
	      }
	      if (this.name instanceof Obj && this.name.generated) {
	        token = this.name.objects[0].operatorToken;
	        token.error("unexpected " + token.value);
	      }
	    }

	    Param.prototype.children = ['name', 'value'];

	    Param.prototype.compileToFragments = function(o) {
	      return this.name.compileToFragments(o, LEVEL_LIST);
	    };

	    Param.prototype.asReference = function(o) {
	      var name, node;
	      if (this.reference) {
	        return this.reference;
	      }
	      node = this.name;
	      if (node["this"]) {
	        name = node.properties[0].name.value;
	        if (indexOf.call(JS_FORBIDDEN, name) >= 0) {
	          name = "_" + name;
	        }
	        node = new IdentifierLiteral(o.scope.freeVariable(name));
	      } else if (node.isComplex()) {
	        node = new IdentifierLiteral(o.scope.freeVariable('arg'));
	      }
	      node = new Value(node);
	      if (this.splat) {
	        node = new Splat(node);
	      }
	      node.updateLocationDataIfMissing(this.locationData);
	      return this.reference = node;
	    };

	    Param.prototype.isComplex = function() {
	      return this.name.isComplex();
	    };

	    Param.prototype.eachName = function(iterator, name) {
	      var atParam, j, len1, node, obj, ref3, ref4;
	      if (name == null) {
	        name = this.name;
	      }
	      atParam = function(obj) {
	        return iterator("@" + obj.properties[0].name.value, obj);
	      };
	      if (name instanceof Literal) {
	        return iterator(name.value, name);
	      }
	      if (name instanceof Value) {
	        return atParam(name);
	      }
	      ref4 = (ref3 = name.objects) != null ? ref3 : [];
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        obj = ref4[j];
	        if (obj instanceof Assign && (obj.context == null)) {
	          obj = obj.variable;
	        }
	        if (obj instanceof Assign) {
	          if (obj.value instanceof Assign) {
	            obj = obj.value;
	          }
	          this.eachName(iterator, obj.value.unwrap());
	        } else if (obj instanceof Splat) {
	          node = obj.name.unwrap();
	          iterator(node.value, node);
	        } else if (obj instanceof Value) {
	          if (obj.isArray() || obj.isObject()) {
	            this.eachName(iterator, obj.base);
	          } else if (obj["this"]) {
	            atParam(obj);
	          } else {
	            iterator(obj.base.value, obj.base);
	          }
	        } else if (!(obj instanceof Expansion)) {
	          obj.error("illegal parameter " + (obj.compile()));
	        }
	      }
	    };

	    return Param;

	  })(Base);

	  exports.Splat = Splat = (function(superClass1) {
	    extend1(Splat, superClass1);

	    Splat.prototype.children = ['name'];

	    Splat.prototype.isAssignable = YES;

	    function Splat(name) {
	      this.name = name.compile ? name : new Literal(name);
	    }

	    Splat.prototype.assigns = function(name) {
	      return this.name.assigns(name);
	    };

	    Splat.prototype.compileToFragments = function(o) {
	      return this.name.compileToFragments(o);
	    };

	    Splat.prototype.unwrap = function() {
	      return this.name;
	    };

	    Splat.compileSplattedArray = function(o, list, apply) {
	      var args, base, compiledNode, concatPart, fragments, i, index, j, last, len1, node;
	      index = -1;
	      while ((node = list[++index]) && !(node instanceof Splat)) {
	        continue;
	      }
	      if (index >= list.length) {
	        return [];
	      }
	      if (list.length === 1) {
	        node = list[0];
	        fragments = node.compileToFragments(o, LEVEL_LIST);
	        if (apply) {
	          return fragments;
	        }
	        return [].concat(node.makeCode((utility('slice', o)) + ".call("), fragments, node.makeCode(")"));
	      }
	      args = list.slice(index);
	      for (i = j = 0, len1 = args.length; j < len1; i = ++j) {
	        node = args[i];
	        compiledNode = node.compileToFragments(o, LEVEL_LIST);
	        args[i] = node instanceof Splat ? [].concat(node.makeCode((utility('slice', o)) + ".call("), compiledNode, node.makeCode(")")) : [].concat(node.makeCode("["), compiledNode, node.makeCode("]"));
	      }
	      if (index === 0) {
	        node = list[0];
	        concatPart = node.joinFragmentArrays(args.slice(1), ', ');
	        return args[0].concat(node.makeCode(".concat("), concatPart, node.makeCode(")"));
	      }
	      base = (function() {
	        var k, len2, ref3, results;
	        ref3 = list.slice(0, index);
	        results = [];
	        for (k = 0, len2 = ref3.length; k < len2; k++) {
	          node = ref3[k];
	          results.push(node.compileToFragments(o, LEVEL_LIST));
	        }
	        return results;
	      })();
	      base = list[0].joinFragmentArrays(base, ', ');
	      concatPart = list[index].joinFragmentArrays(args, ', ');
	      last = list[list.length - 1];
	      return [].concat(list[0].makeCode("["), base, list[index].makeCode("].concat("), concatPart, last.makeCode(")"));
	    };

	    return Splat;

	  })(Base);

	  exports.Expansion = Expansion = (function(superClass1) {
	    extend1(Expansion, superClass1);

	    function Expansion() {
	      return Expansion.__super__.constructor.apply(this, arguments);
	    }

	    Expansion.prototype.isComplex = NO;

	    Expansion.prototype.compileNode = function(o) {
	      return this.error('Expansion must be used inside a destructuring assignment or parameter list');
	    };

	    Expansion.prototype.asReference = function(o) {
	      return this;
	    };

	    Expansion.prototype.eachName = function(iterator) {};

	    return Expansion;

	  })(Base);

	  exports.While = While = (function(superClass1) {
	    extend1(While, superClass1);

	    function While(condition, options) {
	      this.condition = (options != null ? options.invert : void 0) ? condition.invert() : condition;
	      this.guard = options != null ? options.guard : void 0;
	    }

	    While.prototype.children = ['condition', 'guard', 'body'];

	    While.prototype.isStatement = YES;

	    While.prototype.makeReturn = function(res) {
	      if (res) {
	        return While.__super__.makeReturn.apply(this, arguments);
	      } else {
	        this.returns = !this.jumps({
	          loop: true
	        });
	        return this;
	      }
	    };

	    While.prototype.addBody = function(body1) {
	      this.body = body1;
	      return this;
	    };

	    While.prototype.jumps = function() {
	      var expressions, j, jumpNode, len1, node;
	      expressions = this.body.expressions;
	      if (!expressions.length) {
	        return false;
	      }
	      for (j = 0, len1 = expressions.length; j < len1; j++) {
	        node = expressions[j];
	        if (jumpNode = node.jumps({
	          loop: true
	        })) {
	          return jumpNode;
	        }
	      }
	      return false;
	    };

	    While.prototype.compileNode = function(o) {
	      var answer, body, rvar, set;
	      o.indent += TAB;
	      set = '';
	      body = this.body;
	      if (body.isEmpty()) {
	        body = this.makeCode('');
	      } else {
	        if (this.returns) {
	          body.makeReturn(rvar = o.scope.freeVariable('results'));
	          set = "" + this.tab + rvar + " = [];\n";
	        }
	        if (this.guard) {
	          if (body.expressions.length > 1) {
	            body.expressions.unshift(new If((new Parens(this.guard)).invert(), new StatementLiteral("continue")));
	          } else {
	            if (this.guard) {
	              body = Block.wrap([new If(this.guard, body)]);
	            }
	          }
	        }
	        body = [].concat(this.makeCode("\n"), body.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab));
	      }
	      answer = [].concat(this.makeCode(set + this.tab + "while ("), this.condition.compileToFragments(o, LEVEL_PAREN), this.makeCode(") {"), body, this.makeCode("}"));
	      if (this.returns) {
	        answer.push(this.makeCode("\n" + this.tab + "return " + rvar + ";"));
	      }
	      return answer;
	    };

	    return While;

	  })(Base);

	  exports.Op = Op = (function(superClass1) {
	    var CONVERSIONS, INVERSIONS;

	    extend1(Op, superClass1);

	    function Op(op, first, second, flip) {
	      if (op === 'in') {
	        return new In(first, second);
	      }
	      if (op === 'do') {
	        return this.generateDo(first);
	      }
	      if (op === 'new') {
	        if (first instanceof Call && !first["do"] && !first.isNew) {
	          return first.newInstance();
	        }
	        if (first instanceof Code && first.bound || first["do"]) {
	          first = new Parens(first);
	        }
	      }
	      this.operator = CONVERSIONS[op] || op;
	      this.first = first;
	      this.second = second;
	      this.flip = !!flip;
	      return this;
	    }

	    CONVERSIONS = {
	      '==': '===',
	      '!=': '!==',
	      'of': 'in',
	      'yieldfrom': 'yield*'
	    };

	    INVERSIONS = {
	      '!==': '===',
	      '===': '!=='
	    };

	    Op.prototype.children = ['first', 'second'];

	    Op.prototype.isNumber = function() {
	      var ref3;
	      return this.isUnary() && ((ref3 = this.operator) === '+' || ref3 === '-') && this.first instanceof Value && this.first.isNumber();
	    };

	    Op.prototype.isYield = function() {
	      var ref3;
	      return (ref3 = this.operator) === 'yield' || ref3 === 'yield*';
	    };

	    Op.prototype.isUnary = function() {
	      return !this.second;
	    };

	    Op.prototype.isComplex = function() {
	      return !this.isNumber();
	    };

	    Op.prototype.isChainable = function() {
	      var ref3;
	      return (ref3 = this.operator) === '<' || ref3 === '>' || ref3 === '>=' || ref3 === '<=' || ref3 === '===' || ref3 === '!==';
	    };

	    Op.prototype.invert = function() {
	      var allInvertable, curr, fst, op, ref3;
	      if (this.isChainable() && this.first.isChainable()) {
	        allInvertable = true;
	        curr = this;
	        while (curr && curr.operator) {
	          allInvertable && (allInvertable = curr.operator in INVERSIONS);
	          curr = curr.first;
	        }
	        if (!allInvertable) {
	          return new Parens(this).invert();
	        }
	        curr = this;
	        while (curr && curr.operator) {
	          curr.invert = !curr.invert;
	          curr.operator = INVERSIONS[curr.operator];
	          curr = curr.first;
	        }
	        return this;
	      } else if (op = INVERSIONS[this.operator]) {
	        this.operator = op;
	        if (this.first.unwrap() instanceof Op) {
	          this.first.invert();
	        }
	        return this;
	      } else if (this.second) {
	        return new Parens(this).invert();
	      } else if (this.operator === '!' && (fst = this.first.unwrap()) instanceof Op && ((ref3 = fst.operator) === '!' || ref3 === 'in' || ref3 === 'instanceof')) {
	        return fst;
	      } else {
	        return new Op('!', this);
	      }
	    };

	    Op.prototype.unfoldSoak = function(o) {
	      var ref3;
	      return ((ref3 = this.operator) === '++' || ref3 === '--' || ref3 === 'delete') && unfoldSoak(o, this, 'first');
	    };

	    Op.prototype.generateDo = function(exp) {
	      var call, func, j, len1, param, passedParams, ref, ref3;
	      passedParams = [];
	      func = exp instanceof Assign && (ref = exp.value.unwrap()) instanceof Code ? ref : exp;
	      ref3 = func.params || [];
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        param = ref3[j];
	        if (param.value) {
	          passedParams.push(param.value);
	          delete param.value;
	        } else {
	          passedParams.push(param);
	        }
	      }
	      call = new Call(exp, passedParams);
	      call["do"] = true;
	      return call;
	    };

	    Op.prototype.compileNode = function(o) {
	      var answer, isChain, lhs, message, ref3, rhs;
	      isChain = this.isChainable() && this.first.isChainable();
	      if (!isChain) {
	        this.first.front = this.front;
	      }
	      if (this.operator === 'delete' && o.scope.check(this.first.unwrapAll().value)) {
	        this.error('delete operand may not be argument or var');
	      }
	      if ((ref3 = this.operator) === '--' || ref3 === '++') {
	        message = isUnassignable(this.first.unwrapAll().value);
	        if (message) {
	          this.first.error(message);
	        }
	      }
	      if (this.isYield()) {
	        return this.compileYield(o);
	      }
	      if (this.isUnary()) {
	        return this.compileUnary(o);
	      }
	      if (isChain) {
	        return this.compileChain(o);
	      }
	      switch (this.operator) {
	        case '?':
	          return this.compileExistence(o);
	        case '**':
	          return this.compilePower(o);
	        case '//':
	          return this.compileFloorDivision(o);
	        case '%%':
	          return this.compileModulo(o);
	        default:
	          lhs = this.first.compileToFragments(o, LEVEL_OP);
	          rhs = this.second.compileToFragments(o, LEVEL_OP);
	          answer = [].concat(lhs, this.makeCode(" " + this.operator + " "), rhs);
	          if (o.level <= LEVEL_OP) {
	            return answer;
	          } else {
	            return this.wrapInBraces(answer);
	          }
	      }
	    };

	    Op.prototype.compileChain = function(o) {
	      var fragments, fst, ref3, shared;
	      ref3 = this.first.second.cache(o), this.first.second = ref3[0], shared = ref3[1];
	      fst = this.first.compileToFragments(o, LEVEL_OP);
	      fragments = fst.concat(this.makeCode(" " + (this.invert ? '&&' : '||') + " "), shared.compileToFragments(o), this.makeCode(" " + this.operator + " "), this.second.compileToFragments(o, LEVEL_OP));
	      return this.wrapInBraces(fragments);
	    };

	    Op.prototype.compileExistence = function(o) {
	      var fst, ref;
	      if (this.first.isComplex()) {
	        ref = new IdentifierLiteral(o.scope.freeVariable('ref'));
	        fst = new Parens(new Assign(ref, this.first));
	      } else {
	        fst = this.first;
	        ref = fst;
	      }
	      return new If(new Existence(fst), ref, {
	        type: 'if'
	      }).addElse(this.second).compileToFragments(o);
	    };

	    Op.prototype.compileUnary = function(o) {
	      var op, parts, plusMinus;
	      parts = [];
	      op = this.operator;
	      parts.push([this.makeCode(op)]);
	      if (op === '!' && this.first instanceof Existence) {
	        this.first.negated = !this.first.negated;
	        return this.first.compileToFragments(o);
	      }
	      if (o.level >= LEVEL_ACCESS) {
	        return (new Parens(this)).compileToFragments(o);
	      }
	      plusMinus = op === '+' || op === '-';
	      if ((op === 'new' || op === 'typeof' || op === 'delete') || plusMinus && this.first instanceof Op && this.first.operator === op) {
	        parts.push([this.makeCode(' ')]);
	      }
	      if ((plusMinus && this.first instanceof Op) || (op === 'new' && this.first.isStatement(o))) {
	        this.first = new Parens(this.first);
	      }
	      parts.push(this.first.compileToFragments(o, LEVEL_OP));
	      if (this.flip) {
	        parts.reverse();
	      }
	      return this.joinFragmentArrays(parts, '');
	    };

	    Op.prototype.compileYield = function(o) {
	      var op, parts, ref3;
	      parts = [];
	      op = this.operator;
	      if (o.scope.parent == null) {
	        this.error('yield can only occur inside functions');
	      }
	      if (indexOf.call(Object.keys(this.first), 'expression') >= 0 && !(this.first instanceof Throw)) {
	        if (this.first.expression != null) {
	          parts.push(this.first.expression.compileToFragments(o, LEVEL_OP));
	        }
	      } else {
	        if (o.level >= LEVEL_PAREN) {
	          parts.push([this.makeCode("(")]);
	        }
	        parts.push([this.makeCode(op)]);
	        if (((ref3 = this.first.base) != null ? ref3.value : void 0) !== '') {
	          parts.push([this.makeCode(" ")]);
	        }
	        parts.push(this.first.compileToFragments(o, LEVEL_OP));
	        if (o.level >= LEVEL_PAREN) {
	          parts.push([this.makeCode(")")]);
	        }
	      }
	      return this.joinFragmentArrays(parts, '');
	    };

	    Op.prototype.compilePower = function(o) {
	      var pow;
	      pow = new Value(new IdentifierLiteral('Math'), [new Access(new PropertyName('pow'))]);
	      return new Call(pow, [this.first, this.second]).compileToFragments(o);
	    };

	    Op.prototype.compileFloorDivision = function(o) {
	      var div, floor, second;
	      floor = new Value(new IdentifierLiteral('Math'), [new Access(new PropertyName('floor'))]);
	      second = this.second.isComplex() ? new Parens(this.second) : this.second;
	      div = new Op('/', this.first, second);
	      return new Call(floor, [div]).compileToFragments(o);
	    };

	    Op.prototype.compileModulo = function(o) {
	      var mod;
	      mod = new Value(new Literal(utility('modulo', o)));
	      return new Call(mod, [this.first, this.second]).compileToFragments(o);
	    };

	    Op.prototype.toString = function(idt) {
	      return Op.__super__.toString.call(this, idt, this.constructor.name + ' ' + this.operator);
	    };

	    return Op;

	  })(Base);

	  exports.In = In = (function(superClass1) {
	    extend1(In, superClass1);

	    function In(object, array) {
	      this.object = object;
	      this.array = array;
	    }

	    In.prototype.children = ['object', 'array'];

	    In.prototype.invert = NEGATE;

	    In.prototype.compileNode = function(o) {
	      var hasSplat, j, len1, obj, ref3;
	      if (this.array instanceof Value && this.array.isArray() && this.array.base.objects.length) {
	        ref3 = this.array.base.objects;
	        for (j = 0, len1 = ref3.length; j < len1; j++) {
	          obj = ref3[j];
	          if (!(obj instanceof Splat)) {
	            continue;
	          }
	          hasSplat = true;
	          break;
	        }
	        if (!hasSplat) {
	          return this.compileOrTest(o);
	        }
	      }
	      return this.compileLoopTest(o);
	    };

	    In.prototype.compileOrTest = function(o) {
	      var cmp, cnj, i, item, j, len1, ref, ref3, ref4, ref5, sub, tests;
	      ref3 = this.object.cache(o, LEVEL_OP), sub = ref3[0], ref = ref3[1];
	      ref4 = this.negated ? [' !== ', ' && '] : [' === ', ' || '], cmp = ref4[0], cnj = ref4[1];
	      tests = [];
	      ref5 = this.array.base.objects;
	      for (i = j = 0, len1 = ref5.length; j < len1; i = ++j) {
	        item = ref5[i];
	        if (i) {
	          tests.push(this.makeCode(cnj));
	        }
	        tests = tests.concat((i ? ref : sub), this.makeCode(cmp), item.compileToFragments(o, LEVEL_ACCESS));
	      }
	      if (o.level < LEVEL_OP) {
	        return tests;
	      } else {
	        return this.wrapInBraces(tests);
	      }
	    };

	    In.prototype.compileLoopTest = function(o) {
	      var fragments, ref, ref3, sub;
	      ref3 = this.object.cache(o, LEVEL_LIST), sub = ref3[0], ref = ref3[1];
	      fragments = [].concat(this.makeCode(utility('indexOf', o) + ".call("), this.array.compileToFragments(o, LEVEL_LIST), this.makeCode(", "), ref, this.makeCode(") " + (this.negated ? '< 0' : '>= 0')));
	      if (fragmentsToText(sub) === fragmentsToText(ref)) {
	        return fragments;
	      }
	      fragments = sub.concat(this.makeCode(', '), fragments);
	      if (o.level < LEVEL_LIST) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    In.prototype.toString = function(idt) {
	      return In.__super__.toString.call(this, idt, this.constructor.name + (this.negated ? '!' : ''));
	    };

	    return In;

	  })(Base);

	  exports.Try = Try = (function(superClass1) {
	    extend1(Try, superClass1);

	    function Try(attempt, errorVariable, recovery, ensure) {
	      this.attempt = attempt;
	      this.errorVariable = errorVariable;
	      this.recovery = recovery;
	      this.ensure = ensure;
	    }

	    Try.prototype.children = ['attempt', 'recovery', 'ensure'];

	    Try.prototype.isStatement = YES;

	    Try.prototype.jumps = function(o) {
	      var ref3;
	      return this.attempt.jumps(o) || ((ref3 = this.recovery) != null ? ref3.jumps(o) : void 0);
	    };

	    Try.prototype.makeReturn = function(res) {
	      if (this.attempt) {
	        this.attempt = this.attempt.makeReturn(res);
	      }
	      if (this.recovery) {
	        this.recovery = this.recovery.makeReturn(res);
	      }
	      return this;
	    };

	    Try.prototype.compileNode = function(o) {
	      var catchPart, ensurePart, generatedErrorVariableName, message, placeholder, tryPart;
	      o.indent += TAB;
	      tryPart = this.attempt.compileToFragments(o, LEVEL_TOP);
	      catchPart = this.recovery ? (generatedErrorVariableName = o.scope.freeVariable('error', {
	        reserve: false
	      }), placeholder = new IdentifierLiteral(generatedErrorVariableName), this.errorVariable ? (message = isUnassignable(this.errorVariable.unwrapAll().value), message ? this.errorVariable.error(message) : void 0, this.recovery.unshift(new Assign(this.errorVariable, placeholder))) : void 0, [].concat(this.makeCode(" catch ("), placeholder.compileToFragments(o), this.makeCode(") {\n"), this.recovery.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab + "}"))) : !(this.ensure || this.recovery) ? (generatedErrorVariableName = o.scope.freeVariable('error', {
	        reserve: false
	      }), [this.makeCode(" catch (" + generatedErrorVariableName + ") {}")]) : [];
	      ensurePart = this.ensure ? [].concat(this.makeCode(" finally {\n"), this.ensure.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab + "}")) : [];
	      return [].concat(this.makeCode(this.tab + "try {\n"), tryPart, this.makeCode("\n" + this.tab + "}"), catchPart, ensurePart);
	    };

	    return Try;

	  })(Base);

	  exports.Throw = Throw = (function(superClass1) {
	    extend1(Throw, superClass1);

	    function Throw(expression) {
	      this.expression = expression;
	    }

	    Throw.prototype.children = ['expression'];

	    Throw.prototype.isStatement = YES;

	    Throw.prototype.jumps = NO;

	    Throw.prototype.makeReturn = THIS;

	    Throw.prototype.compileNode = function(o) {
	      return [].concat(this.makeCode(this.tab + "throw "), this.expression.compileToFragments(o), this.makeCode(";"));
	    };

	    return Throw;

	  })(Base);

	  exports.Existence = Existence = (function(superClass1) {
	    extend1(Existence, superClass1);

	    function Existence(expression) {
	      this.expression = expression;
	    }

	    Existence.prototype.children = ['expression'];

	    Existence.prototype.invert = NEGATE;

	    Existence.prototype.compileNode = function(o) {
	      var cmp, cnj, code, ref3;
	      this.expression.front = this.front;
	      code = this.expression.compile(o, LEVEL_OP);
	      if (this.expression.unwrap() instanceof IdentifierLiteral && !o.scope.check(code)) {
	        ref3 = this.negated ? ['===', '||'] : ['!==', '&&'], cmp = ref3[0], cnj = ref3[1];
	        code = "typeof " + code + " " + cmp + " \"undefined\" " + cnj + " " + code + " " + cmp + " null";
	      } else {
	        code = code + " " + (this.negated ? '==' : '!=') + " null";
	      }
	      return [this.makeCode(o.level <= LEVEL_COND ? code : "(" + code + ")")];
	    };

	    return Existence;

	  })(Base);

	  exports.Parens = Parens = (function(superClass1) {
	    extend1(Parens, superClass1);

	    function Parens(body1) {
	      this.body = body1;
	    }

	    Parens.prototype.children = ['body'];

	    Parens.prototype.unwrap = function() {
	      return this.body;
	    };

	    Parens.prototype.isComplex = function() {
	      return this.body.isComplex();
	    };

	    Parens.prototype.compileNode = function(o) {
	      var bare, expr, fragments;
	      expr = this.body.unwrap();
	      if (expr instanceof Value && expr.isAtomic()) {
	        expr.front = this.front;
	        return expr.compileToFragments(o);
	      }
	      fragments = expr.compileToFragments(o, LEVEL_PAREN);
	      bare = o.level < LEVEL_OP && (expr instanceof Op || expr instanceof Call || (expr instanceof For && expr.returns)) && (o.level < LEVEL_COND || fragments.length <= 3);
	      if (bare) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    return Parens;

	  })(Base);

	  exports.StringWithInterpolations = StringWithInterpolations = (function(superClass1) {
	    extend1(StringWithInterpolations, superClass1);

	    function StringWithInterpolations() {
	      return StringWithInterpolations.__super__.constructor.apply(this, arguments);
	    }

	    StringWithInterpolations.prototype.compileNode = function(o) {
	      var element, elements, expr, fragments, j, len1, value;
	      if (!o.inTaggedTemplateCall) {
	        return StringWithInterpolations.__super__.compileNode.apply(this, arguments);
	      }
	      expr = this.body.unwrap();
	      elements = [];
	      expr.traverseChildren(false, function(node) {
	        if (node instanceof StringLiteral) {
	          elements.push(node);
	          return true;
	        } else if (node instanceof Parens) {
	          elements.push(node);
	          return false;
	        }
	        return true;
	      });
	      fragments = [];
	      fragments.push(this.makeCode('`'));
	      for (j = 0, len1 = elements.length; j < len1; j++) {
	        element = elements[j];
	        if (element instanceof StringLiteral) {
	          value = element.value.slice(1, -1);
	          value = value.replace(/(\\*)(`|\$\{)/g, function(match, backslashes, toBeEscaped) {
	            if (backslashes.length % 2 === 0) {
	              return backslashes + "\\" + toBeEscaped;
	            } else {
	              return match;
	            }
	          });
	          fragments.push(this.makeCode(value));
	        } else {
	          fragments.push(this.makeCode('${'));
	          fragments.push.apply(fragments, element.compileToFragments(o, LEVEL_PAREN));
	          fragments.push(this.makeCode('}'));
	        }
	      }
	      fragments.push(this.makeCode('`'));
	      return fragments;
	    };

	    return StringWithInterpolations;

	  })(Parens);

	  exports.For = For = (function(superClass1) {
	    extend1(For, superClass1);

	    function For(body, source) {
	      var ref3;
	      this.source = source.source, this.guard = source.guard, this.step = source.step, this.name = source.name, this.index = source.index;
	      this.body = Block.wrap([body]);
	      this.own = !!source.own;
	      this.object = !!source.object;
	      this.from = !!source.from;
	      if (this.from && this.index) {
	        this.index.error('cannot use index with for-from');
	      }
	      if (this.own && !this.object) {
	        source.ownTag.error("cannot use own with for-" + (this.from ? 'from' : 'in'));
	      }
	      if (this.object) {
	        ref3 = [this.index, this.name], this.name = ref3[0], this.index = ref3[1];
	      }
	      if (this.index instanceof Value && !this.index.isAssignable()) {
	        this.index.error('index cannot be a pattern matching expression');
	      }
	      this.range = this.source instanceof Value && this.source.base instanceof Range && !this.source.properties.length && !this.from;
	      this.pattern = this.name instanceof Value;
	      if (this.range && this.index) {
	        this.index.error('indexes do not apply to range loops');
	      }
	      if (this.range && this.pattern) {
	        this.name.error('cannot pattern match over range loops');
	      }
	      this.returns = false;
	    }

	    For.prototype.children = ['body', 'source', 'guard', 'step'];

	    For.prototype.compileNode = function(o) {
	      var body, bodyFragments, compare, compareDown, declare, declareDown, defPart, defPartFragments, down, forPartFragments, guardPart, idt1, increment, index, ivar, kvar, kvarAssign, last, lvar, name, namePart, ref, ref3, ref4, resultPart, returnResult, rvar, scope, source, step, stepNum, stepVar, svar, varPart;
	      body = Block.wrap([this.body]);
	      ref3 = body.expressions, last = ref3[ref3.length - 1];
	      if ((last != null ? last.jumps() : void 0) instanceof Return) {
	        this.returns = false;
	      }
	      source = this.range ? this.source.base : this.source;
	      scope = o.scope;
	      if (!this.pattern) {
	        name = this.name && (this.name.compile(o, LEVEL_LIST));
	      }
	      index = this.index && (this.index.compile(o, LEVEL_LIST));
	      if (name && !this.pattern) {
	        scope.find(name);
	      }
	      if (index && !(this.index instanceof Value)) {
	        scope.find(index);
	      }
	      if (this.returns) {
	        rvar = scope.freeVariable('results');
	      }
	      if (this.from) {
	        if (this.pattern) {
	          ivar = scope.freeVariable('x', {
	            single: true
	          });
	        }
	      } else {
	        ivar = (this.object && index) || scope.freeVariable('i', {
	          single: true
	        });
	      }
	      kvar = ((this.range || this.from) && name) || index || ivar;
	      kvarAssign = kvar !== ivar ? kvar + " = " : "";
	      if (this.step && !this.range) {
	        ref4 = this.cacheToCodeFragments(this.step.cache(o, LEVEL_LIST, isComplexOrAssignable)), step = ref4[0], stepVar = ref4[1];
	        if (this.step.isNumber()) {
	          stepNum = Number(stepVar);
	        }
	      }
	      if (this.pattern) {
	        name = ivar;
	      }
	      varPart = '';
	      guardPart = '';
	      defPart = '';
	      idt1 = this.tab + TAB;
	      if (this.range) {
	        forPartFragments = source.compileToFragments(merge(o, {
	          index: ivar,
	          name: name,
	          step: this.step,
	          isComplex: isComplexOrAssignable
	        }));
	      } else {
	        svar = this.source.compile(o, LEVEL_LIST);
	        if ((name || this.own) && !(this.source.unwrap() instanceof IdentifierLiteral)) {
	          defPart += "" + this.tab + (ref = scope.freeVariable('ref')) + " = " + svar + ";\n";
	          svar = ref;
	        }
	        if (name && !this.pattern && !this.from) {
	          namePart = name + " = " + svar + "[" + kvar + "]";
	        }
	        if (!this.object && !this.from) {
	          if (step !== stepVar) {
	            defPart += "" + this.tab + step + ";\n";
	          }
	          down = stepNum < 0;
	          if (!(this.step && (stepNum != null) && down)) {
	            lvar = scope.freeVariable('len');
	          }
	          declare = "" + kvarAssign + ivar + " = 0, " + lvar + " = " + svar + ".length";
	          declareDown = "" + kvarAssign + ivar + " = " + svar + ".length - 1";
	          compare = ivar + " < " + lvar;
	          compareDown = ivar + " >= 0";
	          if (this.step) {
	            if (stepNum != null) {
	              if (down) {
	                compare = compareDown;
	                declare = declareDown;
	              }
	            } else {
	              compare = stepVar + " > 0 ? " + compare + " : " + compareDown;
	              declare = "(" + stepVar + " > 0 ? (" + declare + ") : " + declareDown + ")";
	            }
	            increment = ivar + " += " + stepVar;
	          } else {
	            increment = "" + (kvar !== ivar ? "++" + ivar : ivar + "++");
	          }
	          forPartFragments = [this.makeCode(declare + "; " + compare + "; " + kvarAssign + increment)];
	        }
	      }
	      if (this.returns) {
	        resultPart = "" + this.tab + rvar + " = [];\n";
	        returnResult = "\n" + this.tab + "return " + rvar + ";";
	        body.makeReturn(rvar);
	      }
	      if (this.guard) {
	        if (body.expressions.length > 1) {
	          body.expressions.unshift(new If((new Parens(this.guard)).invert(), new StatementLiteral("continue")));
	        } else {
	          if (this.guard) {
	            body = Block.wrap([new If(this.guard, body)]);
	          }
	        }
	      }
	      if (this.pattern) {
	        body.expressions.unshift(new Assign(this.name, this.from ? new IdentifierLiteral(kvar) : new Literal(svar + "[" + kvar + "]")));
	      }
	      defPartFragments = [].concat(this.makeCode(defPart), this.pluckDirectCall(o, body));
	      if (namePart) {
	        varPart = "\n" + idt1 + namePart + ";";
	      }
	      if (this.object) {
	        forPartFragments = [this.makeCode(kvar + " in " + svar)];
	        if (this.own) {
	          guardPart = "\n" + idt1 + "if (!" + (utility('hasProp', o)) + ".call(" + svar + ", " + kvar + ")) continue;";
	        }
	      } else if (this.from) {
	        forPartFragments = [this.makeCode(kvar + " of " + svar)];
	      }
	      bodyFragments = body.compileToFragments(merge(o, {
	        indent: idt1
	      }), LEVEL_TOP);
	      if (bodyFragments && bodyFragments.length > 0) {
	        bodyFragments = [].concat(this.makeCode("\n"), bodyFragments, this.makeCode("\n"));
	      }
	      return [].concat(defPartFragments, this.makeCode("" + (resultPart || '') + this.tab + "for ("), forPartFragments, this.makeCode(") {" + guardPart + varPart), bodyFragments, this.makeCode(this.tab + "}" + (returnResult || '')));
	    };

	    For.prototype.pluckDirectCall = function(o, body) {
	      var base, defs, expr, fn, idx, j, len1, ref, ref3, ref4, ref5, ref6, ref7, ref8, ref9, val;
	      defs = [];
	      ref3 = body.expressions;
	      for (idx = j = 0, len1 = ref3.length; j < len1; idx = ++j) {
	        expr = ref3[idx];
	        expr = expr.unwrapAll();
	        if (!(expr instanceof Call)) {
	          continue;
	        }
	        val = (ref4 = expr.variable) != null ? ref4.unwrapAll() : void 0;
	        if (!((val instanceof Code) || (val instanceof Value && ((ref5 = val.base) != null ? ref5.unwrapAll() : void 0) instanceof Code && val.properties.length === 1 && ((ref6 = (ref7 = val.properties[0].name) != null ? ref7.value : void 0) === 'call' || ref6 === 'apply')))) {
	          continue;
	        }
	        fn = ((ref8 = val.base) != null ? ref8.unwrapAll() : void 0) || val;
	        ref = new IdentifierLiteral(o.scope.freeVariable('fn'));
	        base = new Value(ref);
	        if (val.base) {
	          ref9 = [base, val], val.base = ref9[0], base = ref9[1];
	        }
	        body.expressions[idx] = new Call(base, expr.args);
	        defs = defs.concat(this.makeCode(this.tab), new Assign(ref, fn).compileToFragments(o, LEVEL_TOP), this.makeCode(';\n'));
	      }
	      return defs;
	    };

	    return For;

	  })(While);

	  exports.Switch = Switch = (function(superClass1) {
	    extend1(Switch, superClass1);

	    function Switch(subject, cases, otherwise) {
	      this.subject = subject;
	      this.cases = cases;
	      this.otherwise = otherwise;
	    }

	    Switch.prototype.children = ['subject', 'cases', 'otherwise'];

	    Switch.prototype.isStatement = YES;

	    Switch.prototype.jumps = function(o) {
	      var block, conds, j, jumpNode, len1, ref3, ref4, ref5;
	      if (o == null) {
	        o = {
	          block: true
	        };
	      }
	      ref3 = this.cases;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        ref4 = ref3[j], conds = ref4[0], block = ref4[1];
	        if (jumpNode = block.jumps(o)) {
	          return jumpNode;
	        }
	      }
	      return (ref5 = this.otherwise) != null ? ref5.jumps(o) : void 0;
	    };

	    Switch.prototype.makeReturn = function(res) {
	      var j, len1, pair, ref3, ref4;
	      ref3 = this.cases;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        pair = ref3[j];
	        pair[1].makeReturn(res);
	      }
	      if (res) {
	        this.otherwise || (this.otherwise = new Block([new Literal('void 0')]));
	      }
	      if ((ref4 = this.otherwise) != null) {
	        ref4.makeReturn(res);
	      }
	      return this;
	    };

	    Switch.prototype.compileNode = function(o) {
	      var block, body, cond, conditions, expr, fragments, i, idt1, idt2, j, k, len1, len2, ref3, ref4, ref5;
	      idt1 = o.indent + TAB;
	      idt2 = o.indent = idt1 + TAB;
	      fragments = [].concat(this.makeCode(this.tab + "switch ("), (this.subject ? this.subject.compileToFragments(o, LEVEL_PAREN) : this.makeCode("false")), this.makeCode(") {\n"));
	      ref3 = this.cases;
	      for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	        ref4 = ref3[i], conditions = ref4[0], block = ref4[1];
	        ref5 = flatten([conditions]);
	        for (k = 0, len2 = ref5.length; k < len2; k++) {
	          cond = ref5[k];
	          if (!this.subject) {
	            cond = cond.invert();
	          }
	          fragments = fragments.concat(this.makeCode(idt1 + "case "), cond.compileToFragments(o, LEVEL_PAREN), this.makeCode(":\n"));
	        }
	        if ((body = block.compileToFragments(o, LEVEL_TOP)).length > 0) {
	          fragments = fragments.concat(body, this.makeCode('\n'));
	        }
	        if (i === this.cases.length - 1 && !this.otherwise) {
	          break;
	        }
	        expr = this.lastNonComment(block.expressions);
	        if (expr instanceof Return || (expr instanceof Literal && expr.jumps() && expr.value !== 'debugger')) {
	          continue;
	        }
	        fragments.push(cond.makeCode(idt2 + 'break;\n'));
	      }
	      if (this.otherwise && this.otherwise.expressions.length) {
	        fragments.push.apply(fragments, [this.makeCode(idt1 + "default:\n")].concat(slice.call(this.otherwise.compileToFragments(o, LEVEL_TOP)), [this.makeCode("\n")]));
	      }
	      fragments.push(this.makeCode(this.tab + '}'));
	      return fragments;
	    };

	    return Switch;

	  })(Base);

	  exports.If = If = (function(superClass1) {
	    extend1(If, superClass1);

	    function If(condition, body1, options) {
	      this.body = body1;
	      if (options == null) {
	        options = {};
	      }
	      this.condition = options.type === 'unless' ? condition.invert() : condition;
	      this.elseBody = null;
	      this.isChain = false;
	      this.soak = options.soak;
	    }

	    If.prototype.children = ['condition', 'body', 'elseBody'];

	    If.prototype.bodyNode = function() {
	      var ref3;
	      return (ref3 = this.body) != null ? ref3.unwrap() : void 0;
	    };

	    If.prototype.elseBodyNode = function() {
	      var ref3;
	      return (ref3 = this.elseBody) != null ? ref3.unwrap() : void 0;
	    };

	    If.prototype.addElse = function(elseBody) {
	      if (this.isChain) {
	        this.elseBodyNode().addElse(elseBody);
	      } else {
	        this.isChain = elseBody instanceof If;
	        this.elseBody = this.ensureBlock(elseBody);
	        this.elseBody.updateLocationDataIfMissing(elseBody.locationData);
	      }
	      return this;
	    };

	    If.prototype.isStatement = function(o) {
	      var ref3;
	      return (o != null ? o.level : void 0) === LEVEL_TOP || this.bodyNode().isStatement(o) || ((ref3 = this.elseBodyNode()) != null ? ref3.isStatement(o) : void 0);
	    };

	    If.prototype.jumps = function(o) {
	      var ref3;
	      return this.body.jumps(o) || ((ref3 = this.elseBody) != null ? ref3.jumps(o) : void 0);
	    };

	    If.prototype.compileNode = function(o) {
	      if (this.isStatement(o)) {
	        return this.compileStatement(o);
	      } else {
	        return this.compileExpression(o);
	      }
	    };

	    If.prototype.makeReturn = function(res) {
	      if (res) {
	        this.elseBody || (this.elseBody = new Block([new Literal('void 0')]));
	      }
	      this.body && (this.body = new Block([this.body.makeReturn(res)]));
	      this.elseBody && (this.elseBody = new Block([this.elseBody.makeReturn(res)]));
	      return this;
	    };

	    If.prototype.ensureBlock = function(node) {
	      if (node instanceof Block) {
	        return node;
	      } else {
	        return new Block([node]);
	      }
	    };

	    If.prototype.compileStatement = function(o) {
	      var answer, body, child, cond, exeq, ifPart, indent;
	      child = del(o, 'chainChild');
	      exeq = del(o, 'isExistentialEquals');
	      if (exeq) {
	        return new If(this.condition.invert(), this.elseBodyNode(), {
	          type: 'if'
	        }).compileToFragments(o);
	      }
	      indent = o.indent + TAB;
	      cond = this.condition.compileToFragments(o, LEVEL_PAREN);
	      body = this.ensureBlock(this.body).compileToFragments(merge(o, {
	        indent: indent
	      }));
	      ifPart = [].concat(this.makeCode("if ("), cond, this.makeCode(") {\n"), body, this.makeCode("\n" + this.tab + "}"));
	      if (!child) {
	        ifPart.unshift(this.makeCode(this.tab));
	      }
	      if (!this.elseBody) {
	        return ifPart;
	      }
	      answer = ifPart.concat(this.makeCode(' else '));
	      if (this.isChain) {
	        o.chainChild = true;
	        answer = answer.concat(this.elseBody.unwrap().compileToFragments(o, LEVEL_TOP));
	      } else {
	        answer = answer.concat(this.makeCode("{\n"), this.elseBody.compileToFragments(merge(o, {
	          indent: indent
	        }), LEVEL_TOP), this.makeCode("\n" + this.tab + "}"));
	      }
	      return answer;
	    };

	    If.prototype.compileExpression = function(o) {
	      var alt, body, cond, fragments;
	      cond = this.condition.compileToFragments(o, LEVEL_COND);
	      body = this.bodyNode().compileToFragments(o, LEVEL_LIST);
	      alt = this.elseBodyNode() ? this.elseBodyNode().compileToFragments(o, LEVEL_LIST) : [this.makeCode('void 0')];
	      fragments = cond.concat(this.makeCode(" ? "), body, this.makeCode(" : "), alt);
	      if (o.level >= LEVEL_COND) {
	        return this.wrapInBraces(fragments);
	      } else {
	        return fragments;
	      }
	    };

	    If.prototype.unfoldSoak = function() {
	      return this.soak && this;
	    };

	    return If;

	  })(Base);

	  UTILITIES = {
	    extend: function(o) {
	      return "function(child, parent) { for (var key in parent) { if (" + (utility('hasProp', o)) + ".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }";
	    },
	    bind: function() {
	      return 'function(fn, me){ return function(){ return fn.apply(me, arguments); }; }';
	    },
	    indexOf: function() {
	      return "[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }";
	    },
	    modulo: function() {
	      return "function(a, b) { return (+a % (b = +b) + b) % b; }";
	    },
	    hasProp: function() {
	      return '{}.hasOwnProperty';
	    },
	    slice: function() {
	      return '[].slice';
	    }
	  };

	  LEVEL_TOP = 1;

	  LEVEL_PAREN = 2;

	  LEVEL_LIST = 3;

	  LEVEL_COND = 4;

	  LEVEL_OP = 5;

	  LEVEL_ACCESS = 6;

	  TAB = '  ';

	  SIMPLENUM = /^[+-]?\d+$/;

	  utility = function(name, o) {
	    var ref, root;
	    root = o.scope.root;
	    if (name in root.utilities) {
	      return root.utilities[name];
	    } else {
	      ref = root.freeVariable(name);
	      root.assign(ref, UTILITIES[name](o));
	      return root.utilities[name] = ref;
	    }
	  };

	  multident = function(code, tab) {
	    code = code.replace(/\n/g, '$&' + tab);
	    return code.replace(/\s+$/, '');
	  };

	  isLiteralArguments = function(node) {
	    return node instanceof IdentifierLiteral && node.value === 'arguments';
	  };

	  isLiteralThis = function(node) {
	    return node instanceof ThisLiteral || (node instanceof Code && node.bound) || node instanceof SuperCall;
	  };

	  isComplexOrAssignable = function(node) {
	    return node.isComplex() || (typeof node.isAssignable === "function" ? node.isAssignable() : void 0);
	  };

	  unfoldSoak = function(o, parent, name) {
	    var ifn;
	    if (!(ifn = parent[name].unfoldSoak(o))) {
	      return;
	    }
	    parent[name] = ifn.body;
	    ifn.body = new Value(parent);
	    return ifn;
	  };

	}).call(this);


/***/ }),
/* 184 */
/***/ (function(module, exports) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var Scope,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  exports.Scope = Scope = (function() {
	    function Scope(parent, expressions, method, referencedVars) {
	      var ref, ref1;
	      this.parent = parent;
	      this.expressions = expressions;
	      this.method = method;
	      this.referencedVars = referencedVars;
	      this.variables = [
	        {
	          name: 'arguments',
	          type: 'arguments'
	        }
	      ];
	      this.positions = {};
	      if (!this.parent) {
	        this.utilities = {};
	      }
	      this.root = (ref = (ref1 = this.parent) != null ? ref1.root : void 0) != null ? ref : this;
	    }

	    Scope.prototype.add = function(name, type, immediate) {
	      if (this.shared && !immediate) {
	        return this.parent.add(name, type, immediate);
	      }
	      if (Object.prototype.hasOwnProperty.call(this.positions, name)) {
	        return this.variables[this.positions[name]].type = type;
	      } else {
	        return this.positions[name] = this.variables.push({
	          name: name,
	          type: type
	        }) - 1;
	      }
	    };

	    Scope.prototype.namedMethod = function() {
	      var ref;
	      if (((ref = this.method) != null ? ref.name : void 0) || !this.parent) {
	        return this.method;
	      }
	      return this.parent.namedMethod();
	    };

	    Scope.prototype.find = function(name, type) {
	      if (type == null) {
	        type = 'var';
	      }
	      if (this.check(name)) {
	        return true;
	      }
	      this.add(name, type);
	      return false;
	    };

	    Scope.prototype.parameter = function(name) {
	      if (this.shared && this.parent.check(name, true)) {
	        return;
	      }
	      return this.add(name, 'param');
	    };

	    Scope.prototype.check = function(name) {
	      var ref;
	      return !!(this.type(name) || ((ref = this.parent) != null ? ref.check(name) : void 0));
	    };

	    Scope.prototype.temporary = function(name, index, single) {
	      var diff, endCode, letter, newCode, num, startCode;
	      if (single == null) {
	        single = false;
	      }
	      if (single) {
	        startCode = name.charCodeAt(0);
	        endCode = 'z'.charCodeAt(0);
	        diff = endCode - startCode;
	        newCode = startCode + index % (diff + 1);
	        letter = String.fromCharCode(newCode);
	        num = Math.floor(index / (diff + 1));
	        return "" + letter + (num || '');
	      } else {
	        return "" + name + (index || '');
	      }
	    };

	    Scope.prototype.type = function(name) {
	      var i, len, ref, v;
	      ref = this.variables;
	      for (i = 0, len = ref.length; i < len; i++) {
	        v = ref[i];
	        if (v.name === name) {
	          return v.type;
	        }
	      }
	      return null;
	    };

	    Scope.prototype.freeVariable = function(name, options) {
	      var index, ref, temp;
	      if (options == null) {
	        options = {};
	      }
	      index = 0;
	      while (true) {
	        temp = this.temporary(name, index, options.single);
	        if (!(this.check(temp) || indexOf.call(this.root.referencedVars, temp) >= 0)) {
	          break;
	        }
	        index++;
	      }
	      if ((ref = options.reserve) != null ? ref : true) {
	        this.add(temp, 'var', true);
	      }
	      return temp;
	    };

	    Scope.prototype.assign = function(name, value) {
	      this.add(name, {
	        value: value,
	        assigned: true
	      }, true);
	      return this.hasAssignments = true;
	    };

	    Scope.prototype.hasDeclarations = function() {
	      return !!this.declaredVariables().length;
	    };

	    Scope.prototype.declaredVariables = function() {
	      var v;
	      return ((function() {
	        var i, len, ref, results;
	        ref = this.variables;
	        results = [];
	        for (i = 0, len = ref.length; i < len; i++) {
	          v = ref[i];
	          if (v.type === 'var') {
	            results.push(v.name);
	          }
	        }
	        return results;
	      }).call(this)).sort();
	    };

	    Scope.prototype.assignedVariables = function() {
	      var i, len, ref, results, v;
	      ref = this.variables;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        v = ref[i];
	        if (v.type.assigned) {
	          results.push(v.name + " = " + v.type.value);
	        }
	      }
	      return results;
	    };

	    return Scope;

	  })();

	}).call(this);


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var Parser, alt, alternatives, grammar, name, o, operators, token, tokens, unwrap;

	  Parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"jison\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).Parser;

	  unwrap = /^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/;

	  o = function(patternString, action, options) {
	    var addLocationDataFn, match, patternCount;
	    patternString = patternString.replace(/\s{2,}/g, ' ');
	    patternCount = patternString.split(' ').length;
	    if (!action) {
	      return [patternString, '$$ = $1;', options];
	    }
	    action = (match = unwrap.exec(action)) ? match[1] : "(" + action + "())";
	    action = action.replace(/\bnew /g, '$&yy.');
	    action = action.replace(/\b(?:Block\.wrap|extend)\b/g, 'yy.$&');
	    addLocationDataFn = function(first, last) {
	      if (!last) {
	        return "yy.addLocationDataFn(@" + first + ")";
	      } else {
	        return "yy.addLocationDataFn(@" + first + ", @" + last + ")";
	      }
	    };
	    action = action.replace(/LOC\(([0-9]*)\)/g, addLocationDataFn('$1'));
	    action = action.replace(/LOC\(([0-9]*),\s*([0-9]*)\)/g, addLocationDataFn('$1', '$2'));
	    return [patternString, "$$ = " + (addLocationDataFn(1, patternCount)) + "(" + action + ");", options];
	  };

	  grammar = {
	    Root: [
	      o('', function() {
	        return new Block;
	      }), o('Body')
	    ],
	    Body: [
	      o('Line', function() {
	        return Block.wrap([$1]);
	      }), o('Body TERMINATOR Line', function() {
	        return $1.push($3);
	      }), o('Body TERMINATOR')
	    ],
	    Line: [o('Expression'), o('Statement'), o('YieldReturn')],
	    Statement: [
	      o('Return'), o('Comment'), o('STATEMENT', function() {
	        return new StatementLiteral($1);
	      }), o('Import'), o('Export')
	    ],
	    Expression: [o('Value'), o('Invocation'), o('Code'), o('Operation'), o('Assign'), o('If'), o('Try'), o('While'), o('For'), o('Switch'), o('Class'), o('Throw'), o('Yield')],
	    Yield: [
	      o('YIELD', function() {
	        return new Op($1, new Value(new Literal('')));
	      }), o('YIELD Expression', function() {
	        return new Op($1, $2);
	      }), o('YIELD FROM Expression', function() {
	        return new Op($1.concat($2), $3);
	      })
	    ],
	    Block: [
	      o('INDENT OUTDENT', function() {
	        return new Block;
	      }), o('INDENT Body OUTDENT', function() {
	        return $2;
	      })
	    ],
	    Identifier: [
	      o('IDENTIFIER', function() {
	        return new IdentifierLiteral($1);
	      })
	    ],
	    Property: [
	      o('PROPERTY', function() {
	        return new PropertyName($1);
	      })
	    ],
	    AlphaNumeric: [
	      o('NUMBER', function() {
	        return new NumberLiteral($1);
	      }), o('String')
	    ],
	    String: [
	      o('STRING', function() {
	        return new StringLiteral($1);
	      }), o('STRING_START Body STRING_END', function() {
	        return new StringWithInterpolations($2);
	      })
	    ],
	    Regex: [
	      o('REGEX', function() {
	        return new RegexLiteral($1);
	      }), o('REGEX_START Invocation REGEX_END', function() {
	        return new RegexWithInterpolations($2.args);
	      })
	    ],
	    Literal: [
	      o('AlphaNumeric'), o('JS', function() {
	        return new PassthroughLiteral($1);
	      }), o('Regex'), o('UNDEFINED', function() {
	        return new UndefinedLiteral;
	      }), o('NULL', function() {
	        return new NullLiteral;
	      }), o('BOOL', function() {
	        return new BooleanLiteral($1);
	      }), o('INFINITY', function() {
	        return new InfinityLiteral($1);
	      }), o('NAN', function() {
	        return new NaNLiteral;
	      })
	    ],
	    Assign: [
	      o('Assignable = Expression', function() {
	        return new Assign($1, $3);
	      }), o('Assignable = TERMINATOR Expression', function() {
	        return new Assign($1, $4);
	      }), o('Assignable = INDENT Expression OUTDENT', function() {
	        return new Assign($1, $4);
	      })
	    ],
	    AssignObj: [
	      o('ObjAssignable', function() {
	        return new Value($1);
	      }), o('ObjAssignable : Expression', function() {
	        return new Assign(LOC(1)(new Value($1)), $3, 'object', {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('ObjAssignable : INDENT Expression OUTDENT', function() {
	        return new Assign(LOC(1)(new Value($1)), $4, 'object', {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('SimpleObjAssignable = Expression', function() {
	        return new Assign(LOC(1)(new Value($1)), $3, null, {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('SimpleObjAssignable = INDENT Expression OUTDENT', function() {
	        return new Assign(LOC(1)(new Value($1)), $4, null, {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('Comment')
	    ],
	    SimpleObjAssignable: [o('Identifier'), o('Property'), o('ThisProperty')],
	    ObjAssignable: [o('SimpleObjAssignable'), o('AlphaNumeric')],
	    Return: [
	      o('RETURN Expression', function() {
	        return new Return($2);
	      }), o('RETURN INDENT Object OUTDENT', function() {
	        return new Return(new Value($3));
	      }), o('RETURN', function() {
	        return new Return;
	      })
	    ],
	    YieldReturn: [
	      o('YIELD RETURN Expression', function() {
	        return new YieldReturn($3);
	      }), o('YIELD RETURN', function() {
	        return new YieldReturn;
	      })
	    ],
	    Comment: [
	      o('HERECOMMENT', function() {
	        return new Comment($1);
	      })
	    ],
	    Code: [
	      o('PARAM_START ParamList PARAM_END FuncGlyph Block', function() {
	        return new Code($2, $5, $4);
	      }), o('FuncGlyph Block', function() {
	        return new Code([], $2, $1);
	      })
	    ],
	    FuncGlyph: [
	      o('->', function() {
	        return 'func';
	      }), o('=>', function() {
	        return 'boundfunc';
	      })
	    ],
	    OptComma: [o(''), o(',')],
	    ParamList: [
	      o('', function() {
	        return [];
	      }), o('Param', function() {
	        return [$1];
	      }), o('ParamList , Param', function() {
	        return $1.concat($3);
	      }), o('ParamList OptComma TERMINATOR Param', function() {
	        return $1.concat($4);
	      }), o('ParamList OptComma INDENT ParamList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Param: [
	      o('ParamVar', function() {
	        return new Param($1);
	      }), o('ParamVar ...', function() {
	        return new Param($1, null, true);
	      }), o('ParamVar = Expression', function() {
	        return new Param($1, $3);
	      }), o('...', function() {
	        return new Expansion;
	      })
	    ],
	    ParamVar: [o('Identifier'), o('ThisProperty'), o('Array'), o('Object')],
	    Splat: [
	      o('Expression ...', function() {
	        return new Splat($1);
	      })
	    ],
	    SimpleAssignable: [
	      o('Identifier', function() {
	        return new Value($1);
	      }), o('Value Accessor', function() {
	        return $1.add($2);
	      }), o('Invocation Accessor', function() {
	        return new Value($1, [].concat($2));
	      }), o('ThisProperty')
	    ],
	    Assignable: [
	      o('SimpleAssignable'), o('Array', function() {
	        return new Value($1);
	      }), o('Object', function() {
	        return new Value($1);
	      })
	    ],
	    Value: [
	      o('Assignable'), o('Literal', function() {
	        return new Value($1);
	      }), o('Parenthetical', function() {
	        return new Value($1);
	      }), o('Range', function() {
	        return new Value($1);
	      }), o('This')
	    ],
	    Accessor: [
	      o('.  Property', function() {
	        return new Access($2);
	      }), o('?. Property', function() {
	        return new Access($2, 'soak');
	      }), o(':: Property', function() {
	        return [LOC(1)(new Access(new PropertyName('prototype'))), LOC(2)(new Access($2))];
	      }), o('?:: Property', function() {
	        return [LOC(1)(new Access(new PropertyName('prototype'), 'soak')), LOC(2)(new Access($2))];
	      }), o('::', function() {
	        return new Access(new PropertyName('prototype'));
	      }), o('Index')
	    ],
	    Index: [
	      o('INDEX_START IndexValue INDEX_END', function() {
	        return $2;
	      }), o('INDEX_SOAK  Index', function() {
	        return extend($2, {
	          soak: true
	        });
	      })
	    ],
	    IndexValue: [
	      o('Expression', function() {
	        return new Index($1);
	      }), o('Slice', function() {
	        return new Slice($1);
	      })
	    ],
	    Object: [
	      o('{ AssignList OptComma }', function() {
	        return new Obj($2, $1.generated);
	      })
	    ],
	    AssignList: [
	      o('', function() {
	        return [];
	      }), o('AssignObj', function() {
	        return [$1];
	      }), o('AssignList , AssignObj', function() {
	        return $1.concat($3);
	      }), o('AssignList OptComma TERMINATOR AssignObj', function() {
	        return $1.concat($4);
	      }), o('AssignList OptComma INDENT AssignList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Class: [
	      o('CLASS', function() {
	        return new Class;
	      }), o('CLASS Block', function() {
	        return new Class(null, null, $2);
	      }), o('CLASS EXTENDS Expression', function() {
	        return new Class(null, $3);
	      }), o('CLASS EXTENDS Expression Block', function() {
	        return new Class(null, $3, $4);
	      }), o('CLASS SimpleAssignable', function() {
	        return new Class($2);
	      }), o('CLASS SimpleAssignable Block', function() {
	        return new Class($2, null, $3);
	      }), o('CLASS SimpleAssignable EXTENDS Expression', function() {
	        return new Class($2, $4);
	      }), o('CLASS SimpleAssignable EXTENDS Expression Block', function() {
	        return new Class($2, $4, $5);
	      })
	    ],
	    Import: [
	      o('IMPORT String', function() {
	        return new ImportDeclaration(null, $2);
	      }), o('IMPORT ImportDefaultSpecifier FROM String', function() {
	        return new ImportDeclaration(new ImportClause($2, null), $4);
	      }), o('IMPORT ImportNamespaceSpecifier FROM String', function() {
	        return new ImportDeclaration(new ImportClause(null, $2), $4);
	      }), o('IMPORT { } FROM String', function() {
	        return new ImportDeclaration(new ImportClause(null, new ImportSpecifierList([])), $5);
	      }), o('IMPORT { ImportSpecifierList OptComma } FROM String', function() {
	        return new ImportDeclaration(new ImportClause(null, new ImportSpecifierList($3)), $7);
	      }), o('IMPORT ImportDefaultSpecifier , ImportNamespaceSpecifier FROM String', function() {
	        return new ImportDeclaration(new ImportClause($2, $4), $6);
	      }), o('IMPORT ImportDefaultSpecifier , { ImportSpecifierList OptComma } FROM String', function() {
	        return new ImportDeclaration(new ImportClause($2, new ImportSpecifierList($5)), $9);
	      })
	    ],
	    ImportSpecifierList: [
	      o('ImportSpecifier', function() {
	        return [$1];
	      }), o('ImportSpecifierList , ImportSpecifier', function() {
	        return $1.concat($3);
	      }), o('ImportSpecifierList OptComma TERMINATOR ImportSpecifier', function() {
	        return $1.concat($4);
	      }), o('INDENT ImportSpecifierList OptComma OUTDENT', function() {
	        return $2;
	      }), o('ImportSpecifierList OptComma INDENT ImportSpecifierList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    ImportSpecifier: [
	      o('Identifier', function() {
	        return new ImportSpecifier($1);
	      }), o('Identifier AS Identifier', function() {
	        return new ImportSpecifier($1, $3);
	      }), o('DEFAULT', function() {
	        return new ImportSpecifier(new Literal($1));
	      }), o('DEFAULT AS Identifier', function() {
	        return new ImportSpecifier(new Literal($1), $3);
	      })
	    ],
	    ImportDefaultSpecifier: [
	      o('Identifier', function() {
	        return new ImportDefaultSpecifier($1);
	      })
	    ],
	    ImportNamespaceSpecifier: [
	      o('IMPORT_ALL AS Identifier', function() {
	        return new ImportNamespaceSpecifier(new Literal($1), $3);
	      })
	    ],
	    Export: [
	      o('EXPORT { }', function() {
	        return new ExportNamedDeclaration(new ExportSpecifierList([]));
	      }), o('EXPORT { ExportSpecifierList OptComma }', function() {
	        return new ExportNamedDeclaration(new ExportSpecifierList($3));
	      }), o('EXPORT Class', function() {
	        return new ExportNamedDeclaration($2);
	      }), o('EXPORT Identifier = Expression', function() {
	        return new ExportNamedDeclaration(new Assign($2, $4, null, {
	          moduleDeclaration: 'export'
	        }));
	      }), o('EXPORT Identifier = TERMINATOR Expression', function() {
	        return new ExportNamedDeclaration(new Assign($2, $5, null, {
	          moduleDeclaration: 'export'
	        }));
	      }), o('EXPORT Identifier = INDENT Expression OUTDENT', function() {
	        return new ExportNamedDeclaration(new Assign($2, $5, null, {
	          moduleDeclaration: 'export'
	        }));
	      }), o('EXPORT DEFAULT Expression', function() {
	        return new ExportDefaultDeclaration($3);
	      }), o('EXPORT EXPORT_ALL FROM String', function() {
	        return new ExportAllDeclaration(new Literal($2), $4);
	      }), o('EXPORT { ExportSpecifierList OptComma } FROM String', function() {
	        return new ExportNamedDeclaration(new ExportSpecifierList($3), $7);
	      })
	    ],
	    ExportSpecifierList: [
	      o('ExportSpecifier', function() {
	        return [$1];
	      }), o('ExportSpecifierList , ExportSpecifier', function() {
	        return $1.concat($3);
	      }), o('ExportSpecifierList OptComma TERMINATOR ExportSpecifier', function() {
	        return $1.concat($4);
	      }), o('INDENT ExportSpecifierList OptComma OUTDENT', function() {
	        return $2;
	      }), o('ExportSpecifierList OptComma INDENT ExportSpecifierList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    ExportSpecifier: [
	      o('Identifier', function() {
	        return new ExportSpecifier($1);
	      }), o('Identifier AS Identifier', function() {
	        return new ExportSpecifier($1, $3);
	      }), o('Identifier AS DEFAULT', function() {
	        return new ExportSpecifier($1, new Literal($3));
	      }), o('DEFAULT', function() {
	        return new ExportSpecifier(new Literal($1));
	      }), o('DEFAULT AS Identifier', function() {
	        return new ExportSpecifier(new Literal($1), $3);
	      })
	    ],
	    Invocation: [
	      o('Value OptFuncExist String', function() {
	        return new TaggedTemplateCall($1, $3, $2);
	      }), o('Value OptFuncExist Arguments', function() {
	        return new Call($1, $3, $2);
	      }), o('Invocation OptFuncExist Arguments', function() {
	        return new Call($1, $3, $2);
	      }), o('Super')
	    ],
	    Super: [
	      o('SUPER', function() {
	        return new SuperCall;
	      }), o('SUPER Arguments', function() {
	        return new SuperCall($2);
	      })
	    ],
	    OptFuncExist: [
	      o('', function() {
	        return false;
	      }), o('FUNC_EXIST', function() {
	        return true;
	      })
	    ],
	    Arguments: [
	      o('CALL_START CALL_END', function() {
	        return [];
	      }), o('CALL_START ArgList OptComma CALL_END', function() {
	        return $2;
	      })
	    ],
	    This: [
	      o('THIS', function() {
	        return new Value(new ThisLiteral);
	      }), o('@', function() {
	        return new Value(new ThisLiteral);
	      })
	    ],
	    ThisProperty: [
	      o('@ Property', function() {
	        return new Value(LOC(1)(new ThisLiteral), [LOC(2)(new Access($2))], 'this');
	      })
	    ],
	    Array: [
	      o('[ ]', function() {
	        return new Arr([]);
	      }), o('[ ArgList OptComma ]', function() {
	        return new Arr($2);
	      })
	    ],
	    RangeDots: [
	      o('..', function() {
	        return 'inclusive';
	      }), o('...', function() {
	        return 'exclusive';
	      })
	    ],
	    Range: [
	      o('[ Expression RangeDots Expression ]', function() {
	        return new Range($2, $4, $3);
	      })
	    ],
	    Slice: [
	      o('Expression RangeDots Expression', function() {
	        return new Range($1, $3, $2);
	      }), o('Expression RangeDots', function() {
	        return new Range($1, null, $2);
	      }), o('RangeDots Expression', function() {
	        return new Range(null, $2, $1);
	      }), o('RangeDots', function() {
	        return new Range(null, null, $1);
	      })
	    ],
	    ArgList: [
	      o('Arg', function() {
	        return [$1];
	      }), o('ArgList , Arg', function() {
	        return $1.concat($3);
	      }), o('ArgList OptComma TERMINATOR Arg', function() {
	        return $1.concat($4);
	      }), o('INDENT ArgList OptComma OUTDENT', function() {
	        return $2;
	      }), o('ArgList OptComma INDENT ArgList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Arg: [
	      o('Expression'), o('Splat'), o('...', function() {
	        return new Expansion;
	      })
	    ],
	    SimpleArgs: [
	      o('Expression'), o('SimpleArgs , Expression', function() {
	        return [].concat($1, $3);
	      })
	    ],
	    Try: [
	      o('TRY Block', function() {
	        return new Try($2);
	      }), o('TRY Block Catch', function() {
	        return new Try($2, $3[0], $3[1]);
	      }), o('TRY Block FINALLY Block', function() {
	        return new Try($2, null, null, $4);
	      }), o('TRY Block Catch FINALLY Block', function() {
	        return new Try($2, $3[0], $3[1], $5);
	      })
	    ],
	    Catch: [
	      o('CATCH Identifier Block', function() {
	        return [$2, $3];
	      }), o('CATCH Object Block', function() {
	        return [LOC(2)(new Value($2)), $3];
	      }), o('CATCH Block', function() {
	        return [null, $2];
	      })
	    ],
	    Throw: [
	      o('THROW Expression', function() {
	        return new Throw($2);
	      })
	    ],
	    Parenthetical: [
	      o('( Body )', function() {
	        return new Parens($2);
	      }), o('( INDENT Body OUTDENT )', function() {
	        return new Parens($3);
	      })
	    ],
	    WhileSource: [
	      o('WHILE Expression', function() {
	        return new While($2);
	      }), o('WHILE Expression WHEN Expression', function() {
	        return new While($2, {
	          guard: $4
	        });
	      }), o('UNTIL Expression', function() {
	        return new While($2, {
	          invert: true
	        });
	      }), o('UNTIL Expression WHEN Expression', function() {
	        return new While($2, {
	          invert: true,
	          guard: $4
	        });
	      })
	    ],
	    While: [
	      o('WhileSource Block', function() {
	        return $1.addBody($2);
	      }), o('Statement  WhileSource', function() {
	        return $2.addBody(LOC(1)(Block.wrap([$1])));
	      }), o('Expression WhileSource', function() {
	        return $2.addBody(LOC(1)(Block.wrap([$1])));
	      }), o('Loop', function() {
	        return $1;
	      })
	    ],
	    Loop: [
	      o('LOOP Block', function() {
	        return new While(LOC(1)(new BooleanLiteral('true'))).addBody($2);
	      }), o('LOOP Expression', function() {
	        return new While(LOC(1)(new BooleanLiteral('true'))).addBody(LOC(2)(Block.wrap([$2])));
	      })
	    ],
	    For: [
	      o('Statement  ForBody', function() {
	        return new For($1, $2);
	      }), o('Expression ForBody', function() {
	        return new For($1, $2);
	      }), o('ForBody    Block', function() {
	        return new For($2, $1);
	      })
	    ],
	    ForBody: [
	      o('FOR Range', function() {
	        return {
	          source: LOC(2)(new Value($2))
	        };
	      }), o('FOR Range BY Expression', function() {
	        return {
	          source: LOC(2)(new Value($2)),
	          step: $4
	        };
	      }), o('ForStart ForSource', function() {
	        $2.own = $1.own;
	        $2.ownTag = $1.ownTag;
	        $2.name = $1[0];
	        $2.index = $1[1];
	        return $2;
	      })
	    ],
	    ForStart: [
	      o('FOR ForVariables', function() {
	        return $2;
	      }), o('FOR OWN ForVariables', function() {
	        $3.own = true;
	        $3.ownTag = LOC(2)(new Literal($2));
	        return $3;
	      })
	    ],
	    ForValue: [
	      o('Identifier'), o('ThisProperty'), o('Array', function() {
	        return new Value($1);
	      }), o('Object', function() {
	        return new Value($1);
	      })
	    ],
	    ForVariables: [
	      o('ForValue', function() {
	        return [$1];
	      }), o('ForValue , ForValue', function() {
	        return [$1, $3];
	      })
	    ],
	    ForSource: [
	      o('FORIN Expression', function() {
	        return {
	          source: $2
	        };
	      }), o('FOROF Expression', function() {
	        return {
	          source: $2,
	          object: true
	        };
	      }), o('FORIN Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          guard: $4
	        };
	      }), o('FOROF Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          guard: $4,
	          object: true
	        };
	      }), o('FORIN Expression BY Expression', function() {
	        return {
	          source: $2,
	          step: $4
	        };
	      }), o('FORIN Expression WHEN Expression BY Expression', function() {
	        return {
	          source: $2,
	          guard: $4,
	          step: $6
	        };
	      }), o('FORIN Expression BY Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          step: $4,
	          guard: $6
	        };
	      }), o('FORFROM Expression', function() {
	        return {
	          source: $2,
	          from: true
	        };
	      }), o('FORFROM Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          guard: $4,
	          from: true
	        };
	      })
	    ],
	    Switch: [
	      o('SWITCH Expression INDENT Whens OUTDENT', function() {
	        return new Switch($2, $4);
	      }), o('SWITCH Expression INDENT Whens ELSE Block OUTDENT', function() {
	        return new Switch($2, $4, $6);
	      }), o('SWITCH INDENT Whens OUTDENT', function() {
	        return new Switch(null, $3);
	      }), o('SWITCH INDENT Whens ELSE Block OUTDENT', function() {
	        return new Switch(null, $3, $5);
	      })
	    ],
	    Whens: [
	      o('When'), o('Whens When', function() {
	        return $1.concat($2);
	      })
	    ],
	    When: [
	      o('LEADING_WHEN SimpleArgs Block', function() {
	        return [[$2, $3]];
	      }), o('LEADING_WHEN SimpleArgs Block TERMINATOR', function() {
	        return [[$2, $3]];
	      })
	    ],
	    IfBlock: [
	      o('IF Expression Block', function() {
	        return new If($2, $3, {
	          type: $1
	        });
	      }), o('IfBlock ELSE IF Expression Block', function() {
	        return $1.addElse(LOC(3, 5)(new If($4, $5, {
	          type: $3
	        })));
	      })
	    ],
	    If: [
	      o('IfBlock'), o('IfBlock ELSE Block', function() {
	        return $1.addElse($3);
	      }), o('Statement  POST_IF Expression', function() {
	        return new If($3, LOC(1)(Block.wrap([$1])), {
	          type: $2,
	          statement: true
	        });
	      }), o('Expression POST_IF Expression', function() {
	        return new If($3, LOC(1)(Block.wrap([$1])), {
	          type: $2,
	          statement: true
	        });
	      })
	    ],
	    Operation: [
	      o('UNARY Expression', function() {
	        return new Op($1, $2);
	      }), o('UNARY_MATH Expression', function() {
	        return new Op($1, $2);
	      }), o('-     Expression', (function() {
	        return new Op('-', $2);
	      }), {
	        prec: 'UNARY_MATH'
	      }), o('+     Expression', (function() {
	        return new Op('+', $2);
	      }), {
	        prec: 'UNARY_MATH'
	      }), o('-- SimpleAssignable', function() {
	        return new Op('--', $2);
	      }), o('++ SimpleAssignable', function() {
	        return new Op('++', $2);
	      }), o('SimpleAssignable --', function() {
	        return new Op('--', $1, null, true);
	      }), o('SimpleAssignable ++', function() {
	        return new Op('++', $1, null, true);
	      }), o('Expression ?', function() {
	        return new Existence($1);
	      }), o('Expression +  Expression', function() {
	        return new Op('+', $1, $3);
	      }), o('Expression -  Expression', function() {
	        return new Op('-', $1, $3);
	      }), o('Expression MATH     Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression **       Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression SHIFT    Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression COMPARE  Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression &        Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression ^        Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression |        Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression &&       Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression ||       Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression BIN?     Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression RELATION Expression', function() {
	        if ($2.charAt(0) === '!') {
	          return new Op($2.slice(1), $1, $3).invert();
	        } else {
	          return new Op($2, $1, $3);
	        }
	      }), o('SimpleAssignable COMPOUND_ASSIGN Expression', function() {
	        return new Assign($1, $3, $2);
	      }), o('SimpleAssignable COMPOUND_ASSIGN INDENT Expression OUTDENT', function() {
	        return new Assign($1, $4, $2);
	      }), o('SimpleAssignable COMPOUND_ASSIGN TERMINATOR Expression', function() {
	        return new Assign($1, $4, $2);
	      }), o('SimpleAssignable EXTENDS Expression', function() {
	        return new Extends($1, $3);
	      })
	    ]
	  };

	  operators = [['left', '.', '?.', '::', '?::'], ['left', 'CALL_START', 'CALL_END'], ['nonassoc', '++', '--'], ['left', '?'], ['right', 'UNARY'], ['right', '**'], ['right', 'UNARY_MATH'], ['left', 'MATH'], ['left', '+', '-'], ['left', 'SHIFT'], ['left', 'RELATION'], ['left', 'COMPARE'], ['left', '&'], ['left', '^'], ['left', '|'], ['left', '&&'], ['left', '||'], ['left', 'BIN?'], ['nonassoc', 'INDENT', 'OUTDENT'], ['right', 'YIELD'], ['right', '=', ':', 'COMPOUND_ASSIGN', 'RETURN', 'THROW', 'EXTENDS'], ['right', 'FORIN', 'FOROF', 'FORFROM', 'BY', 'WHEN'], ['right', 'IF', 'ELSE', 'FOR', 'WHILE', 'UNTIL', 'LOOP', 'SUPER', 'CLASS', 'IMPORT', 'EXPORT'], ['left', 'POST_IF']];

	  tokens = [];

	  for (name in grammar) {
	    alternatives = grammar[name];
	    grammar[name] = (function() {
	      var i, j, len, len1, ref, results;
	      results = [];
	      for (i = 0, len = alternatives.length; i < len; i++) {
	        alt = alternatives[i];
	        ref = alt[0].split(' ');
	        for (j = 0, len1 = ref.length; j < len1; j++) {
	          token = ref[j];
	          if (!grammar[token]) {
	            tokens.push(token);
	          }
	        }
	        if (name === 'Root') {
	          alt[1] = "return " + alt[1];
	        }
	        results.push(alt);
	      }
	      return results;
	    })();
	  }

	  exports.parser = new Parser({
	    tokens: tokens.join(' '),
	    bnf: grammar,
	    operators: operators.reverse(),
	    startSymbol: 'Root'
	  });

	}).call(this);


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var key, ref, val;

	  ref = __webpack_require__(168);
	  for (key in ref) {
	    val = ref[key];
	    exports[key] = val;
	  }

	}).call(this);


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.12.7
	(function() {
	  var CoffeeScript, Module, binary, child_process, ext, findExtension, fork, helpers, i, len, loadFile, path, ref;

	  CoffeeScript = __webpack_require__(168);

	  child_process = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  helpers = __webpack_require__(173);

	  path = __webpack_require__(7);

	  loadFile = function(module, filename) {
	    var answer;
	    answer = CoffeeScript._compileFile(filename, false, true);
	    return module._compile(answer, filename);
	  };

	  if ((void 0)) {
	    ref = CoffeeScript.FILE_EXTENSIONS;
	    for (i = 0, len = ref.length; i < len; i++) {
	      ext = ref[i];
	      (void 0)[ext] = loadFile;
	    }
	    Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    findExtension = function(filename) {
	      var curExtension, extensions;
	      extensions = path.basename(filename).split('.');
	      if (extensions[0] === '') {
	        extensions.shift();
	      }
	      while (extensions.shift()) {
	        curExtension = '.' + extensions.join('.');
	        if (Module._extensions[curExtension]) {
	          return curExtension;
	        }
	      }
	      return '.js';
	    };
	    Module.prototype.load = function(filename) {
	      var extension;
	      this.filename = filename;
	      this.paths = Module._nodeModulePaths(path.dirname(filename));
	      extension = findExtension(filename);
	      Module._extensions[extension](this, filename);
	      return this.loaded = true;
	    };
	  }

	  if (child_process) {
	    fork = child_process.fork;
	    binary = /*require.resolve*/(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../bin/coffee\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    child_process.fork = function(path, args, options) {
	      if (helpers.isCoffee(path)) {
	        if (!Array.isArray(args)) {
	          options = args || {};
	          args = [];
	        }
	        args = [path].concat(args);
	        path = binary;
	      }
	      return fork(path, args, options);
	    };
	  }

	}).call(this);


/***/ })
/******/ ]);