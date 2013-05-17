/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, crossDomain, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        crossDomain = element.data('cross-domain') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e)
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
      rails.enableElement($(this));
  });

  $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
    var link = $(this), method = link.data('method'), data = link.data('params');
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

    if (link.data('remote') !== undefined) {
      if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

      if (rails.handleRemote(link) === false) { rails.enableElement(link); }
      return false;

    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

  $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });

  $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;

    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */



!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);













/*! jQuery Validation Plugin - v1.11.0 - 2/4/2013
* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2013 Jörn Zaefferer; Licensed MIT */


(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data( this[0], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[0] );
		$.data( this[0], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $(event.target).hasClass("cancel") ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
		if ( $(this[0]).is("form")) {
			return this.validate().form();
		} else {
			var valid = true;
			var validator = $(this[0].form).validate();
			this.each(function() {
				valid &= validator.element(this);
			});
			return valid;
		}
	},
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function( attributes ) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function( index, value ) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function( command, argument ) {
		var element = this[0];

		if ( command ) {
			var settings = $.data(element.form, "validator").settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if ( argument.messages ) {
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function( index, method ) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.dataRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if ( data.required ) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function( a ) { return !$.trim("" + a.value); },
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function( a ) { return !!$.trim("" + a.value); },
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function( a ) { return !a.checked; }
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each(params, function( i, n ) {
		source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
			return n;
		});
	});
	return source;
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
		errorContainer: $([]),
		errorLabelContainer: $([]),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element, event ) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		onfocusout: function( element, event ) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function( element, event ) {
			if ( event.which === 9 && this.elementValue(element) === "" ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function( element, event ) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element(element);
			}
			// or option elements, check parent select in that case
			else if ( element.parentNode.name in this.submitted ) {
				this.element(element.parentNode);
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split(/\s/);
				}
				$.each(value, function( index, name ) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function( key, value ) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				if ( validator.settings[eventType] ) {
					validator.settings[eventType].call(validator, this[0], event);
				}
			}
			$(this.currentForm)
				.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'] ",
					"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

			if ( this.settings.invalidHandler ) {
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if ( !this.valid() ) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element ) !== false;
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function( errors ) {
			if ( errors ) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !(element.name in errors);
				});
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$(this.currentForm).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this);
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
					return false;
				}

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $(selector)[0];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.replace(" ", ".");
			return $(this.settings.errorElement + "." + errorClass, this.errorContext);
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		elementValue: function( element ) {
			var type = $(element).attr("type"),
				val = $(element).val();

			if ( type === "radio" || type === "checkbox" ) {
				return $("input[name='" + $(element).attr("name") + "']:checked").val();
			}

			if ( typeof val === "string" ) {
				return val.replace(/\r/g, "");
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $(element).rules();
			var dependencyMismatch = false;
			var val = this.elementValue(element);
			var result;

			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {

					result = $.validator.methods[method].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occured when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength(rules) ) {
				this.successList.push(element);
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		customDataMessage: function( element, method ) {
			return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor === String ? m : m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if ( arguments[i] !== undefined ) {
					return arguments[i];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method ) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements;
			for ( i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function( element, message ) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
				// replace message on existing label
				label.html(message);
			} else {
				// create label
				label = $("<" + this.settings.errorElement + ">")
					.attr("for", this.idOrName(element))
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length ) {
					if ( this.settings.errorPlacement ) {
						this.settings.errorPlacement(label, $(element) );
					} else {
						label.insertAfter(element);
					}
				}
			}
			if ( !message && this.settings.success ) {
				label.text("");
				if ( typeof this.settings.success === "string" ) {
					label.addClass( this.settings.success );
				} else {
					this.settings.success( label, element );
				}
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function( element ) {
			var name = this.idOrName(element);
			return this.errors().filter(function() {
				return $(this).attr("for") === name;
			});
		},

		idOrName: function( element ) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		validationTargetFor: function( element ) {
			// if radio/checkbox, validate first element in group instead
			if ( this.checkable(element) ) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}
			return element;
		},

		checkable: function( element ) {
			return (/radio|checkbox/i).test(element.type);
		},

		findByName: function( name ) {
			return $(this.currentForm).find("[name='" + name + "']");
		},

		getLength: function( value, element ) {
			switch( element.nodeName.toLowerCase() ) {
			case "select":
				return $("option:selected", element).length;
			case "input":
				if ( this.checkable( element) ) {
					return this.findByName(element.name).filter(":checked").length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
		},

		dependTypes: {
			"boolean": function( param, element ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$(param, element.form).length;
			},
			"function": function( param, element ) {
				return param(element);
			}
		},

		optional: function( element ) {
			var val = this.elementValue(element);
			return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[element.name] ) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[element.name];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function( element ) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		number: {number: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[className] = rules;
		} else {
			$.extend(this.classRuleSettings, className);
		}
	},

	classRules: function( element ) {
		var rules = {};
		var classes = $(element).attr("class");
		if ( classes ) {
			$.each(classes.split(" "), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend(rules, $.validator.classRuleSettings[this]);
				}
			});
		}
		return rules;
	},

	attributeRules: function( element ) {
		var rules = {};
		var $element = $(element);

		for (var method in $.validator.methods) {
			var value;

			// support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = $element.get(0).getAttribute(method);
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr(method);
			}

			if ( value ) {
				rules[method] = value;
			} else if ( $element[0].getAttribute("type") === method ) {
				rules[method] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var method, value,
			rules = {}, $element = $(element);
		for (method in $.validator.methods) {
			value = $element.data("rule-" + method.toLowerCase());
			if ( value !== undefined ) {
				rules[method] = value;
			}
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {};
		var validator = $.data(element.form, "validator");
		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {
		// handle dependency check
		$.each(rules, function( prop, val ) {
			// ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[prop];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch (typeof val.depends) {
				case "string":
					keepRule = !!$(val.depends, element.form).length;
					break;
				case "function":
					keepRule = val.depends.call(element, element);
					break;
				}
				if ( keepRule ) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function( rule, parameter ) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength'], function() {
			if ( rules[this] ) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength'], function() {
			var parts;
			if ( rules[this] ) {
				if ( $.isArray(rules[this]) ) {
					rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
				} else if ( typeof rules[this] === "string" ) {
					parts = rules[this].split(/[\s,]+/);
					rules[this] = [Number(parts[0]), Number(parts[1])];
				}
			}
		});

		if ( $.validator.autoCreateRanges ) {
			// auto-create ranges
			if ( rules.min && rules.max ) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength && rules.maxlength ) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function( name, method, message ) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
		if ( method.length < 3 ) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function( value, element, param ) {
			// check if dependency is met
			if ( !this.depend(param, element) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			}
			if ( this.checkable(element) ) {
				return this.getLength(value, element) > 0;
			}
			return $.trim(value).length > 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function( value, element, param ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] ) {
				this.settings.messages[element.name] = {};
			}
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param === "string" && {url:param} || param;

			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function( response ) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true || response === "true";
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						delete validator.invalid[element.name];
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.invalid[element.name] = true;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function( value, element ) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function( value, element ) {
			return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function( value, element ) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function( value, element ) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function( value, element ) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if ( /[^0-9 \-]+/.test(value) ) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if ( bEven ) {
					if ( (nDigit *= 2) > 9 ) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function( value, element, param ) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param);
			if ( this.settings.onfocusout ) {
				target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
					$(element).valid();
				});
			}
			return value === target.val();
		}

	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function( settings, _, xhr ) {
			var port = settings.port;
			if ( settings.mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function( settings ) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if ( mode === "abort" ) {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	$.extend($.fn, {
		validateDelegate: function( delegate, type, handler ) {
			return this.bind(type, function( event ) {
				var target = $(event.target);
				if ( target.is(delegate) ) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));
/**
 * Galleria v 1.2.9 2013-02-14
 * http://galleria.io
 *
 * Licensed under the MIT license
 * https://raw.github.com/aino/galleria/master/LICENSE
 *
 */


(function( $ ) {

/*global jQuery, navigator, Galleria:true, Image */

// some references
var undef,
    window = this,
    doc    = window.document,
    $doc   = $( doc ),
    $win   = $( window ),

// native prototypes
    protoArray = Array.prototype,

// internal constants
    VERSION = 1.29,
    DEBUG = true,
    TIMEOUT = 30000,
    DUMMY = false,
    NAV = navigator.userAgent.toLowerCase(),
    HASH = window.location.hash.replace(/#\//, ''),
    F = function(){},
    FALSE = function() { return false; },
    IE = (function() {

        var v = 3,
            div = doc.createElement( 'div' ),
            all = div.getElementsByTagName( 'i' );

        do {
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
        } while ( all[0] );

        return v > 4 ? v : undef;

    }() ),
    DOM = function() {
        return {
            html:  doc.documentElement,
            body:  doc.body,
            head:  doc.getElementsByTagName('head')[0],
            title: doc.title
        };
    },
    IFRAME = window.parent !== window.self,

    // list of Galleria events
    _eventlist = 'data ready thumbnail loadstart loadfinish image play pause progress ' +
                 'fullscreen_enter fullscreen_exit idle_enter idle_exit rescale ' +
                 'lightbox_open lightbox_close lightbox_image',

    _events = (function() {

        var evs = [];

        $.each( _eventlist.split(' '), function( i, ev ) {
            evs.push( ev );

            // legacy events
            if ( /_/.test( ev ) ) {
                evs.push( ev.replace( /_/g, '' ) );
            }
        });

        return evs;

    }()),

    // legacy options
    // allows the old my_setting syntax and converts it to camel case

    _legacyOptions = function( options ) {

        var n;

        if ( typeof options !== 'object' ) {

            // return whatever it was...
            return options;
        }

        $.each( options, function( key, value ) {
            if ( /^[a-z]+_/.test( key ) ) {
                n = '';
                $.each( key.split('_'), function( i, k ) {
                    n += i > 0 ? k.substr( 0, 1 ).toUpperCase() + k.substr( 1 ) : k;
                });
                options[ n ] = value;
                delete options[ key ];
            }
        });

        return options;
    },

    _patchEvent = function( type ) {

        // allow 'image' instead of Galleria.IMAGE
        if ( $.inArray( type, _events ) > -1 ) {
            return Galleria[ type.toUpperCase() ];
        }

        return type;
    },

    // video providers
    _video = {
        youtube: {
            reg: /https?:\/\/(?:[a-zA_Z]{2,3}.)?(?:youtube\.com\/watch\?)((?:[\w\d\-\_\=]+&amp;(?:amp;)?)*v(?:&lt;[A-Z]+&gt;)?=([0-9a-zA-Z\-\_]+))/i,
            embed: function(id) {
                return 'http://www.youtube.com/embed/'+id;
            },
            getThumb: function( id, success, fail ) {
                fail = fail || F;
                $.getJSON(window.location.protocol+'//gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json-in-script&callback=?', function(data) {
                    try {
                        success( data.entry.media$group.media$thumbnail[0].url );
                    } catch(e) {
                        fail();
                    }
                }).error(fail);
            }
        },
        vimeo: {
            reg: /https?:\/\/(?:www\.)?(vimeo\.com)\/(?:hd#)?([0-9]+)/i,
            embed: function(id) {
                return 'http://player.vimeo.com/video/'+id;
            },
            getThumb: function( id, success, fail ) {
                fail = fail || F;
                $.getJSON('http://vimeo.com/api/v2/video/' + id + '.json?callback=?', function(data) {
                    try {
                        success( data[0].thumbnail_medium );
                    } catch(e) {
                        fail();
                    }
                }).error(fail);
            }
        },
        dailymotion: {
            reg: /https?:\/\/(?:www\.)?(dailymotion\.com)\/video\/([^_]+)/,
            embed: function(id) {
                return 'http://www.dailymotion.com/embed/video/'+id;
            },
            getThumb: function( id, success, fail ) {
                fail = fail || F;
                $.getJSON('https://api.dailymotion.com/video/'+id+'?fields=thumbnail_medium_url&callback=?', function(data) {
                    try {
                        success( data.thumbnail_medium_url );
                    } catch(e) {
                        fail();
                    }
                }).error(fail);
            }
        }
    },

    // utility for testing the video URL and getting the video ID
    _videoTest = function( url ) {
        var match;
        for ( var v in _video ) {
            match = url && url.match( _video[v].reg );
            if( match && match.length ) {
                return {
                    id: match[2],
                    provider: v
                };
            }
        }
        return false;
    },

    // native fullscreen handler
    _nativeFullscreen = {

        support: (function() {
            var html = DOM().html;
            return !IFRAME && ( html.requestFullscreen || html.mozRequestFullScreen || html.webkitRequestFullScreen );
        }()),

        callback: F,

        enter: function( instance, callback, elem ) {

            this.instance = instance;

            this.callback = callback || F;

            elem = elem || DOM().html;
            if ( elem.requestFullscreen ) {
                elem.requestFullscreen();
            }
            else if ( elem.mozRequestFullScreen ) {
                elem.mozRequestFullScreen();
            }
            else if ( elem.webkitRequestFullScreen ) {
                elem.webkitRequestFullScreen();
            }
        },

        exit: function( callback ) {

            this.callback = callback || F;

            if ( doc.exitFullscreen ) {
                doc.exitFullscreen();
            }
            else if ( doc.mozCancelFullScreen ) {
                doc.mozCancelFullScreen();
            }
            else if ( doc.webkitCancelFullScreen ) {
                doc.webkitCancelFullScreen();
            }
        },

        instance: null,

        listen: function() {

            if ( !this.support ) {
                return;
            }

            var handler = function() {

                if ( !_nativeFullscreen.instance ) {
                    return;
                }
                var fs = _nativeFullscreen.instance._fullscreen;

                if ( doc.fullscreen || doc.mozFullScreen || doc.webkitIsFullScreen ) {
                    fs._enter( _nativeFullscreen.callback );
                } else {
                    fs._exit( _nativeFullscreen.callback );
                }
            };
            doc.addEventListener( 'fullscreenchange', handler, false );
            doc.addEventListener( 'mozfullscreenchange', handler, false );
            doc.addEventListener( 'webkitfullscreenchange', handler, false );
        }
    },

    // the internal gallery holder
    _galleries = [],

    // the internal instance holder
    _instances = [],

    // flag for errors
    _hasError = false,

    // canvas holder
    _canvas = false,

    // instance pool, holds the galleries until themeLoad is triggered
    _pool = [],

    // themeLoad trigger
    _themeLoad = function( theme ) {

        Galleria.theme = theme;

        // run the instances we have in the pool
        $.each( _pool, function( i, instance ) {
            if ( !instance._initialized ) {
                instance._init.call( instance );
            }
        });

        _pool = [];
    },

    // the Utils singleton
    Utils = (function() {

        return {

            // legacy support for clearTimer
            clearTimer: function( id ) {
                $.each( Galleria.get(), function() {
                    this.clearTimer( id );
                });
            },

            // legacy support for addTimer
            addTimer: function( id ) {
                $.each( Galleria.get(), function() {
                    this.addTimer( id );
                });
            },

            array : function( obj ) {
                return protoArray.slice.call(obj, 0);
            },

            create : function( className, nodeName ) {
                nodeName = nodeName || 'div';
                var elem = doc.createElement( nodeName );
                elem.className = className;
                return elem;
            },

            removeFromArray : function( arr, elem ) {
                $.each(arr, function(i, el) {
                    if ( el == elem ) {
                        arr.splice(i, 1);
                        return false;
                    }
                });
                return arr;
            },

            getScriptPath : function( src ) {

                // the currently executing script is always the last
                src = src || $('script:last').attr('src');
                var slices = src.split('/');

                if (slices.length == 1) {
                    return '';
                }

                slices.pop();

                return slices.join('/') + '/';
            },

            // CSS3 transitions, added in 1.2.4
            animate : (function() {

                // detect transition
                var transition = (function( style ) {
                    var props = 'transition WebkitTransition MozTransition OTransition'.split(' '),
                        i;

                    // disable css3 animations in opera until stable
                    if ( window.opera ) {
                        return false;
                    }

                    for ( i = 0; props[i]; i++ ) {
                        if ( typeof style[ props[ i ] ] !== 'undefined' ) {
                            return props[ i ];
                        }
                    }
                    return false;
                }(( doc.body || doc.documentElement).style ));

                // map transitionend event
                var endEvent = {
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd',
                    WebkitTransition: 'webkitTransitionEnd',
                    transition: 'transitionend'
                }[ transition ];

                // map bezier easing conversions
                var easings = {
                    _default: [0.25, 0.1, 0.25, 1],
                    galleria: [0.645, 0.045, 0.355, 1],
                    galleriaIn: [0.55, 0.085, 0.68, 0.53],
                    galleriaOut: [0.25, 0.46, 0.45, 0.94],
                    ease: [0.25, 0, 0.25, 1],
                    linear: [0.25, 0.25, 0.75, 0.75],
                    'ease-in': [0.42, 0, 1, 1],
                    'ease-out': [0, 0, 0.58, 1],
                    'ease-in-out': [0.42, 0, 0.58, 1]
                };

                // function for setting transition css for all browsers
                var setStyle = function( elem, value, suffix ) {
                    var css = {};
                    suffix = suffix || 'transition';
                    $.each( 'webkit moz ms o'.split(' '), function() {
                        css[ '-' + this + '-' + suffix ] = value;
                    });
                    elem.css( css );
                };

                // clear styles
                var clearStyle = function( elem ) {
                    setStyle( elem, 'none', 'transition' );
                    if ( Galleria.WEBKIT && Galleria.TOUCH ) {
                        setStyle( elem, 'translate3d(0,0,0)', 'transform' );
                        if ( elem.data('revert') ) {
                            elem.css( elem.data('revert') );
                            elem.data('revert', null);
                        }
                    }
                };

                // various variables
                var change, strings, easing, syntax, revert, form, css;

                // the actual animation method
                return function( elem, to, options ) {

                    // extend defaults
                    options = $.extend({
                        duration: 400,
                        complete: F,
                        stop: false
                    }, options);

                    // cache jQuery instance
                    elem = $( elem );

                    if ( !options.duration ) {
                        elem.css( to );
                        options.complete.call( elem[0] );
                        return;
                    }

                    // fallback to jQuery's animate if transition is not supported
                    if ( !transition ) {
                        elem.animate(to, options);
                        return;
                    }

                    // stop
                    if ( options.stop ) {
                        // clear the animation
                        elem.unbind( endEvent );
                        clearStyle( elem );
                    }

                    // see if there is a change
                    change = false;
                    $.each( to, function( key, val ) {
                        css = elem.css( key );
                        if ( Utils.parseValue( css ) != Utils.parseValue( val ) ) {
                            change = true;
                        }
                        // also add computed styles for FF
                        elem.css( key, css );
                    });
                    if ( !change ) {
                        window.setTimeout( function() {
                            options.complete.call( elem[0] );
                        }, options.duration );
                        return;
                    }

                    // the css strings to be applied
                    strings = [];

                    // the easing bezier
                    easing = options.easing in easings ? easings[ options.easing ] : easings._default;

                    // the syntax
                    syntax = ' ' + options.duration + 'ms' + ' cubic-bezier('  + easing.join(',') + ')';

                    // add a tiny timeout so that the browsers catches any css changes before animating
                    window.setTimeout( (function(elem, endEvent, to, syntax) {
                        return function() {

                            // attach the end event
                            elem.one(endEvent, (function( elem ) {
                                return function() {

                                    // clear the animation
                                    clearStyle(elem);

                                    // run the complete method
                                    options.complete.call(elem[0]);
                                };
                            }( elem )));

                            // do the webkit translate3d for better performance on iOS
                            if( Galleria.WEBKIT && Galleria.TOUCH ) {

                                revert = {};
                                form = [0,0,0];

                                $.each( ['left', 'top'], function(i, m) {
                                    if ( m in to ) {
                                        form[ i ] = ( Utils.parseValue( to[ m ] ) - Utils.parseValue(elem.css( m )) ) + 'px';
                                        revert[ m ] = to[ m ];
                                        delete to[ m ];
                                    }
                                });

                                if ( form[0] || form[1]) {

                                    elem.data('revert', revert);

                                    strings.push('-webkit-transform' + syntax);

                                    // 3d animate
                                    setStyle( elem, 'translate3d(' + form.join(',') + ')', 'transform');
                                }
                            }

                            // push the animation props
                            $.each(to, function( p, val ) {
                                strings.push(p + syntax);
                            });

                            // set the animation styles
                            setStyle( elem, strings.join(',') );

                            // animate
                            elem.css( to );

                        };
                    }(elem, endEvent, to, syntax)), 2);
                };
            }()),

            removeAlpha : function( elem ) {
                if ( IE < 9 && elem ) {

                    var style = elem.style,
                        currentStyle = elem.currentStyle,
                        filter = currentStyle && currentStyle.filter || style.filter || "";

                    if ( /alpha/.test( filter ) ) {
                        style.filter = filter.replace( /alpha\([^)]*\)/i, '' );
                    }
                }
            },

            forceStyles : function( elem, styles ) {
                elem = $(elem);
                if ( elem.attr( 'style' ) ) {
                    elem.data( 'styles', elem.attr( 'style' ) ).removeAttr( 'style' );
                }
                elem.css( styles );
            },

            revertStyles : function() {
                $.each( Utils.array( arguments ), function( i, elem ) {

                    elem = $( elem );
                    elem.removeAttr( 'style' );

                    elem.attr('style',''); // "fixes" webkit bug

                    if ( elem.data( 'styles' ) ) {
                        elem.attr( 'style', elem.data('styles') ).data( 'styles', null );
                    }
                });
            },

            moveOut : function( elem ) {
                Utils.forceStyles( elem, {
                    position: 'absolute',
                    left: -10000
                });
            },

            moveIn : function() {
                Utils.revertStyles.apply( Utils, Utils.array( arguments ) );
            },

            elem : function( elem ) {
                if (elem instanceof $) {
                    return {
                        $: elem,
                        dom: elem[0]
                    };
                } else {
                    return {
                        $: $(elem),
                        dom: elem
                    };
                }
            },

            hide : function( elem, speed, callback ) {

                callback = callback || F;

                var el = Utils.elem( elem ),
                    $elem = el.$;

                elem = el.dom;

                // save the value if not exist
                if (! $elem.data('opacity') ) {
                    $elem.data('opacity', $elem.css('opacity') );
                }

                // always hide
                var style = { opacity: 0 };

                if (speed) {

                    var complete = IE < 9 && elem ? function() {
                        Utils.removeAlpha( elem );
                        elem.style.visibility = 'hidden';
                        callback.call( elem );
                    } : callback;

                    Utils.animate( elem, style, {
                        duration: speed,
                        complete: complete,
                        stop: true
                    });
                } else {
                    if ( IE < 9 && elem ) {
                        Utils.removeAlpha( elem );
                        elem.style.visibility = 'hidden';
                    } else {
                        $elem.css( style );
                    }
                }
            },

            show : function( elem, speed, callback ) {

                callback = callback || F;

                var el = Utils.elem( elem ),
                    $elem = el.$;

                elem = el.dom;

                // bring back saved opacity
                var saved = parseFloat( $elem.data('opacity') ) || 1,
                    style = { opacity: saved };

                // animate or toggle
                if (speed) {

                    if ( IE < 9 ) {
                        $elem.css('opacity', 0);
                        elem.style.visibility = 'visible';
                    }

                    var complete = IE < 9 && elem ? function() {
                        if ( style.opacity == 1 ) {
                            Utils.removeAlpha( elem );
                        }
                        callback.call( elem );
                    } : callback;

                    Utils.animate( elem, style, {
                        duration: speed,
                        complete: complete,
                        stop: true
                    });
                } else {
                    if ( IE < 9 && style.opacity == 1 && elem ) {
                        Utils.removeAlpha( elem );
                        elem.style.visibility = 'visible';
                    } else {
                        $elem.css( style );
                    }
                }
            },


            // enhanced click for mobile devices
            // we bind a touchend and hijack any click event in the bubble
            // then we execute the click directly and save it in a separate data object for later
            optimizeTouch: (function() {

                var node,
                    evs,
                    fakes,
                    travel,
                    evt = {},
                    handler = function( e ) {
                        e.preventDefault();
                        evt = $.extend({}, e, true);
                    },
                    attach = function() {
                        this.evt = evt;
                    },
                    fake = function() {
                        this.handler.call(node, this.evt);
                    };

                return function( elem ) {

                    $(elem).bind('touchend', function( e ) {

                        node = e.target;
                        travel = true;

                        while( node.parentNode && node != e.currentTarget && travel ) {

                            evs =   $(node).data('events');
                            fakes = $(node).data('fakes');

                            if (evs && 'click' in evs) {

                                travel = false;
                                e.preventDefault();

                                // fake the click and save the event object
                                $(node).click(handler).click();

                                // remove the faked click
                                evs.click.pop();

                                // attach the faked event
                                $.each( evs.click, attach);

                                // save the faked clicks in a new data object
                                $(node).data('fakes', evs.click);

                                // remove all clicks
                                delete evs.click;

                            } else if ( fakes ) {

                                travel = false;
                                e.preventDefault();

                                // fake all clicks
                                $.each( fakes, fake );
                            }

                            // bubble
                            node = node.parentNode;
                        }
                    });
                };
            }()),

            wait : function(options) {
                options = $.extend({
                    until : FALSE,
                    success : F,
                    error : function() { Galleria.raise('Could not complete wait function.'); },
                    timeout: 3000
                }, options);

                var start = Utils.timestamp(),
                    elapsed,
                    now,
                    fn = function() {
                        now = Utils.timestamp();
                        elapsed = now - start;
                        if ( options.until( elapsed ) ) {
                            options.success();
                            return false;
                        }

                        if (typeof options.timeout == 'number' && now >= start + options.timeout) {
                            options.error();
                            return false;
                        }
                        window.setTimeout(fn, 10);
                    };

                window.setTimeout(fn, 10);
            },

            toggleQuality : function( img, force ) {

                if ( ( IE !== 7 && IE !== 8 ) || !img || img.nodeName.toUpperCase() != 'IMG' ) {
                    return;
                }

                if ( typeof force === 'undefined' ) {
                    force = img.style.msInterpolationMode === 'nearest-neighbor';
                }

                img.style.msInterpolationMode = force ? 'bicubic' : 'nearest-neighbor';
            },

            insertStyleTag : function( styles, id ) {

                if ( id && $( '#'+id ).length ) {
                    return;
                }

                var style = doc.createElement( 'style' );
                if ( id ) {
                    style.id = id;
                }

                DOM().head.appendChild( style );

                if ( style.styleSheet ) { // IE
                    style.styleSheet.cssText = styles;
                } else {
                    var cssText = doc.createTextNode( styles );
                    style.appendChild( cssText );
                }
            },

            // a loadscript method that works for local scripts
            loadScript: function( url, callback ) {

                var done = false,
                    script = $('<scr'+'ipt>').attr({
                        src: url,
                        async: true
                    }).get(0);

               // Attach handlers for all browsers
               script.onload = script.onreadystatechange = function() {
                   if ( !done && (!this.readyState ||
                       this.readyState === 'loaded' || this.readyState === 'complete') ) {

                       done = true;

                       // Handle memory leak in IE
                       script.onload = script.onreadystatechange = null;

                       if (typeof callback === 'function') {
                           callback.call( this, this );
                       }
                   }
               };

               DOM().head.appendChild( script );
            },

            // parse anything into a number
            parseValue: function( val ) {
                if (typeof val === 'number') {
                    return val;
                } else if (typeof val === 'string') {
                    var arr = val.match(/\-?\d|\./g);
                    return arr && arr.constructor === Array ? arr.join('')*1 : 0;
                } else {
                    return 0;
                }
            },

            // timestamp abstraction
            timestamp: function() {
                return new Date().getTime();
            },

            loadCSS : function( href, id, callback ) {

                var link,
                    length;

                // look for manual css
                $('link[rel=stylesheet]').each(function() {
                    if ( new RegExp( href ).test( this.href ) ) {
                        link = this;
                        return false;
                    }
                });

                if ( typeof id === 'function' ) {
                    callback = id;
                    id = undef;
                }

                callback = callback || F; // dirty

                // if already present, return
                if ( link ) {
                    callback.call( link, link );
                    return link;
                }

                // save the length of stylesheets to check against
                length = doc.styleSheets.length;

                // check for existing id
                if( $( '#' + id ).length ) {

                    $( '#' + id ).attr( 'href', href );
                    length--;

                } else {
                    link = $( '<link>' ).attr({
                        rel: 'stylesheet',
                        href: href,
                        id: id
                    }).get(0);

                    var styles = $('link[rel="stylesheet"], style');
                    if ( styles.length ) {
                        styles.get(0).parentNode.insertBefore( link, styles[0] );
                    } else {
                        DOM().head.appendChild( link );
                    }

                    if ( IE ) {

                        // IE has a limit of 31 stylesheets in one document
                        if( length >= 31 ) {
                            Galleria.raise( 'You have reached the browser stylesheet limit (31)', true );
                            return;
                        }
                    }
                }

                if ( typeof callback === 'function' ) {

                    // First check for dummy element (new in 1.2.8)
                    var $loader = $('<s>').attr( 'id', 'galleria-loader' ).hide().appendTo( DOM().body );

                    Utils.wait({
                        until: function() {
                            return $loader.height() == 1;
                        },
                        success: function() {
                            $loader.remove();
                            callback.call( link, link );
                        },
                        error: function() {
                            $loader.remove();

                            // If failed, tell the dev to download the latest theme
                            Galleria.raise( 'Theme CSS could not load after 20 sec. ' + ( Galleria.QUIRK ?
                                'Your browser is in Quirks Mode, please add a correct doctype.' :
                                'Please download the latest theme at http://galleria.io/customer/.' ), true );
                        },
                        timeout: 5000
                    });
                }
                return link;
            }
        };
    }()),

    // the transitions holder
    _transitions = (function() {

        var _slide = function(params, complete, fade, door) {

            var easing = this.getOptions('easing'),
                distance = this.getStageWidth(),
                from = { left: distance * ( params.rewind ? -1 : 1 ) },
                to = { left: 0 };

            if ( fade ) {
                from.opacity = 0;
                to.opacity = 1;
            } else {
                from.opacity = 1;
            }

            $(params.next).css(from);

            Utils.animate(params.next, to, {
                duration: params.speed,
                complete: (function( elems ) {
                    return function() {
                        complete();
                        elems.css({
                            left: 0
                        });
                    };
                }( $( params.next ).add( params.prev ) )),
                queue: false,
                easing: easing
            });

            if (door) {
                params.rewind = !params.rewind;
            }

            if (params.prev) {

                from = { left: 0 };
                to = { left: distance * ( params.rewind ? 1 : -1 ) };

                if ( fade ) {
                    from.opacity = 1;
                    to.opacity = 0;
                }

                $(params.prev).css(from);
                Utils.animate(params.prev, to, {
                    duration: params.speed,
                    queue: false,
                    easing: easing,
                    complete: function() {
                        $(this).css('opacity', 0);
                    }
                });
            }
        };

        return {

            active: false,

            init: function( effect, params, complete ) {
                if ( _transitions.effects.hasOwnProperty( effect ) ) {
                    _transitions.effects[ effect ].call( this, params, complete );
                }
            },

            effects: {

                fade: function(params, complete) {
                    $(params.next).css({
                        opacity: 0,
                        left: 0
                    });
                    Utils.animate(params.next, {
                        opacity: 1
                    },{
                        duration: params.speed,
                        complete: complete
                    });
                    if (params.prev) {
                        $(params.prev).css('opacity',1).show();
                        Utils.animate(params.prev, {
                            opacity: 0
                        },{
                            duration: params.speed
                        });
                    }
                },

                flash: function(params, complete) {
                    $(params.next).css({
                        opacity: 0,
                        left: 0
                    });
                    if (params.prev) {
                        Utils.animate( params.prev, {
                            opacity: 0
                        },{
                            duration: params.speed/2,
                            complete: function() {
                                Utils.animate( params.next, {
                                    opacity:1
                                },{
                                    duration: params.speed,
                                    complete: complete
                                });
                            }
                        });
                    } else {
                        Utils.animate( params.next, {
                            opacity: 1
                        },{
                            duration: params.speed,
                            complete: complete
                        });
                    }
                },

                pulse: function(params, complete) {
                    if (params.prev) {
                        $(params.prev).hide();
                    }
                    $(params.next).css({
                        opacity: 0,
                        left: 0
                    }).show();
                    Utils.animate(params.next, {
                        opacity:1
                    },{
                        duration: params.speed,
                        complete: complete
                    });
                },

                slide: function(params, complete) {
                    _slide.apply( this, Utils.array( arguments ) );
                },

                fadeslide: function(params, complete) {
                    _slide.apply( this, Utils.array( arguments ).concat( [true] ) );
                },

                doorslide: function(params, complete) {
                    _slide.apply( this, Utils.array( arguments ).concat( [false, true] ) );
                }
            }
        };
    }());

_nativeFullscreen.listen();

/**
    The main Galleria class

    @class
    @constructor

    @example var gallery = new Galleria();

    @author http://aino.se

    @requires jQuery

*/

Galleria = function() {

    var self = this;

    // internal options
    this._options = {};

    // flag for controlling play/pause
    this._playing = false;

    // internal interval for slideshow
    this._playtime = 5000;

    // internal variable for the currently active image
    this._active = null;

    // the internal queue, arrayified
    this._queue = { length: 0 };

    // the internal data array
    this._data = [];

    // the internal dom collection
    this._dom = {};

    // the internal thumbnails array
    this._thumbnails = [];

    // the internal layers array
    this._layers = [];

    // internal init flag
    this._initialized = false;

    // internal firstrun flag
    this._firstrun = false;

    // global stagewidth/height
    this._stageWidth = 0;
    this._stageHeight = 0;

    // target holder
    this._target = undef;

    // bind hashes
    this._binds = [];

    // instance id
    this._id = parseInt(Math.random()*10000, 10);

    // add some elements
    var divs =  'container stage images image-nav image-nav-left image-nav-right ' +
                'info info-text info-title info-description ' +
                'thumbnails thumbnails-list thumbnails-container thumb-nav-left thumb-nav-right ' +
                'loader counter tooltip',
        spans = 'current total';

    $.each( divs.split(' '), function( i, elemId ) {
        self._dom[ elemId ] = Utils.create( 'galleria-' + elemId );
    });

    $.each( spans.split(' '), function( i, elemId ) {
        self._dom[ elemId ] = Utils.create( 'galleria-' + elemId, 'span' );
    });

    // the internal keyboard object
    // keeps reference of the keybinds and provides helper methods for binding keys
    var keyboard = this._keyboard = {

        keys : {
            'UP': 38,
            'DOWN': 40,
            'LEFT': 37,
            'RIGHT': 39,
            'RETURN': 13,
            'ESCAPE': 27,
            'BACKSPACE': 8,
            'SPACE': 32
        },

        map : {},

        bound: false,

        press: function(e) {
            var key = e.keyCode || e.which;
            if ( key in keyboard.map && typeof keyboard.map[key] === 'function' ) {
                keyboard.map[key].call(self, e);
            }
        },

        attach: function(map) {

            var key, up;

            for( key in map ) {
                if ( map.hasOwnProperty( key ) ) {
                    up = key.toUpperCase();
                    if ( up in keyboard.keys ) {
                        keyboard.map[ keyboard.keys[up] ] = map[key];
                    } else {
                        keyboard.map[ up ] = map[key];
                    }
                }
            }
            if ( !keyboard.bound ) {
                keyboard.bound = true;
                $doc.bind('keydown', keyboard.press);
            }
        },

        detach: function() {
            keyboard.bound = false;
            keyboard.map = {};
            $doc.unbind('keydown', keyboard.press);
        }
    };

    // internal controls for keeping track of active / inactive images
    var controls = this._controls = {

        0: undef,

        1: undef,

        active : 0,

        swap : function() {
            controls.active = controls.active ? 0 : 1;
        },

        getActive : function() {
            return controls[ controls.active ];
        },

        getNext : function() {
            return controls[ 1 - controls.active ];
        }
    };

    // internal carousel object
    var carousel = this._carousel = {

        // shortcuts
        next: self.$('thumb-nav-right'),
        prev: self.$('thumb-nav-left'),

        // cache the width
        width: 0,

        // track the current position
        current: 0,

        // cache max value
        max: 0,

        // save all hooks for each width in an array
        hooks: [],

        // update the carousel
        // you can run this method anytime, f.ex on window.resize
        update: function() {
            var w = 0,
                h = 0,
                hooks = [0];

            $.each( self._thumbnails, function( i, thumb ) {
                if ( thumb.ready ) {
                    w += thumb.outerWidth || $( thumb.container ).outerWidth( true );
                    hooks[ i+1 ] = w;
                    h = Math.max( h, thumb.outerHeight || $( thumb.container).outerHeight( true ) );
                }
            });

            self.$( 'thumbnails' ).css({
                width: w,
                height: h
            });

            carousel.max = w;
            carousel.hooks = hooks;
            carousel.width = self.$( 'thumbnails-list' ).width();
            carousel.setClasses();

            self.$( 'thumbnails-container' ).toggleClass( 'galleria-carousel', w > carousel.width );

            // one extra calculation
            carousel.width = self.$( 'thumbnails-list' ).width();

            // todo: fix so the carousel moves to the left
        },

        bindControls: function() {

            var i;

            carousel.next.bind( 'click', function(e) {
                e.preventDefault();

                if ( self._options.carouselSteps === 'auto' ) {

                    for ( i = carousel.current; i < carousel.hooks.length; i++ ) {
                        if ( carousel.hooks[i] - carousel.hooks[ carousel.current ] > carousel.width ) {
                            carousel.set(i - 2);
                            break;
                        }
                    }

                } else {
                    carousel.set( carousel.current + self._options.carouselSteps);
                }
            });

            carousel.prev.bind( 'click', function(e) {
                e.preventDefault();

                if ( self._options.carouselSteps === 'auto' ) {

                    for ( i = carousel.current; i >= 0; i-- ) {
                        if ( carousel.hooks[ carousel.current ] - carousel.hooks[i] > carousel.width ) {
                            carousel.set( i + 2 );
                            break;
                        } else if ( i === 0 ) {
                            carousel.set( 0 );
                            break;
                        }
                    }
                } else {
                    carousel.set( carousel.current - self._options.carouselSteps );
                }
            });
        },

        // calculate and set positions
        set: function( i ) {
            i = Math.max( i, 0 );
            while ( carousel.hooks[i - 1] + carousel.width >= carousel.max && i >= 0 ) {
                i--;
            }
            carousel.current = i;
            carousel.animate();
        },

        // get the last position
        getLast: function(i) {
            return ( i || carousel.current ) - 1;
        },

        // follow the active image
        follow: function(i) {

            //don't follow if position fits
            if ( i === 0 || i === carousel.hooks.length - 2 ) {
                carousel.set( i );
                return;
            }

            // calculate last position
            var last = carousel.current;
            while( carousel.hooks[last] - carousel.hooks[ carousel.current ] <
                   carousel.width && last <= carousel.hooks.length ) {
                last ++;
            }

            // set position
            if ( i - 1 < carousel.current ) {
                carousel.set( i - 1 );
            } else if ( i + 2 > last) {
                carousel.set( i - last + carousel.current + 2 );
            }
        },

        // helper for setting disabled classes
        setClasses: function() {
            carousel.prev.toggleClass( 'disabled', !carousel.current );
            carousel.next.toggleClass( 'disabled', carousel.hooks[ carousel.current ] + carousel.width >= carousel.max );
        },

        // the animation method
        animate: function(to) {
            carousel.setClasses();
            var num = carousel.hooks[ carousel.current ] * -1;

            if ( isNaN( num ) ) {
                return;
            }

            Utils.animate(self.get( 'thumbnails' ), {
                left: num
            },{
                duration: self._options.carouselSpeed,
                easing: self._options.easing,
                queue: false
            });
        }
    };

    // tooltip control
    // added in 1.2
    var tooltip = this._tooltip = {

        initialized : false,

        open: false,

        timer: 'tooltip' + self._id,

        swapTimer: 'swap' + self._id,

        init: function() {

            tooltip.initialized = true;

            var css = '.galleria-tooltip{padding:3px 8px;max-width:50%;background:#ffe;color:#000;z-index:3;position:absolute;font-size:11px;line-height:1.3;' +
                      'opacity:0;box-shadow:0 0 2px rgba(0,0,0,.4);-moz-box-shadow:0 0 2px rgba(0,0,0,.4);-webkit-box-shadow:0 0 2px rgba(0,0,0,.4);}';

            Utils.insertStyleTag( css, 'galleria-tooltip' );

            self.$( 'tooltip' ).css({
                opacity: 0.8,
                visibility: 'visible',
                display: 'none'
            });

        },

        // move handler
        move: function( e ) {
            var mouseX = self.getMousePosition(e).x,
                mouseY = self.getMousePosition(e).y,
                $elem = self.$( 'tooltip' ),
                x = mouseX,
                y = mouseY,
                height = $elem.outerHeight( true ) + 1,
                width = $elem.outerWidth( true ),
                limitY = height + 15;

            var maxX = self.$( 'container' ).width() - width - 2,
                maxY = self.$( 'container' ).height() - height - 2;

            if ( !isNaN(x) && !isNaN(y) ) {

                x += 10;
                y -= ( height+8 );

                x = Math.max( 0, Math.min( maxX, x ) );
                y = Math.max( 0, Math.min( maxY, y ) );

                if( mouseY < limitY ) {
                    y = limitY;
                }

                $elem.css({ left: x, top: y });
            }
        },

        // bind elements to the tooltip
        // you can bind multiple elementIDs using { elemID : function } or { elemID : string }
        // you can also bind single DOM elements using bind(elem, string)
        bind: function( elem, value ) {

            // todo: revise if alternative tooltip is needed for mobile devices
            if (Galleria.TOUCH) {
                return;
            }

            if (! tooltip.initialized ) {
                tooltip.init();
            }

            var mouseout = function() {
                self.$( 'container' ).unbind( 'mousemove', tooltip.move );
                self.clearTimer( tooltip.timer );

                self.$( 'tooltip' ).stop().animate({
                    opacity: 0
                }, 200, function() {

                    self.$( 'tooltip' ).hide();

                    self.addTimer( tooltip.swapTimer, function() {
                        tooltip.open = false;
                    }, 1000);
                });
            };

            var hover = function( elem, value) {

                tooltip.define( elem, value );

                $( elem ).hover(function() {

                    self.clearTimer( tooltip.swapTimer );
                    self.$('container').unbind( 'mousemove', tooltip.move ).bind( 'mousemove', tooltip.move ).trigger( 'mousemove' );
                    tooltip.show( elem );

                    self.addTimer( tooltip.timer, function() {
                        self.$( 'tooltip' ).stop().show().animate({
                            opacity: 1
                        });
                        tooltip.open = true;

                    }, tooltip.open ? 0 : 500);

                }, mouseout).click(mouseout);
            };

            if ( typeof value === 'string' ) {
                hover( ( elem in self._dom ? self.get( elem ) : elem ), value );
            } else {
                // asume elemID here
                $.each( elem, function( elemID, val ) {
                    hover( self.get(elemID), val );
                });
            }
        },

        show: function( elem ) {

            elem = $( elem in self._dom ? self.get(elem) : elem );

            var text = elem.data( 'tt' ),
                mouseup = function( e ) {

                    // attach a tiny settimeout to make sure the new tooltip is filled
                    window.setTimeout( (function( ev ) {
                        return function() {
                            tooltip.move( ev );
                        };
                    }( e )), 10);

                    elem.unbind( 'mouseup', mouseup );

                };

            text = typeof text === 'function' ? text() : text;

            if ( ! text ) {
                return;
            }

            self.$( 'tooltip' ).html( text.replace(/\s/, '&#160;') );

            // trigger mousemove on mouseup in case of click
            elem.bind( 'mouseup', mouseup );
        },

        define: function( elem, value ) {

            // we store functions, not strings
            if (typeof value !== 'function') {
                var s = value;
                value = function() {
                    return s;
                };
            }

            elem = $( elem in self._dom ? self.get(elem) : elem ).data('tt', value);

            tooltip.show( elem );

        }
    };

    // internal fullscreen control
    var fullscreen = this._fullscreen = {

        scrolled: 0,

        crop: undef,

        active: false,

        keymap: self._keyboard.map,

        parseCallback: function( callback, enter ) {

            return _transitions.active ? function() {
                if ( typeof callback == 'function' ) {
                    callback.call(self);
                }
                var active = self._controls.getActive(),
                    next = self._controls.getNext();

                self._scaleImage( next );
                self._scaleImage( active );

                if ( enter && self._options.trueFullscreen ) {
                    // Firefox bug, revise later
                    $( active.container ).add( next.container ).trigger( 'transitionend' );
                }

            } : callback;

        },

        enter: function( callback ) {

            callback = fullscreen.parseCallback( callback, true );

            if ( self._options.trueFullscreen && _nativeFullscreen.support ) {

                // do some stuff prior animation for wmoother transitions

                fullscreen.active = true;

                Utils.forceStyles( self.get('container'), {
                    width: '100%',
                    height: '100%'
                });

                self.rescale();

                if ( Galleria.MAC ) {
                    if ( Galleria.WEBKIT && !( Galleria.SAFARI && /version\/[1-5]/.test(NAV)) ) {
                        self.$('container').css('opacity', 0).addClass('fullscreen');
                        window.setTimeout(function() {
                            fullscreen.scale();
                            self.$('container').css('opacity', 1);
                        }, 50);
                    } else {
                        self.$('stage').css('opacity', 0);
                        window.setTimeout(function() {
                            fullscreen.scale();
                            self.$('stage').css('opacity', 1);
                        },4);
                    }
                } else {
                    self.$('container').addClass('fullscreen');
                }

                $win.resize( fullscreen.scale );

                _nativeFullscreen.enter( self, callback, self.get('container') );

            } else {

                fullscreen.scrolled = $win.scrollTop();
                window.scrollTo(0, 0);

                fullscreen._enter( callback );
            }

        },

        _enter: function( callback ) {

            fullscreen.active = true;

            if ( IFRAME ) {

                fullscreen.iframe = (function() {

                    var elem,
                        refer = doc.referrer,
                        test = doc.createElement('a'),
                        loc = window.location;

                    test.href = refer;

                    if( test.protocol != loc.protocol ||
                        test.hostname != loc.hostname ||
                        test.port != loc.port ) {
                            Galleria.raise('Parent fullscreen not available. Iframe protocol, domains and ports must match.');
                            return false;
                        }

                    fullscreen.pd = window.parent.document;

                    $( fullscreen.pd ).find('iframe').each(function() {
                        var idoc = this.contentDocument || this.contentWindow.document;
                        if ( idoc === doc ) {
                            elem = this;
                            return false;
                        }
                    });

                    return elem;
                }());

            }

            // hide the image until rescale is complete
            Utils.hide( self.getActiveImage() );

            if ( IFRAME && fullscreen.iframe ) {
                fullscreen.iframe.scrolled = $( window.parent ).scrollTop();
                window.parent.scrollTo(0, 0);
            }

            var data = self.getData(),
                options = self._options,
                inBrowser = !self._options.trueFullscreen || !_nativeFullscreen.support,
                htmlbody = {
                    height: '100%',
                    overflow: 'hidden',
                    margin:0,
                    padding:0
                };

            if (inBrowser) {

                self.$('container').addClass('fullscreen');

                // begin styleforce

                Utils.forceStyles(self.get('container'), {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10000
                });
                Utils.forceStyles( DOM().html, htmlbody );
                Utils.forceStyles( DOM().body, htmlbody );
            }

            if ( IFRAME && fullscreen.iframe ) {
                Utils.forceStyles( fullscreen.pd.documentElement, htmlbody );
                Utils.forceStyles( fullscreen.pd.body, htmlbody );
                Utils.forceStyles( fullscreen.iframe, $.extend( htmlbody, {
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    position: 'fixed',
                    zIndex: 10000,
                    border: 'none'
                }));
            }

            // temporarily attach some keys
            // save the old ones first in a cloned object
            fullscreen.keymap = $.extend({}, self._keyboard.map);

            self.attachKeyboard({
                escape: self.exitFullscreen,
                right: self.next,
                left: self.prev
            });

            // temporarily save the crop
            fullscreen.crop = options.imageCrop;

            // set fullscreen options
            if ( options.fullscreenCrop != undef ) {
                options.imageCrop = options.fullscreenCrop;
            }

            // swap to big image if it's different from the display image
            if ( data && data.big && data.image !== data.big ) {
                var big    = new Galleria.Picture(),
                    cached = big.isCached( data.big ),
                    index  = self.getIndex(),
                    thumb  = self._thumbnails[ index ];

                self.trigger( {
                    type: Galleria.LOADSTART,
                    cached: cached,
                    rewind: false,
                    index: index,
                    imageTarget: self.getActiveImage(),
                    thumbTarget: thumb,
                    galleriaData: data
                });

                big.load( data.big, function( big ) {
                    self._scaleImage( big, {
                        complete: function( big ) {
                            self.trigger({
                                type: Galleria.LOADFINISH,
                                cached: cached,
                                index: index,
                                rewind: false,
                                imageTarget: big.image,
                                thumbTarget: thumb
                            });
                            var image = self._controls.getActive().image;
                            if ( image ) {
                                $( image ).width( big.image.width ).height( big.image.height )
                                    .attr( 'style', $( big.image ).attr('style') )
                                    .attr( 'src', big.image.src );
                            }
                        }
                    });
                });
            }

            // init the first rescale and attach callbacks

            self.rescale(function() {

                self.addTimer(false, function() {
                    // show the image after 50 ms
                    if ( inBrowser ) {
                        Utils.show( self.getActiveImage() );
                    }

                    if (typeof callback === 'function') {
                        callback.call( self );
                    }

                }, 100);

                self.trigger( Galleria.FULLSCREEN_ENTER );
            });

            if ( !inBrowser ) {
                Utils.show( self.getActiveImage() );
            } else {
                $win.resize( fullscreen.scale );
            }

        },

        scale : function() {
            self.rescale();
        },

        exit: function( callback ) {

            callback = fullscreen.parseCallback( callback );

            if ( self._options.trueFullscreen && _nativeFullscreen.support ) {
                _nativeFullscreen.exit( callback );
            } else {
                fullscreen._exit( callback );
            }
        },

        _exit: function( callback ) {

            fullscreen.active = false;

            var inBrowser = !self._options.trueFullscreen || !_nativeFullscreen.support;

            self.$('container').removeClass( 'fullscreen' );

            if ( inBrowser ) {
                Utils.hide( self.getActiveImage() );

                // revert all styles
                Utils.revertStyles( self.get('container'), DOM().html, DOM().body );

                // scroll back
                window.scrollTo(0, fullscreen.scrolled);
            }

            if ( IFRAME && fullscreen.iframe ) {
                Utils.revertStyles( fullscreen.pd.documentElement, fullscreen.pd.body, fullscreen.iframe );
                if ( fullscreen.iframe.scrolled ) {
                    window.parent.scrollTo(0, fullscreen.iframe.scrolled );
                }
            }

            // detach all keyboard events and apply the old keymap
            self.detachKeyboard();
            self.attachKeyboard( fullscreen.keymap );

            // bring back cached options
            self._options.imageCrop = fullscreen.crop;

            // return to original image
            var big = self.getData().big,
                image = self._controls.getActive().image;

            if ( !self.getData().iframe && image && big && big == image.src ) {

                window.setTimeout(function(src) {
                    return function() {
                        image.src = src;
                    };
                }( self.getData().image ), 1 );

            }

            self.rescale(function() {
                self.addTimer(false, function() {

                    // show the image after 50 ms
                    if ( inBrowser ) {
                        Utils.show( self.getActiveImage() );
                    }

                    if ( typeof callback === 'function' ) {
                        callback.call( self );
                    }

                    $win.trigger( 'resize' );

                }, 50);
                self.trigger( Galleria.FULLSCREEN_EXIT );
            });

            $win.unbind('resize', fullscreen.scale);
        }
    };

    // the internal idle object for controlling idle states
    var idle = this._idle = {

        trunk: [],

        bound: false,

        active: false,

        add: function(elem, to, from, hide) {
            if (!elem) {
                return;
            }
            if (!idle.bound) {
                idle.addEvent();
            }
            elem = $(elem);

            if ( typeof from == 'boolean' ) {
                hide = from;
                from = {};
            }

            from = from || {};

            var extract = {},
                style;

            for ( style in to ) {
                if ( to.hasOwnProperty( style ) ) {
                    extract[ style ] = elem.css( style );
                }
            }

            elem.data('idle', {
                from: $.extend( extract, from ),
                to: to,
                complete: true,
                busy: false
            });

            if ( !hide ) {
                idle.addTimer();
            } else {
                elem.css( to );
            }
            idle.trunk.push(elem);
        },

        remove: function(elem) {

            elem = $(elem);

            $.each(idle.trunk, function(i, el) {
                if ( el && el.length && !el.not(elem).length ) {
                    elem.css( elem.data( 'idle' ).from );
                    idle.trunk.splice(i, 1);
                }
            });

            if (!idle.trunk.length) {
                idle.removeEvent();
                self.clearTimer( idle.timer );
            }
        },

        addEvent : function() {
            idle.bound = true;
            self.$('container').bind( 'mousemove click', idle.showAll );
            if ( self._options.idleMode == 'hover' ) {
                self.$('container').bind( 'mouseleave', idle.hide );
            }
        },

        removeEvent : function() {
            idle.bound = false;
            self.$('container').bind( 'mousemove click', idle.showAll );
            if ( self._options.idleMode == 'hover' ) {
                self.$('container').unbind( 'mouseleave', idle.hide );
            }
        },

        addTimer : function() {
            if( self._options.idleMode == 'hover' ) {
                return;
            }
            self.addTimer( 'idle', function() {
                idle.hide();
            }, self._options.idleTime );
        },

        hide : function() {

            if ( !self._options.idleMode || self.getIndex() === false || self.getData().iframe ) {
                return;
            }

            self.trigger( Galleria.IDLE_ENTER );

            var len = idle.trunk.length;

            $.each( idle.trunk, function(i, elem) {

                var data = elem.data('idle');

                if (! data) {
                    return;
                }

                elem.data('idle').complete = false;

                Utils.animate( elem, data.to, {
                    duration: self._options.idleSpeed,
                    complete: function() {
                        if ( i == len-1 ) {
                            idle.active = false;
                        }
                    }
                });
            });
        },

        showAll : function() {

            self.clearTimer( 'idle' );

            $.each( idle.trunk, function( i, elem ) {
                idle.show( elem );
            });
        },

        show: function(elem) {

            var data = elem.data('idle');

            if ( !idle.active || ( !data.busy && !data.complete ) ) {

                data.busy = true;

                self.trigger( Galleria.IDLE_EXIT );

                self.clearTimer( 'idle' );

                Utils.animate( elem, data.from, {
                    duration: self._options.idleSpeed/2,
                    complete: function() {
                        idle.active = true;
                        $(elem).data('idle').busy = false;
                        $(elem).data('idle').complete = true;
                    }
                });

            }
            idle.addTimer();
        }
    };

    // internal lightbox object
    // creates a predesigned lightbox for simple popups of images in galleria
    var lightbox = this._lightbox = {

        width : 0,

        height : 0,

        initialized : false,

        active : null,

        image : null,

        elems : {},

        keymap: false,

        init : function() {

            // trigger the event
            self.trigger( Galleria.LIGHTBOX_OPEN );

            if ( lightbox.initialized ) {
                return;
            }
            lightbox.initialized = true;

            // create some elements to work with
            var elems = 'overlay box content shadow title info close prevholder prev nextholder next counter image',
                el = {},
                op = self._options,
                css = '',
                abs = 'position:absolute;',
                prefix = 'lightbox-',
                cssMap = {
                    overlay:    'position:fixed;display:none;opacity:'+op.overlayOpacity+';filter:alpha(opacity='+(op.overlayOpacity*100)+
                                ');top:0;left:0;width:100%;height:100%;background:'+op.overlayBackground+';z-index:99990',
                    box:        'position:fixed;display:none;width:400px;height:400px;top:50%;left:50%;margin-top:-200px;margin-left:-200px;z-index:99991',
                    shadow:     abs+'background:#000;width:100%;height:100%;',
                    content:    abs+'background-color:#fff;top:10px;left:10px;right:10px;bottom:10px;overflow:hidden',
                    info:       abs+'bottom:10px;left:10px;right:10px;color:#444;font:11px/13px arial,sans-serif;height:13px',
                    close:      abs+'top:10px;right:10px;height:20px;width:20px;background:#fff;text-align:center;cursor:pointer;color:#444;font:16px/22px arial,sans-serif;z-index:99999',
                    image:      abs+'top:10px;left:10px;right:10px;bottom:30px;overflow:hidden;display:block;',
                    prevholder: abs+'width:50%;top:0;bottom:40px;cursor:pointer;',
                    nextholder: abs+'width:50%;top:0;bottom:40px;right:-1px;cursor:pointer;',
                    prev:       abs+'top:50%;margin-top:-20px;height:40px;width:30px;background:#fff;left:20px;display:none;text-align:center;color:#000;font:bold 16px/36px arial,sans-serif',
                    next:       abs+'top:50%;margin-top:-20px;height:40px;width:30px;background:#fff;right:20px;left:auto;display:none;font:bold 16px/36px arial,sans-serif;text-align:center;color:#000',
                    title:      'float:left',
                    counter:    'float:right;margin-left:8px;'
                },
                hover = function(elem) {
                    return elem.hover(
                        function() { $(this).css( 'color', '#bbb' ); },
                        function() { $(this).css( 'color', '#444' ); }
                    );
                },
                appends = {};

            // IE8 fix for IE's transparent background event "feature"
            if ( IE && IE > 7 ) {
                cssMap.nextholder += 'background:#000;filter:alpha(opacity=0);';
                cssMap.prevholder += 'background:#000;filter:alpha(opacity=0);';
            }

            // create and insert CSS
            $.each(cssMap, function( key, value ) {
                css += '.galleria-'+prefix+key+'{'+value+'}';
            });

            css += '.galleria-'+prefix+'box.iframe .galleria-'+prefix+'prevholder,'+
                   '.galleria-'+prefix+'box.iframe .galleria-'+prefix+'nextholder{'+
                   'width:100px;height:100px;top:50%;margin-top:-70px}';

            Utils.insertStyleTag( css, 'galleria-lightbox' );

            // create the elements
            $.each(elems.split(' '), function( i, elemId ) {
                self.addElement( 'lightbox-' + elemId );
                el[ elemId ] = lightbox.elems[ elemId ] = self.get( 'lightbox-' + elemId );
            });

            // initiate the image
            lightbox.image = new Galleria.Picture();

            // append the elements
            $.each({
                    box: 'shadow content close prevholder nextholder',
                    info: 'title counter',
                    content: 'info image',
                    prevholder: 'prev',
                    nextholder: 'next'
                }, function( key, val ) {
                    var arr = [];
                    $.each( val.split(' '), function( i, prop ) {
                        arr.push( prefix + prop );
                    });
                    appends[ prefix+key ] = arr;
            });

            self.append( appends );

            $( el.image ).append( lightbox.image.container );

            $( DOM().body ).append( el.overlay, el.box );

            Utils.optimizeTouch( el.box );

            // add the prev/next nav and bind some controls

            hover( $( el.close ).bind( 'click', lightbox.hide ).html('&#215;') );

            $.each( ['Prev','Next'], function(i, dir) {

                var $d = $( el[ dir.toLowerCase() ] ).html( /v/.test( dir ) ? '&#8249;&#160;' : '&#160;&#8250;' ),
                    $e = $( el[ dir.toLowerCase()+'holder'] );

                $e.bind( 'click', function() {
                    lightbox[ 'show' + dir ]();
                });

                // IE7 and touch devices will simply show the nav
                if ( IE < 8 || Galleria.TOUCH ) {
                    $d.show();
                    return;
                }

                $e.hover( function() {
                    $d.show();
                }, function(e) {
                    $d.stop().fadeOut( 200 );
                });

            });
            $( el.overlay ).bind( 'click', lightbox.hide );

            // the lightbox animation is slow on ipad
            if ( Galleria.IPAD ) {
                self._options.lightboxTransitionSpeed = 0;
            }

        },

        rescale: function(event) {

            // calculate
             var width = Math.min( $win.width()-40, lightbox.width ),
                height = Math.min( $win.height()-60, lightbox.height ),
                ratio = Math.min( width / lightbox.width, height / lightbox.height ),
                destWidth = Math.round( lightbox.width * ratio ) + 40,
                destHeight = Math.round( lightbox.height * ratio ) + 60,
                to = {
                    width: destWidth,
                    height: destHeight,
                    'margin-top': Math.ceil( destHeight / 2 ) *- 1,
                    'margin-left': Math.ceil( destWidth / 2 ) *- 1
                };

            // if rescale event, don't animate
            if ( event ) {
                $( lightbox.elems.box ).css( to );
            } else {
                $( lightbox.elems.box ).animate( to, {
                    duration: self._options.lightboxTransitionSpeed,
                    easing: self._options.easing,
                    complete: function() {
                        var image = lightbox.image,
                            speed = self._options.lightboxFadeSpeed;

                        self.trigger({
                            type: Galleria.LIGHTBOX_IMAGE,
                            imageTarget: image.image
                        });

                        $( image.container ).show();

                        $( image.image ).animate({ opacity: 1 }, speed);
                        Utils.show( lightbox.elems.info, speed );
                    }
                });
            }
        },

        hide: function() {

            // remove the image
            lightbox.image.image = null;

            $win.unbind('resize', lightbox.rescale);

            $( lightbox.elems.box ).hide();

            Utils.hide( lightbox.elems.info );

            self.detachKeyboard();
            self.attachKeyboard( lightbox.keymap );

            lightbox.keymap = false;

            Utils.hide( lightbox.elems.overlay, 200, function() {
                $( this ).hide().css( 'opacity', self._options.overlayOpacity );
                self.trigger( Galleria.LIGHTBOX_CLOSE );
            });
        },

        showNext: function() {
            lightbox.show( self.getNext( lightbox.active ) );
        },

        showPrev: function() {
            lightbox.show( self.getPrev( lightbox.active ) );
        },

        show: function(index) {

            lightbox.active = index = typeof index === 'number' ? index : self.getIndex() || 0;

            if ( !lightbox.initialized ) {
                lightbox.init();
            }

            // temporarily attach some keys
            // save the old ones first in a cloned object
            if ( !lightbox.keymap ) {

                lightbox.keymap = $.extend({}, self._keyboard.map);

                self.attachKeyboard({
                    escape: lightbox.hide,
                    right: lightbox.showNext,
                    left: lightbox.showPrev
                });
            }

            $win.unbind('resize', lightbox.rescale );

            var data = self.getData(index),
                total = self.getDataLength(),
                n = self.getNext( index ),
                ndata, p, i;

            Utils.hide( lightbox.elems.info );

            try {
                for ( i = self._options.preload; i > 0; i-- ) {
                    p = new Galleria.Picture();
                    ndata = self.getData( n );
                    p.preload( 'big' in ndata ? ndata.big : ndata.image );
                    n = self.getNext( n );
                }
            } catch(e) {}

            lightbox.image.isIframe = !!data.iframe;

            $(lightbox.elems.box).toggleClass( 'iframe', !!data.iframe );

            lightbox.image.load( data.iframe || data.big || data.image, function( image ) {

                if ( image.isIframe ) {

                    var cw = $(window).width(),
                        ch = $(window).height();

                    if ( self._options.maxVideoSize ) {
                        var r = Math.min( self._options.maxVideoSize/cw, self._options.maxVideoSize/ch );
                        if ( r < 1 ) {
                            cw *= r;
                            ch *= r;
                        }
                    }
                    lightbox.width = cw;
                    lightbox.height = ch;

                } else {
                    lightbox.width = image.original.width;
                    lightbox.height = image.original.height;
                }

                $( image.image ).css({
                    width: image.isIframe ? '100%' : '100.1%',
                    height: image.isIframe ? '100%' : '100.1%',
                    top: 0,
                    zIndex: 99998,
                    opacity: 0,
                    visibility: 'visible'
                });

                lightbox.elems.title.innerHTML = data.title || '';
                lightbox.elems.counter.innerHTML = (index + 1) + ' / ' + total;
                $win.resize( lightbox.rescale );
                lightbox.rescale();
            });

            $( lightbox.elems.overlay ).show().css( 'visibility', 'visible' );
            $( lightbox.elems.box ).show();
        }
    };

    // the internal timeouts object
    // provides helper methods for controlling timeouts

    var _timer = this._timer = {

        trunk: {},

        add: function( id, fn, delay, loop ) {
            id = id || new Date().getTime();
            loop = loop || false;
            this.clear( id );
            if ( loop ) {
                var old = fn;
                fn = function() {
                    old();
                    _timer.add( id, fn, delay );
                };
            }
            this.trunk[ id ] = window.setTimeout( fn, delay );
        },

        clear: function( id ) {

            var del = function( i ) {
                window.clearTimeout( this.trunk[ i ] );
                delete this.trunk[ i ];
            }, i;

            if ( !!id && id in this.trunk ) {
                del.call( this, id );

            } else if ( typeof id === 'undefined' ) {
                for ( i in this.trunk ) {
                    if ( this.trunk.hasOwnProperty( i ) ) {
                        del.call( this, i );
                    }
                }
            }
        }
    };

    return this;
};

// end Galleria constructor

Galleria.prototype = {

    // bring back the constructor reference

    constructor: Galleria,

    /**
        Use this function to initialize the gallery and start loading.
        Should only be called once per instance.

        @param {HTMLElement} target The target element
        @param {Object} options The gallery options

        @returns Instance
    */

    init: function( target, options ) {

        var self = this;

        options = _legacyOptions( options );

        // save the original ingredients
        this._original = {
            target: target,
            options: options,
            data: null
        };

        // save the target here
        this._target = this._dom.target = target.nodeName ? target : $( target ).get(0);

        // save the original content for destruction
        this._original.html = this._target.innerHTML;

        // push the instance
        _instances.push( this );

        // raise error if no target is detected
        if ( !this._target ) {
             Galleria.raise('Target not found', true);
             return;
        }

        // apply options
        this._options = {
            autoplay: false,
            carousel: true,
            carouselFollow: true, // legacy, deprecate at 1.3
            carouselSpeed: 400,
            carouselSteps: 'auto',
            clicknext: false,
            dailymotion: {
                foreground: '%23EEEEEE',
                highlight: '%235BCEC5',
                background: '%23222222',
                logo: 0,
                hideInfos: 1
            },
            dataConfig : function( elem ) { return {}; },
            dataSelector: 'img',
            dataSort: false,
            dataSource: this._target,
            debug: undef,
            dummy: undef, // 1.2.5
            easing: 'galleria',
            extend: function(options) {},
            fullscreenCrop: undef, // 1.2.5
            fullscreenDoubleTap: true, // 1.2.4 toggles fullscreen on double-tap for touch devices
            fullscreenTransition: undef, // 1.2.6
            height: 0,
            idleMode: true, // 1.2.4 toggles idleMode
            idleTime: 3000,
            idleSpeed: 200,
            imageCrop: false,
            imageMargin: 0,
            imagePan: false,
            imagePanSmoothness: 12,
            imagePosition: '50%',
            imageTimeout: undef, // 1.2.5
            initialTransition: undef, // 1.2.4, replaces transitionInitial
            keepSource: false,
            layerFollow: true, // 1.2.5
            lightbox: false, // 1.2.3
            lightboxFadeSpeed: 200,
            lightboxTransitionSpeed: 200,
            linkSourceImages: true,
            maxScaleRatio: undef,
            maxVideoSize: undef, // 1.2.9
            minScaleRatio: undef, // deprecated in 1.2.9
            overlayOpacity: 0.85,
            overlayBackground: '#0b0b0b',
            pauseOnInteraction: true,
            popupLinks: false,
            preload: 2,
            queue: true,
            responsive: true,
            show: 0,
            showInfo: true,
            showCounter: true,
            showImagenav: true,
            swipe: true, // 1.2.4
            thumbCrop: true,
            thumbEventType: 'click',
            thumbFit: true, // legacy, deprecate at 1.3
            thumbMargin: 0,
            thumbQuality: 'auto',
            thumbDisplayOrder: true, // 1.2.8
            thumbnails: true,
            touchTransition: undef, // 1.2.6
            transition: 'fade',
            transitionInitial: undef, // legacy, deprecate in 1.3. Use initialTransition instead.
            transitionSpeed: 400,
            trueFullscreen: true, // 1.2.7
            useCanvas: false, // 1.2.4
            vimeo: {
                title: 0,
                byline: 0,
                portrait: 0,
                color: 'aaaaaa'
            },
            wait: 5000, // 1.2.7
            width: 'auto',
            youtube: {
                modestbranding: 1,
                autohide: 1,
                color: 'white',
                hd: 1,
                rel: 0,
                showinfo: 0
            }
        };

        // legacy support for transitionInitial
        this._options.initialTransition = this._options.initialTransition || this._options.transitionInitial;

        // turn off debug
        if ( options && options.debug === false ) {
            DEBUG = false;
        }

        // set timeout
        if ( options && typeof options.imageTimeout === 'number' ) {
            TIMEOUT = options.imageTimeout;
        }

        // set dummy
        if ( options && typeof options.dummy === 'string' ) {
            DUMMY = options.dummy;
        }

        // hide all content
        $( this._target ).children().hide();

        // Warn for quirks mode
        if ( Galleria.QUIRK ) {
            Galleria.raise('Your page is in Quirks mode, Galleria may not render correctly. Please validate your HTML and add a correct doctype.');
        }

        // now we just have to wait for the theme...
        if ( typeof Galleria.theme === 'object' ) {
            this._init();
        } else {
            // push the instance into the pool and run it when the theme is ready
            _pool.push( this );
        }

        return this;
    },

    // this method should only be called once per instance
    // for manipulation of data, use the .load method

    _init: function() {

        var self = this,
            options = this._options;

        if ( this._initialized ) {
            Galleria.raise( 'Init failed: Gallery instance already initialized.' );
            return this;
        }

        this._initialized = true;

        if ( !Galleria.theme ) {
            Galleria.raise( 'Init failed: No theme found.', true );
            return this;
        }

        // merge the theme & caller options
        $.extend( true, options, Galleria.theme.defaults, this._original.options, Galleria.configure.options );

        // check for canvas support
        (function( can ) {

            if ( !( 'getContext' in can ) ) {
                can = null;
                return;
            }

            _canvas = _canvas || {
                elem: can,
                context: can.getContext( '2d' ),
                cache: {},
                length: 0
            };

        }( doc.createElement( 'canvas' ) ) );

        // bind the gallery to run when data is ready
        this.bind( Galleria.DATA, function() {

            // save the new data
            this._original.data = this._data;

            // lets show the counter here
            this.get('total').innerHTML = this.getDataLength();

            // cache the container
            var $container = this.$( 'container' );

            // set ratio if height is < 2
            if ( self._options.height < 2 ) {
                self._userRatio = self._ratio = self._options.height;
            }

            // the gallery is ready, let's just wait for the css
            var num = { width: 0, height: 0 };
            var testHeight = function() {
                return self.$( 'stage' ).height();
            };

            // check container and thumbnail height
            Utils.wait({
                until: function() {

                    // keep trying to get the value
                    num = self._getWH();
                    $container.width( num.width ).height( num.height );
                    return testHeight() && num.width && num.height > 50;

                },
                success: function() {

                    self._width = num.width;
                    self._height = num.height;
                    self._ratio = self._ratio || num.height/num.width;

                    // for some strange reason, webkit needs a single setTimeout to play ball
                    if ( Galleria.WEBKIT ) {
                        window.setTimeout( function() {
                            self._run();
                        }, 1);
                    } else {
                        self._run();
                    }
                },
                error: function() {

                    // Height was probably not set, raise hard errors

                    if ( testHeight() ) {
                        Galleria.raise('Could not extract sufficient width/height of the gallery container. Traced measures: width:' + num.width + 'px, height: ' + num.height + 'px.', true);
                    } else {
                        Galleria.raise('Could not extract a stage height from the CSS. Traced height: ' + testHeight() + 'px.', true);
                    }
                },
                timeout: typeof this._options.wait == 'number' ? this._options.wait : false
            });
        });

        // build the gallery frame
        this.append({
            'info-text' :
                ['info-title', 'info-description'],
            'info' :
                ['info-text'],
            'image-nav' :
                ['image-nav-right', 'image-nav-left'],
            'stage' :
                ['images', 'loader', 'counter', 'image-nav'],
            'thumbnails-list' :
                ['thumbnails'],
            'thumbnails-container' :
                ['thumb-nav-left', 'thumbnails-list', 'thumb-nav-right'],
            'container' :
                ['stage', 'thumbnails-container', 'info', 'tooltip']
        });

        Utils.hide( this.$( 'counter' ).append(
            this.get( 'current' ),
            doc.createTextNode(' / '),
            this.get( 'total' )
        ) );

        this.setCounter('&#8211;');

        Utils.hide( self.get('tooltip') );

        // add a notouch class on the container to prevent unwanted :hovers on touch devices
        this.$( 'container' ).addClass( Galleria.TOUCH ? 'touch' : 'notouch' );

        // add images to the controls
        $.each( new Array(2), function( i ) {

            // create a new Picture instance
            var image = new Galleria.Picture();

            // apply some styles, create & prepend overlay
            $( image.container ).css({
                position: 'absolute',
                top: 0,
                left: 0
            }).prepend( self._layers[i] = $( Utils.create('galleria-layer') ).css({
                position: 'absolute',
                top:0, left:0, right:0, bottom:0,
                zIndex:2
            })[0] );

            // append the image
            self.$( 'images' ).append( image.container );

            // reload the controls
            self._controls[i] = image;

        });

        // some forced generic styling
        this.$( 'images' ).css({
            position: 'relative',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        });

        this.$( 'thumbnails, thumbnails-list' ).css({
            overflow: 'hidden',
            position: 'relative'
        });

        // bind image navigation arrows
        this.$( 'image-nav-right, image-nav-left' ).bind( 'click', function(e) {

            // tune the clicknext option
            if ( options.clicknext ) {
                e.stopPropagation();
            }

            // pause if options is set
            if ( options.pauseOnInteraction ) {
                self.pause();
            }

            // navigate
            var fn = /right/.test( this.className ) ? 'next' : 'prev';
            self[ fn ]();

        });

        // hide controls if chosen to
        $.each( ['info','counter','image-nav'], function( i, el ) {
            if ( options[ 'show' + el.substr(0,1).toUpperCase() + el.substr(1).replace(/-/,'') ] === false ) {
                Utils.moveOut( self.get( el.toLowerCase() ) );
            }
        });

        // load up target content
        this.load();

        // now it's usually safe to remove the content
        // IE will never stop loading if we remove it, so let's keep it hidden for IE (it's usually fast enough anyway)
        if ( !options.keepSource && !IE ) {
            this._target.innerHTML = '';
        }

        // re-append the errors, if they happened before clearing
        if ( this.get( 'errors' ) ) {
            this.appendChild( 'target', 'errors' );
        }

        // append the gallery frame
        this.appendChild( 'target', 'container' );

        // parse the carousel on each thumb load
        if ( options.carousel ) {
            var count = 0,
                show = options.show;
            this.bind( Galleria.THUMBNAIL, function() {
                this.updateCarousel();
                if ( ++count == this.getDataLength() && typeof show == 'number' && show > 0 ) {
                    this._carousel.follow( show );
                }
            });
        }

        // bind window resize for responsiveness
        if ( options.responsive ) {
            $win.bind( 'resize', function() {
                if ( !self.isFullscreen() ) {
                    self.resize();
                }
            });
        }

        // bind swipe gesture
        if ( options.swipe ) {

            (function( images ) {

                var swipeStart = [0,0],
                    swipeStop = [0,0],
                    limitX = 30,
                    limitY = 100,
                    multi = false,
                    tid = 0,
                    data,
                    ev = {
                        start: 'touchstart',
                        move: 'touchmove',
                        stop: 'touchend'
                    },
                    getData = function(e) {
                        return e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                    },
                    moveHandler = function( e ) {

                        if ( e.originalEvent.touches && e.originalEvent.touches.length > 1 ) {
                            return;
                        }

                        data = getData( e );
                        swipeStop = [ data.pageX, data.pageY ];

                        if ( !swipeStart[0] ) {
                            swipeStart = swipeStop;
                        }

                        if ( Math.abs( swipeStart[0] - swipeStop[0] ) > 10 ) {
                            e.preventDefault();
                        }
                    },
                    upHandler = function( e ) {

                        images.unbind( ev.move, moveHandler );

                        // if multitouch (possibly zooming), abort
                        if ( ( e.originalEvent.touches && e.originalEvent.touches.length ) || multi ) {
                            multi = !multi;
                            return;
                        }

                        if ( Utils.timestamp() - tid < 1000 &&
                             Math.abs( swipeStart[0] - swipeStop[0] ) > limitX &&
                             Math.abs( swipeStart[1] - swipeStop[1] ) < limitY ) {

                            e.preventDefault();
                            self[ swipeStart[0] > swipeStop[0] ? 'next' : 'prev' ]();
                        }

                        swipeStart = swipeStop = [0,0];
                    };

                images.bind(ev.start, function(e) {

                    if ( e.originalEvent.touches && e.originalEvent.touches.length > 1 ) {
                        return;
                    }

                    data = getData(e);
                    tid = Utils.timestamp();
                    swipeStart = swipeStop = [ data.pageX, data.pageY ];
                    images.bind(ev.move, moveHandler ).one(ev.stop, upHandler);

                });

            }( self.$( 'images' ) ));

            // double-tap/click fullscreen toggle

            if ( options.fullscreenDoubleTap ) {

                this.$( 'stage' ).bind( 'touchstart', (function() {
                    var last, cx, cy, lx, ly, now,
                        getData = function(e) {
                            return e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                        };
                    return function(e) {
                        now = Galleria.utils.timestamp();
                        cx = getData(e).pageX;
                        cy = getData(e).pageY;
                        if ( ( now - last < 500 ) && ( cx - lx < 20) && ( cy - ly < 20) ) {
                            self.toggleFullscreen();
                            e.preventDefault();
                            self.$( 'stage' ).unbind( 'touchend', arguments.callee );
                            return;
                        }
                        last = now;
                        lx = cx;
                        ly = cy;
                    };
                }()));
            }

        }

        // optimize touch for container
        Utils.optimizeTouch( this.get( 'container' ) );

        // bind the ons
        $.each( Galleria.on.binds, function(i, bind) {
            // check if already bound
            if ( $.inArray( bind.hash, self._binds ) == -1 ) {
                self.bind( bind.type, bind.callback );
            }
        });

        return this;
    },

    addTimer : function() {
        this._timer.add.apply( this._timer, Utils.array( arguments ) );
        return this;
    },

    clearTimer : function() {
        this._timer.clear.apply( this._timer, Utils.array( arguments ) );
        return this;
    },

    // parse width & height from CSS or options

    _getWH : function() {

        var $container = this.$( 'container' ),
            $target = this.$( 'target' ),
            self = this,
            num = {},
            arr;

        $.each(['width', 'height'], function( i, m ) {

            // first check if options is set
            if ( self._options[ m ] && typeof self._options[ m ] === 'number') {
                num[ m ] = self._options[ m ];
            } else {

                arr = [
                    Utils.parseValue( $container.css( m ) ),         // the container css height
                    Utils.parseValue( $target.css( m ) ),            // the target css height
                    $container[ m ](),                               // the container jQuery method
                    $target[ m ]()                                   // the target jQuery method
                ];

                // if first time, include the min-width & min-height
                if ( !self[ '_'+m ] ) {
                    arr.splice(arr.length,
                        Utils.parseValue( $container.css( 'min-'+m ) ),
                        Utils.parseValue( $target.css( 'min-'+m ) )
                    );
                }

                // else extract the measures from different sources and grab the highest value
                num[ m ] = Math.max.apply( Math, arr );
            }
        });

        // allow setting a height ratio instead of exact value
        // useful when doing responsive galleries

        if ( self._userRatio ) {
            num.height = num.width * self._userRatio;
        }

        return num;
    },

    // Creates the thumbnails and carousel
    // can be used at any time, f.ex when the data object is manipulated
    // push is an optional argument with pushed images

    _createThumbnails : function( push ) {

        this.get( 'total' ).innerHTML = this.getDataLength();

        var src,
            thumb,
            data,
            special,

            $container,

            self = this,
            o = this._options,

            i = push ? this._data.length - push.length : 0,
            chunk = i,

            thumbchunk = [],
            loadindex = 0,

            gif = IE < 8 ? 'http://upload.wikimedia.org/wikipedia/commons/c/c0/Blank.gif' :
                           'data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D',

            // get previously active thumbnail, if exists
            active = (function() {
                var a = self.$('thumbnails').find('.active');
                if ( !a.length ) {
                    return false;
                }
                return a.find('img').attr('src');
            }()),

            // cache the thumbnail option
            optval = typeof o.thumbnails === 'string' ? o.thumbnails.toLowerCase() : null,

            // move some data into the instance
            // for some reason, jQuery cant handle css(property) when zooming in FF, breaking the gallery
            // so we resort to getComputedStyle for browsers who support it
            getStyle = function( prop ) {
                return doc.defaultView && doc.defaultView.getComputedStyle ?
                    doc.defaultView.getComputedStyle( thumb.container, null )[ prop ] :
                    $container.css( prop );
            },

            fake = function(image, index, container) {
                return function() {
                    $( container ).append( image );
                    self.trigger({
                        type: Galleria.THUMBNAIL,
                        thumbTarget: image,
                        index: index,
                        galleriaData: self.getData( index )
                    });
                };
            },

            onThumbEvent = function( e ) {

                // pause if option is set
                if ( o.pauseOnInteraction ) {
                    self.pause();
                }

                // extract the index from the data
                var index = $( e.currentTarget ).data( 'index' );
                if ( self.getIndex() !== index ) {
                    self.show( index );
                }

                e.preventDefault();
            },

            thumbComplete = function( thumb, callback ) {

                $( thumb.container ).css( 'visibility', 'visible' );
                self.trigger({
                    type: Galleria.THUMBNAIL,
                    thumbTarget: thumb.image,
                    index: thumb.data.order,
                    galleriaData: self.getData( thumb.data.order )
                });

                if ( typeof callback == 'function' ) {
                    callback.call( self, thumb );
                }
            },

            onThumbLoad = function( thumb, callback ) {

                // scale when ready
                thumb.scale({
                    width:    thumb.data.width,
                    height:   thumb.data.height,
                    crop:     o.thumbCrop,
                    margin:   o.thumbMargin,
                    canvas:   o.useCanvas,
                    complete: function( thumb ) {

                        // shrink thumbnails to fit
                        var top = ['left', 'top'],
                            arr = ['Width', 'Height'],
                            m,
                            css,
                            data = self.getData( thumb.index ),
                            special = data.thumb.split(':');

                        // calculate shrinked positions
                        $.each(arr, function( i, measure ) {
                            m = measure.toLowerCase();
                            if ( (o.thumbCrop !== true || o.thumbCrop === m ) && o.thumbFit ) {
                                css = {};
                                css[ m ] = thumb[ m ];
                                $( thumb.container ).css( css );
                                css = {};
                                css[ top[ i ] ] = 0;
                                $( thumb.image ).css( css );
                            }

                            // cache outer measures
                            thumb[ 'outer' + measure ] = $( thumb.container )[ 'outer' + measure ]( true );
                        });

                        // set high quality if downscale is moderate
                        Utils.toggleQuality( thumb.image,
                            o.thumbQuality === true ||
                            ( o.thumbQuality === 'auto' && thumb.original.width < thumb.width * 3 )
                        );

                        // get "special" thumbs from provider
                        if( data.iframe && special.length == 2 && special[0] in _video ) {

                            _video[ special[0] ].getThumb( special[1], (function(img) {
                                return function(src) {
                                    img.src = src;
                                    thumbComplete( thumb, callback );
                                };
                            }( thumb.image ) ));

                        } else if ( o.thumbDisplayOrder && !thumb.lazy ) {

                            $.each( thumbchunk, function( i, th ) {
                                if ( i === loadindex && th.ready && !th.displayed ) {

                                    loadindex++;
                                    th.displayed = true;

                                    thumbComplete( th, callback );

                                    return;
                                }
                            });
                        } else {
                            thumbComplete( thumb, callback );
                        }
                    }
                });
            };

        if ( !push ) {
            this._thumbnails = [];
            this.$( 'thumbnails' ).empty();
        }

        // loop through data and create thumbnails
        for( ; this._data[ i ]; i++ ) {

            data = this._data[ i ];

            // get source from thumb or image
            src = data.thumb || data.image;

            if ( ( o.thumbnails === true || optval == 'lazy' ) && ( data.thumb || data.image ) ) {

                // add a new Picture instance
                thumb = new Galleria.Picture(i);

                // save the index
                thumb.index = i;

                // flag displayed
                thumb.displayed = false;

                // flag lazy
                thumb.lazy = false;

                // flag video
                thumb.video = false;

                // append the thumbnail
                this.$( 'thumbnails' ).append( thumb.container );

                // cache the container
                $container = $( thumb.container );

                // hide it
                $container.css( 'visibility', 'hidden' );

                thumb.data = {
                    width  : Utils.parseValue( getStyle( 'width' ) ),
                    height : Utils.parseValue( getStyle( 'height' ) ),
                    order  : i,
                    src    : src
                };

                // grab & reset size for smoother thumbnail loads
                if ( o.thumbFit && o.thumbCrop !== true ) {
                    $container.css( { width: 'auto', height: 'auto' } );
                } else {
                    $container.css( { width: thumb.data.width, height: thumb.data.height } );
                }

                // load the thumbnail
                special = src.split(':');

                if ( special.length == 2 && special[0] in _video ) {

                    thumb.video = true;
                    thumb.ready = true;

                    thumb.load( gif, {
                        height: thumb.data.height,
                        width: thumb.data.height*1.25
                    }, onThumbLoad);

                } else if ( optval == 'lazy' ) {

                    $container.addClass( 'lazy' );

                    thumb.lazy = true;

                    thumb.load( gif, {
                        height: thumb.data.height,
                        width: thumb.data.width
                    });

                } else {
                    thumb.load( src, onThumbLoad );
                }

                // preload all images here
                if ( o.preload === 'all' ) {
                    thumb.preload( data.image );
                }

            // create empty spans if thumbnails is set to 'empty'
            } else if ( data.iframe || optval === 'empty' || optval === 'numbers' ) {

                thumb = {
                    container:  Utils.create( 'galleria-image' ),
                    image: Utils.create( 'img', 'span' ),
                    ready: true
                };

                // create numbered thumbnails
                if ( optval === 'numbers' ) {
                    $( thumb.image ).text( i + 1 );
                }

                if ( data.iframe ) {
                    $( thumb.image ).addClass( 'iframe' );
                }

                this.$( 'thumbnails' ).append( thumb.container );

                // we need to "fake" a loading delay before we append and trigger
                // 50+ should be enough

                window.setTimeout( ( fake )( thumb.image, i, thumb.container ), 50 + ( i*20 ) );

            // create null object to silent errors
            } else {
                thumb = {
                    container: null,
                    image: null
                };
            }

            // add events for thumbnails
            // you can control the event type using thumb_event_type
            // we'll add the same event to the source if it's kept

            $( thumb.container ).add( o.keepSource && o.linkSourceImages ? data.original : null )
                .data('index', i).bind( o.thumbEventType, onThumbEvent )
                .data('thumbload', onThumbLoad);

            if (active === src) {
                $( thumb.container ).addClass( 'active' );
            }

            this._thumbnails.push( thumb );
        }

        thumbchunk = this._thumbnails.slice( chunk );

        return this;
    },

    /**
        Lazy-loads thumbnails.
        You can call this method to load lazy thumbnails at run time

        @param {Array|Number} index Index or array of indexes of thumbnails to be loaded
        @param {Function} complete Callback that is called when all lazy thumbnails have been loaded

        @returns Instance
    */

    lazyLoad: function( index, complete ) {

        var arr = index.constructor == Array ? index : [ index ],
            self = this,
            thumbnails = this.$( 'thumbnails' ).children().filter(function() {
                return $(this).data('lazy-src');
            }),
            loaded = 0;

        $.each( arr, function(i, ind) {

            if ( ind > self._thumbnails.length - 1 ) {
                return;
            }

            var thumb = self._thumbnails[ ind ],
                data = thumb.data,
                special = data.src.split(':'),
                callback = function() {
                    if ( ++loaded == arr.length && typeof complete == 'function' ) {
                        complete.call( self );
                    }
                },
                thumbload = $( thumb.container ).data( 'thumbload' );
            if ( thumb.video ) {
                thumbload.call( self, thumb, callback );
            } else {
                thumb.load( data.src , function( thumb ) {
                    thumbload.call( self, thumb, callback );
                });
            }
        });

        return this;

    },

    /**
        Lazy-loads thumbnails in chunks.
        This method automatcally chops up the loading process of many thumbnails into chunks

        @param {Number} size Size of each chunk to be loaded
        @param {Number} [delay] Delay between each loads

        @returns Instance
    */

    lazyLoadChunks: function( size, delay ) {

        var len = this.getDataLength(),
            i = 0,
            n = 0,
            arr = [],
            temp = [],
            self = this;

        delay = delay || 0;

        for( ; i<len; i++ ) {
            temp.push(i);
            if ( ++n == size || i == len-1 ) {
                arr.push( temp );
                n = 0;
                temp = [];
            }
        }

        var init = function( wait ) {
            var a = arr.shift();
            if ( a ) {
                window.setTimeout(function() {
                    self.lazyLoad(a, function() {
                        init( true );
                    });
                }, ( delay && wait ) ? delay : 0 );
            }
        };

        init( false );

        return this;

    },

    // the internal _run method should be called after loading data into galleria
    // makes sure the gallery has proper measurements before postrun & ready
    _run : function() {

        var self = this;

        self._createThumbnails();

        // make sure we have a stageHeight && stageWidth

        Utils.wait({

            timeout: 10000,

            until: function() {

                // Opera crap
                if ( Galleria.OPERA ) {
                    self.$( 'stage' ).css( 'display', 'inline-block' );
                }

                self._stageWidth  = self.$( 'stage' ).width();
                self._stageHeight = self.$( 'stage' ).height();

                return( self._stageWidth &&
                        self._stageHeight > 50 ); // what is an acceptable height?
            },

            success: function() {

                // save the instance
                _galleries.push( self );

                // postrun some stuff after the gallery is ready

                // show counter
                Utils.show( self.get('counter') );

                // bind carousel nav
                if ( self._options.carousel ) {
                    self._carousel.bindControls();
                }

                // start autoplay
                if ( self._options.autoplay ) {

                    self.pause();

                    if ( typeof self._options.autoplay === 'number' ) {
                        self._playtime = self._options.autoplay;
                    }

                    self._playing = true;
                }
                // if second load, just do the show and return
                if ( self._firstrun ) {

                    if ( self._options.autoplay ) {
                        self.trigger( Galleria.PLAY );
                    }

                    if ( typeof self._options.show === 'number' ) {
                        self.show( self._options.show );
                    }
                    return;
                }

                self._firstrun = true;

                // initialize the History plugin
                if ( Galleria.History ) {

                    // bind the show method
                    Galleria.History.change(function( value ) {

                        // if ID is NaN, the user pressed back from the first image
                        // return to previous address
                        if ( isNaN( value ) ) {
                            window.history.go(-1);

                        // else show the image
                        } else {
                            self.show( value, undef, true );
                        }
                    });
                }

                self.trigger( Galleria.READY );

                // call the theme init method
                Galleria.theme.init.call( self, self._options );

                // Trigger Galleria.ready
                $.each( Galleria.ready.callbacks, function(i ,fn) {
                    if ( typeof fn == 'function' ) {
                        fn.call( self, self._options );
                    }
                });

                // call the extend option
                self._options.extend.call( self, self._options );

                // show the initial image
                // first test for permalinks in history
                if ( /^[0-9]{1,4}$/.test( HASH ) && Galleria.History ) {
                    self.show( HASH, undef, true );

                } else if( self._data[ self._options.show ] ) {
                    self.show( self._options.show );
                }

                // play trigger
                if ( self._options.autoplay ) {
                    self.trigger( Galleria.PLAY );
                }
            },

            error: function() {
                Galleria.raise('Stage width or height is too small to show the gallery. Traced measures: width:' + self._stageWidth + 'px, height: ' + self._stageHeight + 'px.', true);
            }

        });
    },

    /**
        Loads data into the gallery.
        You can call this method on an existing gallery to reload the gallery with new data.

        @param {Array|string} [source] Optional JSON array of data or selector of where to find data in the document.
        Defaults to the Galleria target or dataSource option.

        @param {string} [selector] Optional element selector of what elements to parse.
        Defaults to 'img'.

        @param {Function} [config] Optional function to modify the data extraction proceedure from the selector.
        See the dataConfig option for more information.

        @returns Instance
    */

    load : function( source, selector, config ) {

        var self = this,
            o = this._options;

        // empty the data array
        this._data = [];

        // empty the thumbnails
        this._thumbnails = [];
        this.$('thumbnails').empty();

        // shorten the arguments
        if ( typeof selector === 'function' ) {
            config = selector;
            selector = null;
        }

        // use the source set by target
        source = source || o.dataSource;

        // use selector set by option
        selector = selector || o.dataSelector;

        // use the dataConfig set by option
        config = config || o.dataConfig;

        // if source is a true object, make it into an array
        if( /^function Object/.test( source.constructor ) ) {
            source = [source];
        }

        // check if the data is an array already
        if ( source.constructor === Array ) {
            if ( this.validate( source ) ) {
                this._data = source;
            } else {
                Galleria.raise( 'Load failed: JSON Array not valid.' );
            }
        } else {

            // add .video and .iframe to the selector (1.2.7)
            selector += ',.video,.iframe';

            // loop through images and set data
            $( source ).find( selector ).each( function( i, elem ) {

                elem = $( elem );
                var data = {},
                    parent = elem.parent(),
                    href = parent.attr( 'href' ),
                    rel  = parent.attr( 'rel' );

                if( href && ( elem[0].nodeName == 'IMG' || elem.hasClass('video') ) && _videoTest( href ) ) {
                    data.video = href;
                } else if( href && elem.hasClass('iframe') ) {
                    data.iframe = href;
                } else {
                    data.image = data.big = href;
                }

                if ( rel ) {
                    data.big = rel;
                }

                // alternative extraction from HTML5 data attribute, added in 1.2.7
                $.each( 'big title description link layer'.split(' '), function( i, val ) {
                    if ( elem.data(val) ) {
                        data[ val ] = elem.data(val);
                    }
                });

                // mix default extractions with the hrefs and config
                // and push it into the data array
                self._data.push( $.extend({

                    title:       elem.attr('title') || '',
                    thumb:       elem.attr('src'),
                    image:       elem.attr('src'),
                    big:         elem.attr('src'),
                    description: elem.attr('alt') || '',
                    link:        elem.attr('longdesc'),
                    original:    elem.get(0) // saved as a reference

                }, data, config( elem ) ) );

            });
        }

        if ( typeof o.dataSort == 'function' ) {
            protoArray.sort.call( this._data, o.dataSort );
        } else if ( o.dataSort == 'random' ) {
            this._data.sort( function() {
                return Math.round(Math.random())-0.5;
            });
        }



        // trigger the DATA event and return
        if ( this.getDataLength() ) {
            this._parseData().trigger( Galleria.DATA );
        }
        return this;

    },

    // make sure the data works properly
    _parseData : function() {

        var self = this,
            current;

        $.each( this._data, function( i, data ) {

            current = self._data[ i ];

            // copy image as thumb if no thumb exists
            if ( 'thumb' in data === false ) {
                current.thumb = data.image;
            }
            // copy image as big image if no biggie exists
            if ( !'big' in data ) {
                current.big = data.image;
            }
            // parse video
            if ( 'video' in data ) {
                var result = _videoTest( data.video );

                if ( result ) {
                    current.iframe = _video[ result.provider ].embed( result.id ) + (function() {

                        // add options
                        if ( typeof self._options[ result.provider ] == 'object' ) {
                            var str = '?', arr = [];
                            $.each( self._options[ result.provider ], function( key, val ) {
                                arr.push( key + '=' + val );
                            });

                            // small youtube specifics, perhaps move to _video later
                            if ( result.provider == 'youtube' ) {
                                arr = ['wmode=opaque'].concat(arr);
                            }
                            return str + arr.join('&');
                        }
                        return '';
                    }());
                    delete current.video;
                    if( !('thumb' in current) || !current.thumb ) {
                        current.thumb = result.provider+':'+result.id;
                    }
                }
            }
        });

        return this;
    },

    /**
        Destroy the Galleria instance and recover the original content

        @example this.destroy();

        @returns Instance
    */

    destroy : function() {
        this.$( 'target' ).data( 'galleria', null );
        this.$( 'container' ).unbind( 'galleria' );
        this.get( 'target' ).innerHTML = this._original.html;
        this.clearTimer();
        Utils.removeFromArray( _instances, this );
        Utils.removeFromArray( _galleries, this );
        return this;
    },

    /**
        Adds and/or removes images from the gallery
        Works just like Array.splice
        https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/splice

        @example this.splice( 2, 4 ); // removes 4 images after the second image

        @returns Instance
    */

    splice : function() {
        var self = this,
            args = Utils.array( arguments );
        window.setTimeout(function() {
            protoArray.splice.apply( self._data, args );
            self._parseData()._createThumbnails();
        },2);
        return self;
    },

    /**
        Append images to the gallery
        Works just like Array.push
        https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/push

        @example this.push({ image: 'image1.jpg' }); // appends the image to the gallery

        @returns Instance
    */

    push : function() {
        var self = this,
            args = Utils.array( arguments );

        if ( args.length == 1 && args[0].constructor == Array ) {
            args = args[0];
        }

        window.setTimeout(function() {
            protoArray.push.apply( self._data, args );
            self._parseData()._createThumbnails( args );
        },2);
        return self;
    },

    _getActive: function() {
        return this._controls.getActive();
    },

    validate : function( data ) {
        // todo: validate a custom data array
        return true;
    },

    /**
        Bind any event to Galleria

        @param {string} type The Event type to listen for
        @param {Function} fn The function to execute when the event is triggered

        @example this.bind( 'image', function() { Galleria.log('image shown') });

        @returns Instance
    */

    bind : function(type, fn) {

        // allow 'image' instead of Galleria.IMAGE
        type = _patchEvent( type );

        this.$( 'container' ).bind( type, this.proxy(fn) );
        return this;
    },

    /**
        Unbind any event to Galleria

        @param {string} type The Event type to forget

        @returns Instance
    */

    unbind : function(type) {

        type = _patchEvent( type );

        this.$( 'container' ).unbind( type );
        return this;
    },

    /**
        Manually trigger a Galleria event

        @param {string} type The Event to trigger

        @returns Instance
    */

    trigger : function( type ) {

        type = typeof type === 'object' ?
            $.extend( type, { scope: this } ) :
            { type: _patchEvent( type ), scope: this };

        this.$( 'container' ).trigger( type );

        return this;
    },

    /**
        Assign an "idle state" to any element.
        The idle state will be applied after a certain amount of idle time
        Useful to hide f.ex navigation when the gallery is inactive

        @param {HTMLElement|string} elem The Dom node or selector to apply the idle state to
        @param {Object} styles the CSS styles to apply when in idle mode
        @param {Object} [from] the CSS styles to apply when in normal
        @param {Boolean} [hide] set to true if you want to hide it first

        @example addIdleState( this.get('image-nav'), { opacity: 0 });
        @example addIdleState( '.galleria-image-nav', { top: -200 }, true);

        @returns Instance
    */

    addIdleState: function( elem, styles, from, hide ) {
        this._idle.add.apply( this._idle, Utils.array( arguments ) );
        return this;
    },

    /**
        Removes any idle state previously set using addIdleState()

        @param {HTMLElement|string} elem The Dom node or selector to remove the idle state from.

        @returns Instance
    */

    removeIdleState: function( elem ) {
        this._idle.remove.apply( this._idle, Utils.array( arguments ) );
        return this;
    },

    /**
        Force Galleria to enter idle mode.

        @returns Instance
    */

    enterIdleMode: function() {
        this._idle.hide();
        return this;
    },

    /**
        Force Galleria to exit idle mode.

        @returns Instance
    */

    exitIdleMode: function() {
        this._idle.showAll();
        return this;
    },

    /**
        Enter FullScreen mode

        @param {Function} callback the function to be executed when the fullscreen mode is fully applied.

        @returns Instance
    */

    enterFullscreen: function( callback ) {
        this._fullscreen.enter.apply( this, Utils.array( arguments ) );
        return this;
    },

    /**
        Exits FullScreen mode

        @param {Function} callback the function to be executed when the fullscreen mode is fully applied.

        @returns Instance
    */

    exitFullscreen: function( callback ) {
        this._fullscreen.exit.apply( this, Utils.array( arguments ) );
        return this;
    },

    /**
        Toggle FullScreen mode

        @param {Function} callback the function to be executed when the fullscreen mode is fully applied or removed.

        @returns Instance
    */

    toggleFullscreen: function( callback ) {
        this._fullscreen[ this.isFullscreen() ? 'exit' : 'enter'].apply( this, Utils.array( arguments ) );
        return this;
    },

    /**
        Adds a tooltip to any element.
        You can also call this method with an object as argument with elemID:value pairs to apply tooltips to (see examples)

        @param {HTMLElement} elem The DOM Node to attach the event to
        @param {string|Function} value The tooltip message. Can also be a function that returns a string.

        @example this.bindTooltip( this.get('thumbnails'), 'My thumbnails');
        @example this.bindTooltip( this.get('thumbnails'), function() { return 'My thumbs' });
        @example this.bindTooltip( { image_nav: 'Navigation' });

        @returns Instance
    */

    bindTooltip: function( elem, value ) {
        this._tooltip.bind.apply( this._tooltip, Utils.array(arguments) );
        return this;
    },

    /**
        Note: this method is deprecated. Use refreshTooltip() instead.

        Redefine a tooltip.
        Use this if you want to re-apply a tooltip value to an already bound tooltip element.

        @param {HTMLElement} elem The DOM Node to attach the event to
        @param {string|Function} value The tooltip message. Can also be a function that returns a string.

        @returns Instance
    */

    defineTooltip: function( elem, value ) {
        this._tooltip.define.apply( this._tooltip, Utils.array(arguments) );
        return this;
    },

    /**
        Refresh a tooltip value.
        Use this if you want to change the tooltip value at runtime, f.ex if you have a play/pause toggle.

        @param {HTMLElement} elem The DOM Node that has a tooltip that should be refreshed

        @returns Instance
    */

    refreshTooltip: function( elem ) {
        this._tooltip.show.apply( this._tooltip, Utils.array(arguments) );
        return this;
    },

    /**
        Open a pre-designed lightbox with the currently active image.
        You can control some visuals using gallery options.

        @returns Instance
    */

    openLightbox: function() {
        this._lightbox.show.apply( this._lightbox, Utils.array( arguments ) );
        return this;
    },

    /**
        Close the lightbox.

        @returns Instance
    */

    closeLightbox: function() {
        this._lightbox.hide.apply( this._lightbox, Utils.array( arguments ) );
        return this;
    },

    /**
        Get the currently active image element.

        @returns {HTMLElement} The image element
    */

    getActiveImage: function() {
        return this._getActive().image || undef;
    },

    /**
        Get the currently active thumbnail element.

        @returns {HTMLElement} The thumbnail element
    */

    getActiveThumb: function() {
        return this._thumbnails[ this._active ].image || undef;
    },

    /**
        Get the mouse position relative to the gallery container

        @param e The mouse event

        @example

var gallery = this;
$(document).mousemove(function(e) {
    console.log( gallery.getMousePosition(e).x );
});

        @returns {Object} Object with x & y of the relative mouse postion
    */

    getMousePosition : function(e) {
        return {
            x: e.pageX - this.$( 'container' ).offset().left,
            y: e.pageY - this.$( 'container' ).offset().top
        };
    },

    /**
        Adds a panning effect to the image

        @param [img] The optional image element. If not specified it takes the currently active image

        @returns Instance
    */

    addPan : function( img ) {

        if ( this._options.imageCrop === false ) {
            return;
        }

        img = $( img || this.getActiveImage() );

        // define some variables and methods
        var self   = this,
            x      = img.width() / 2,
            y      = img.height() / 2,
            destX  = parseInt( img.css( 'left' ), 10 ),
            destY  = parseInt( img.css( 'top' ), 10 ),
            curX   = destX || 0,
            curY   = destY || 0,
            distX  = 0,
            distY  = 0,
            active = false,
            ts     = Utils.timestamp(),
            cache  = 0,
            move   = 0,

            // positions the image
            position = function( dist, cur, pos ) {
                if ( dist > 0 ) {
                    move = Math.round( Math.max( dist * -1, Math.min( 0, cur ) ) );
                    if ( cache !== move ) {

                        cache = move;

                        if ( IE === 8 ) { // scroll is faster for IE
                            img.parent()[ 'scroll' + pos ]( move * -1 );
                        } else {
                            var css = {};
                            css[ pos.toLowerCase() ] = move;
                            img.css(css);
                        }
                    }
                }
            },

            // calculates mouse position after 50ms
            calculate = function(e) {
                if (Utils.timestamp() - ts < 50) {
                    return;
                }
                active = true;
                x = self.getMousePosition(e).x;
                y = self.getMousePosition(e).y;
            },

            // the main loop to check
            loop = function(e) {

                if (!active) {
                    return;
                }

                distX = img.width() - self._stageWidth;
                distY = img.height() - self._stageHeight;
                destX = x / self._stageWidth * distX * -1;
                destY = y / self._stageHeight * distY * -1;
                curX += ( destX - curX ) / self._options.imagePanSmoothness;
                curY += ( destY - curY ) / self._options.imagePanSmoothness;

                position( distY, curY, 'Top' );
                position( distX, curX, 'Left' );

            };

        // we need to use scroll in IE8 to speed things up
        if ( IE === 8 ) {

            img.parent().scrollTop( curY * -1 ).scrollLeft( curX * -1 );
            img.css({
                top: 0,
                left: 0
            });

        }

        // unbind and bind event
        this.$( 'stage' ).unbind( 'mousemove', calculate ).bind( 'mousemove', calculate );

        // loop the loop
        this.addTimer( 'pan' + self._id, loop, 50, true);

        return this;
    },

    /**
        Brings the scope into any callback

        @param fn The callback to bring the scope into
        @param [scope] Optional scope to bring

        @example $('#fullscreen').click( this.proxy(function() { this.enterFullscreen(); }) )

        @returns {Function} Return the callback with the gallery scope
    */

    proxy : function( fn, scope ) {
        if ( typeof fn !== 'function' ) {
            return F;
        }
        scope = scope || this;
        return function() {
            return fn.apply( scope, Utils.array( arguments ) );
        };
    },

    /**
        Removes the panning effect set by addPan()

        @returns Instance
    */

    removePan: function() {

        // todo: doublecheck IE8

        this.$( 'stage' ).unbind( 'mousemove' );

        this.clearTimer( 'pan' + this._id );

        return this;
    },

    /**
        Adds an element to the Galleria DOM array.
        When you add an element here, you can access it using element ID in many API calls

        @param {string} id The element ID you wish to use. You can add many elements by adding more arguments.

        @example addElement('mybutton');
        @example addElement('mybutton','mylink');

        @returns Instance
    */

    addElement : function( id ) {

        var dom = this._dom;

        $.each( Utils.array(arguments), function( i, blueprint ) {
           dom[ blueprint ] = Utils.create( 'galleria-' + blueprint );
        });

        return this;
    },

    /**
        Attach keyboard events to Galleria

        @param {Object} map The map object of events.
        Possible keys are 'UP', 'DOWN', 'LEFT', 'RIGHT', 'RETURN', 'ESCAPE', 'BACKSPACE', and 'SPACE'.

        @example

this.attachKeyboard({
    right: this.next,
    left: this.prev,
    up: function() {
        console.log( 'up key pressed' )
    }
});

        @returns Instance
    */

    attachKeyboard : function( map ) {
        this._keyboard.attach.apply( this._keyboard, Utils.array( arguments ) );
        return this;
    },

    /**
        Detach all keyboard events to Galleria

        @returns Instance
    */

    detachKeyboard : function() {
        this._keyboard.detach.apply( this._keyboard, Utils.array( arguments ) );
        return this;
    },

    /**
        Fast helper for appending galleria elements that you added using addElement()

        @param {string} parentID The parent element ID where the element will be appended
        @param {string} childID the element ID that should be appended

        @example this.addElement('myElement');
        this.appendChild( 'info', 'myElement' );

        @returns Instance
    */

    appendChild : function( parentID, childID ) {
        this.$( parentID ).append( this.get( childID ) || childID );
        return this;
    },

    /**
        Fast helper for prepending galleria elements that you added using addElement()

        @param {string} parentID The parent element ID where the element will be prepended
        @param {string} childID the element ID that should be prepended

        @example

this.addElement('myElement');
this.prependChild( 'info', 'myElement' );

        @returns Instance
    */

    prependChild : function( parentID, childID ) {
        this.$( parentID ).prepend( this.get( childID ) || childID );
        return this;
    },

    /**
        Remove an element by blueprint

        @param {string} elemID The element to be removed.
        You can remove multiple elements by adding arguments.

        @returns Instance
    */

    remove : function( elemID ) {
        this.$( Utils.array( arguments ).join(',') ).remove();
        return this;
    },

    // a fast helper for building dom structures
    // leave this out of the API for now

    append : function( data ) {
        var i, j;
        for( i in data ) {
            if ( data.hasOwnProperty( i ) ) {
                if ( data[i].constructor === Array ) {
                    for( j = 0; data[i][j]; j++ ) {
                        this.appendChild( i, data[i][j] );
                    }
                } else {
                    this.appendChild( i, data[i] );
                }
            }
        }
        return this;
    },

    // an internal helper for scaling according to options
    _scaleImage : function( image, options ) {

        image = image || this._controls.getActive();

        // janpub (JH) fix:
        // image might be unselected yet
        // e.g. when external logics rescales the gallery on window resize events
        if( !image ) {
            return;
        }

        var self = this,

            complete,

            scaleLayer = function( img ) {
                $( img.container ).children(':first').css({
                    top: Math.max(0, Utils.parseValue( img.image.style.top )),
                    left: Math.max(0, Utils.parseValue( img.image.style.left )),
                    width: Utils.parseValue( img.image.width ),
                    height: Utils.parseValue( img.image.height )
                });
            };

        options = $.extend({
            width:       this._stageWidth,
            height:      this._stageHeight,
            crop:        this._options.imageCrop,
            max:         this._options.maxScaleRatio,
            min:         this._options.minScaleRatio,
            margin:      this._options.imageMargin,
            position:    this._options.imagePosition,
            iframelimit: this._options.maxVideoSize
        }, options );

        if ( this._options.layerFollow && this._options.imageCrop !== true ) {

            if ( typeof options.complete == 'function' ) {
                complete = options.complete;
                options.complete = function() {
                    complete.call( image, image );
                    scaleLayer( image );
                };
            } else {
                options.complete = scaleLayer;
            }

        } else {
            $( image.container ).children(':first').css({ top: 0, left: 0 });
        }

        image.scale( options );
        return this;
    },

    /**
        Updates the carousel,
        useful if you resize the gallery and want to re-check if the carousel nav is needed.

        @returns Instance
    */

    updateCarousel : function() {
        this._carousel.update();
        return this;
    },

    /**
        Resize the entire gallery container

        @param {Object} [measures] Optional object with width/height specified
        @param {Function} [complete] The callback to be called when the scaling is complete

        @returns Instance
    */

    resize : function( measures, complete ) {

        if ( typeof measures == 'function' ) {
            complete = measures;
            measures = undef;
        }

        measures = $.extend( { width:0, height:0 }, measures );

        var self = this,
            $container = this.$( 'container' );

        $.each( measures, function( m, val ) {
            if ( !val ) {
                $container[ m ]( 'auto' );
                measures[ m ] = self._getWH()[ m ];
            }
        });

        $.each( measures, function( m, val ) {
            $container[ m ]( val );
        });

        return this.rescale( complete );

    },

    /**
        Rescales the gallery

        @param {number} width The target width
        @param {number} height The target height
        @param {Function} complete The callback to be called when the scaling is complete

        @returns Instance
    */

    rescale : function( width, height, complete ) {

        var self = this;

        // allow rescale(fn)
        if ( typeof width === 'function' ) {
            complete = width;
            width = undef;
        }

        var scale = function() {

            // set stagewidth
            self._stageWidth = width || self.$( 'stage' ).width();
            self._stageHeight = height || self.$( 'stage' ).height();

            // scale the active image
            self._scaleImage();

            if ( self._options.carousel ) {
                self.updateCarousel();
            }

            self.trigger( Galleria.RESCALE );

            if ( typeof complete === 'function' ) {
                complete.call( self );
            }
        };

        scale.call( self );

        return this;
    },

    /**
        Refreshes the gallery.
        Useful if you change image options at runtime and want to apply the changes to the active image.

        @returns Instance
    */

    refreshImage : function() {
        this._scaleImage();
        if ( this._options.imagePan ) {
            this.addPan();
        }
        return this;
    },

    /**
        Shows an image by index

        @param {number|boolean} index The index to show
        @param {Boolean} rewind A boolean that should be true if you want the transition to go back

        @returns Instance
    */

    show : function( index, rewind, _history ) {

        // do nothing queue is long || index is false || queue is false and transition is in progress
        if ( this._queue.length > 3 || index === false || ( !this._options.queue && this._queue.stalled ) ) {
            return;
        }

        index = Math.max( 0, Math.min( parseInt( index, 10 ), this.getDataLength() - 1 ) );

        rewind = typeof rewind !== 'undefined' ? !!rewind : index < this.getIndex();

        _history = _history || false;

        // do the history thing and return
        if ( !_history && Galleria.History ) {
            Galleria.History.set( index.toString() );
            return;
        }

        this._active = index;

        protoArray.push.call( this._queue, {
            index : index,
            rewind : rewind
        });
        if ( !this._queue.stalled ) {
            this._show();
        }

        return this;
    },

    // the internal _show method does the actual showing
    _show : function() {

        // shortcuts
        var self = this,
            queue = this._queue[ 0 ],
            data = this.getData( queue.index );

        if ( !data ) {
            return;
        }

        var src = data.iframe || ( this.isFullscreen() && 'big' in data ? data.big : data.image ), // use big image if fullscreen mode
            active = this._controls.getActive(),
            next = this._controls.getNext(),
            cached = next.isCached( src ),
            thumb = this._thumbnails[ queue.index ],
            mousetrigger = function() {
                $( next.image ).trigger( 'mouseup' );
            };

        // to be fired when loading & transition is complete:
        var complete = (function( data, next, active, queue, thumb ) {

            return function() {

                var win;

                _transitions.active = false;

                // optimize quality
                Utils.toggleQuality( next.image, self._options.imageQuality );

                // remove old layer
                self._layers[ self._controls.active ].innerHTML = '';

                // swap
                $( active.container ).css({
                    zIndex: 0,
                    opacity: 0
                }).show();

                if( active.isIframe ) {
                    $( active.container ).find( 'iframe' ).remove();
                }

                self.$('container').toggleClass('iframe', !!data.iframe);

                $( next.container ).css({
                    zIndex: 1,
                    left: 0,
                    top: 0
                }).show();

                self._controls.swap();

                // add pan according to option
                if ( self._options.imagePan ) {
                    self.addPan( next.image );
                }

                // make the image link or add lightbox
                // link takes precedence over lightbox if both are detected
                if ( data.link || self._options.lightbox || self._options.clicknext ) {

                    $( next.image ).css({
                        cursor: 'pointer'
                    }).bind( 'mouseup', function( e ) {

                        // non-left click
                        if ( typeof e.which == 'number' && e.which > 1 ) {
                            return;
                        }

                        // clicknext
                        if ( self._options.clicknext && !Galleria.TOUCH ) {
                            if ( self._options.pauseOnInteraction ) {
                                self.pause();
                            }
                            self.next();
                            return;
                        }

                        // popup link
                        if ( data.link ) {
                            if ( self._options.popupLinks ) {
                                win = window.open( data.link, '_blank' );
                            } else {
                                window.location.href = data.link;
                            }
                            return;
                        }

                        if ( self._options.lightbox ) {
                            self.openLightbox();
                        }

                    });
                }

                // check if we are playing
                self._playCheck();

                // trigger IMAGE event
                self.trigger({
                    type: Galleria.IMAGE,
                    index: queue.index,
                    imageTarget: next.image,
                    thumbTarget: thumb.image,
                    galleriaData: data
                });

                // remove the queued image
                protoArray.shift.call( self._queue );

                // remove stalled
                self._queue.stalled = false;

                // if we still have images in the queue, show it
                if ( self._queue.length ) {
                    self._show();
                }

            };
        }( data, next, active, queue, thumb ));

        // let the carousel follow
        if ( this._options.carousel && this._options.carouselFollow ) {
            this._carousel.follow( queue.index );
        }

        // preload images
        if ( this._options.preload ) {

            var p, i,
                n = this.getNext(),
                ndata;

            try {
                for ( i = this._options.preload; i > 0; i-- ) {
                    p = new Galleria.Picture();
                    ndata = self.getData( n );
                    p.preload( this.isFullscreen() && 'big' in ndata ? ndata.big : ndata.image );
                    n = self.getNext( n );
                }
            } catch(e) {}
        }

        // show the next image, just in case
        Utils.show( next.container );

        next.isIframe = !!data.iframe;

        // add active classes
        $( self._thumbnails[ queue.index ].container )
            .addClass( 'active' )
            .siblings( '.active' )
            .removeClass( 'active' );

        // trigger the LOADSTART event
        self.trigger( {
            type: Galleria.LOADSTART,
            cached: cached,
            index: queue.index,
            rewind: queue.rewind,
            imageTarget: next.image,
            thumbTarget: thumb.image,
            galleriaData: data
        });

        // stall the queue
        self._queue.stalled = true;

        // begin loading the next image
        next.load( src, function( next ) {

            // add layer HTML
            var layer = $( self._layers[ 1-self._controls.active ] ).html( data.layer || '' ).hide();

            self._scaleImage( next, {

                complete: function( next ) {

                    // toggle low quality for IE
                    if ( 'image' in active ) {
                        Utils.toggleQuality( active.image, false );
                    }
                    Utils.toggleQuality( next.image, false );

                    // remove the image panning, if applied
                    // TODO: rethink if this is necessary
                    self.removePan();

                    // set the captions and counter
                    self.setInfo( queue.index );
                    self.setCounter( queue.index );

                    // show the layer now
                    if ( data.layer ) {
                        layer.show();
                        // inherit click events set on image
                        if ( data.link || self._options.lightbox || self._options.clicknext ) {
                            layer.css( 'cursor', 'pointer' ).unbind( 'mouseup' ).mouseup( mousetrigger );
                        }
                    }

                    var transition = self._options.transition;

                    // can JavaScript loop through objects in order? yes.
                    $.each({
                        initial: active.image === null,
                        touch: Galleria.TOUCH,
                        fullscreen: self.isFullscreen()
                    }, function( type, arg ) {
                        if ( arg && self._options[ type + 'Transition' ] !== undef ) {
                            transition = self._options[ type + 'Transition' ];
                            return false;
                        }
                    });

                    // validate the transition
                    if ( transition in _transitions.effects === false ) {
                        complete();
                    } else {
                        var params = {
                            prev: active.container,
                            next: next.container,
                            rewind: queue.rewind,
                            speed: self._options.transitionSpeed || 400
                        };

                        _transitions.active = true;

                        // call the transition function and send some stuff
                        _transitions.init.call( self, transition, params, complete );

                    }

                    // trigger the LOADFINISH event
                    self.trigger({
                        type: Galleria.LOADFINISH,
                        cached: cached,
                        index: queue.index,
                        rewind: queue.rewind,
                        imageTarget: next.image,
                        thumbTarget: self._thumbnails[ queue.index ].image,
                        galleriaData: self.getData( queue.index )
                    });


                }
            });
        });
    },

    /**
        Gets the next index

        @param {number} [base] Optional starting point

        @returns {number} the next index, or the first if you are at the first (looping)
    */

    getNext : function( base ) {
        base = typeof base === 'number' ? base : this.getIndex();
        return base === this.getDataLength() - 1 ? 0 : base + 1;
    },

    /**
        Gets the previous index

        @param {number} [base] Optional starting point

        @returns {number} the previous index, or the last if you are at the first (looping)
    */

    getPrev : function( base ) {
        base = typeof base === 'number' ? base : this.getIndex();
        return base === 0 ? this.getDataLength() - 1 : base - 1;
    },

    /**
        Shows the next image in line

        @returns Instance
    */

    next : function() {
        if ( this.getDataLength() > 1 ) {
            this.show( this.getNext(), false );
        }
        return this;
    },

    /**
        Shows the previous image in line

        @returns Instance
    */

    prev : function() {
        if ( this.getDataLength() > 1 ) {
            this.show( this.getPrev(), true );
        }
        return this;
    },

    /**
        Retrieve a DOM element by element ID

        @param {string} elemId The delement ID to fetch

        @returns {HTMLElement} The elements DOM node or null if not found.
    */

    get : function( elemId ) {
        return elemId in this._dom ? this._dom[ elemId ] : null;
    },

    /**
        Retrieve a data object

        @param {number} index The data index to retrieve.
        If no index specified it will take the currently active image

        @returns {Object} The data object
    */

    getData : function( index ) {
        return index in this._data ?
            this._data[ index ] : this._data[ this._active ];
    },

    /**
        Retrieve the number of data items

        @returns {number} The data length
    */
    getDataLength : function() {
        return this._data.length;
    },

    /**
        Retrieve the currently active index

        @returns {number|boolean} The active index or false if none found
    */

    getIndex : function() {
        return typeof this._active === 'number' ? this._active : false;
    },

    /**
        Retrieve the stage height

        @returns {number} The stage height
    */

    getStageHeight : function() {
        return this._stageHeight;
    },

    /**
        Retrieve the stage width

        @returns {number} The stage width
    */

    getStageWidth : function() {
        return this._stageWidth;
    },

    /**
        Retrieve the option

        @param {string} key The option key to retrieve. If no key specified it will return all options in an object.

        @returns option or options
    */

    getOptions : function( key ) {
        return typeof key === 'undefined' ? this._options : this._options[ key ];
    },

    /**
        Set options to the instance.
        You can set options using a key & value argument or a single object argument (see examples)

        @param {string} key The option key
        @param {string} value the the options value

        @example setOptions( 'autoplay', true )
        @example setOptions({ autoplay: true });

        @returns Instance
    */

    setOptions : function( key, value ) {
        if ( typeof key === 'object' ) {
            $.extend( this._options, key );
        } else {
            this._options[ key ] = value;
        }
        return this;
    },

    /**
        Starts playing the slideshow

        @param {number} delay Sets the slideshow interval in milliseconds.
        If you set it once, you can just call play() and get the same interval the next time.

        @returns Instance
    */

    play : function( delay ) {

        this._playing = true;

        this._playtime = delay || this._playtime;

        this._playCheck();

        this.trigger( Galleria.PLAY );

        return this;
    },

    /**
        Stops the slideshow if currently playing

        @returns Instance
    */

    pause : function() {

        this._playing = false;

        this.trigger( Galleria.PAUSE );

        return this;
    },

    /**
        Toggle between play and pause events.

        @param {number} delay Sets the slideshow interval in milliseconds.

        @returns Instance
    */

    playToggle : function( delay ) {
        return ( this._playing ) ? this.pause() : this.play( delay );
    },

    /**
        Checks if the gallery is currently playing

        @returns {Boolean}
    */

    isPlaying : function() {
        return this._playing;
    },

    /**
        Checks if the gallery is currently in fullscreen mode

        @returns {Boolean}
    */

    isFullscreen : function() {
        return this._fullscreen.active;
    },

    _playCheck : function() {
        var self = this,
            played = 0,
            interval = 20,
            now = Utils.timestamp(),
            timer_id = 'play' + this._id;

        if ( this._playing ) {

            this.clearTimer( timer_id );

            var fn = function() {

                played = Utils.timestamp() - now;
                if ( played >= self._playtime && self._playing ) {
                    self.clearTimer( timer_id );
                    self.next();
                    return;
                }
                if ( self._playing ) {

                    // trigger the PROGRESS event
                    self.trigger({
                        type:         Galleria.PROGRESS,
                        percent:      Math.ceil( played / self._playtime * 100 ),
                        seconds:      Math.floor( played / 1000 ),
                        milliseconds: played
                    });

                    self.addTimer( timer_id, fn, interval );
                }
            };
            self.addTimer( timer_id, fn, interval );
        }
    },

    /**
        Modify the slideshow delay

        @param {number} delay the number of milliseconds between slides,

        @returns Instance
    */

    setPlaytime: function( delay ) {
        this._playtime = delay;
        return this;
    },

    setIndex: function( val ) {
        this._active = val;
        return this;
    },

    /**
        Manually modify the counter

        @param {number} [index] Optional data index to fectch,
        if no index found it assumes the currently active index

        @returns Instance
    */

    setCounter: function( index ) {

        if ( typeof index === 'number' ) {
            index++;
        } else if ( typeof index === 'undefined' ) {
            index = this.getIndex()+1;
        }

        this.get( 'current' ).innerHTML = index;

        if ( IE ) { // weird IE bug

            var count = this.$( 'counter' ),
                opacity = count.css( 'opacity' );

            if ( parseInt( opacity, 10 ) === 1) {
                Utils.removeAlpha( count[0] );
            } else {
                this.$( 'counter' ).css( 'opacity', opacity );
            }

        }

        return this;
    },

    /**
        Manually set captions

        @param {number} [index] Optional data index to fectch and apply as caption,
        if no index found it assumes the currently active index

        @returns Instance
    */

    setInfo : function( index ) {

        var self = this,
            data = this.getData( index );

        $.each( ['title','description'], function( i, type ) {

            var elem = self.$( 'info-' + type );

            if ( !!data[type] ) {
                elem[ data[ type ].length ? 'show' : 'hide' ]().html( data[ type ] );
            } else {
               elem.empty().hide();
            }
        });

        return this;
    },

    /**
        Checks if the data contains any captions

        @param {number} [index] Optional data index to fectch,
        if no index found it assumes the currently active index.

        @returns {boolean}
    */

    hasInfo : function( index ) {

        var check = 'title description'.split(' '),
            i;

        for ( i = 0; check[i]; i++ ) {
            if ( !!this.getData( index )[ check[i] ] ) {
                return true;
            }
        }
        return false;

    },

    jQuery : function( str ) {

        var self = this,
            ret = [];

        $.each( str.split(','), function( i, elemId ) {
            elemId = $.trim( elemId );

            if ( self.get( elemId ) ) {
                ret.push( elemId );
            }
        });

        var jQ = $( self.get( ret.shift() ) );

        $.each( ret, function( i, elemId ) {
            jQ = jQ.add( self.get( elemId ) );
        });

        return jQ;

    },

    /**
        Converts element IDs into a jQuery collection
        You can call for multiple IDs separated with commas.

        @param {string} str One or more element IDs (comma-separated)

        @returns jQuery

        @example this.$('info,container').hide();
    */

    $ : function( str ) {
        return this.jQuery.apply( this, Utils.array( arguments ) );
    }

};

// End of Galleria prototype

// Add events as static variables
$.each( _events, function( i, ev ) {

    // legacy events
    var type = /_/.test( ev ) ? ev.replace( /_/g, '' ) : ev;

    Galleria[ ev.toUpperCase() ] = 'galleria.'+type;

} );

$.extend( Galleria, {

    // Browser helpers
    IE9:     IE === 9,
    IE8:     IE === 8,
    IE7:     IE === 7,
    IE6:     IE === 6,
    IE:      IE,
    WEBKIT:  /webkit/.test( NAV ),
    CHROME:  /chrome/.test( NAV ),
    SAFARI:  /safari/.test( NAV ) && !(/chrome/.test( NAV )),
    QUIRK:   ( IE && doc.compatMode && doc.compatMode === "BackCompat" ),
    MAC:     /mac/.test( navigator.platform.toLowerCase() ),
    OPERA:   !!window.opera,
    IPHONE:  /iphone/.test( NAV ),
    IPAD:    /ipad/.test( NAV ),
    ANDROID: /android/.test( NAV ),
    TOUCH:   ('ontouchstart' in doc)

});

// Galleria static methods

/**
    Adds a theme that you can use for your Gallery

    @param {Object} theme Object that should contain all your theme settings.
    <ul>
        <li>name - name of the theme</li>
        <li>author - name of the author</li>
        <li>css - css file name (not path)</li>
        <li>defaults - default options to apply, including theme-specific options</li>
        <li>init - the init function</li>
    </ul>

    @returns {Object} theme
*/

Galleria.addTheme = function( theme ) {

    // make sure we have a name
    if ( !theme.name ) {
        Galleria.raise('No theme name specified');
    }

    if ( typeof theme.defaults !== 'object' ) {
        theme.defaults = {};
    } else {
        theme.defaults = _legacyOptions( theme.defaults );
    }

    var css = false,
        reg;

    if ( typeof theme.css === 'string' ) {

        // look for manually added CSS
        $('link').each(function( i, link ) {
            reg = new RegExp( theme.css );
            if ( reg.test( link.href ) ) {

                // we found the css
                css = true;

                // the themeload trigger
                _themeLoad( theme );

                return false;
            }
        });

        // else look for the absolute path and load the CSS dynamic
        if ( !css ) {

            $('script').each(function( i, script ) {

                // look for the theme script
                reg = new RegExp( 'galleria\\.' + theme.name.toLowerCase() + '\\.' );
                if( reg.test( script.src )) {

                    // we have a match
                    css = script.src.replace(/[^\/]*$/, '') + theme.css;

                    window.setTimeout(function() {
                        Utils.loadCSS( css, 'galleria-theme', function() {

                            // the themeload trigger
                            _themeLoad( theme );

                        });
                    }, 1);

                }
            });
        }

        if ( !css ) {
            Galleria.raise('No theme CSS loaded');
        }
    } else {

        // pass
        _themeLoad( theme );
    }
    return theme;
};

/**
    loadTheme loads a theme js file and attaches a load event to Galleria

    @param {string} src The relative path to the theme source file

    @param {Object} [options] Optional options you want to apply

    @returns Galleria
*/

Galleria.loadTheme = function( src, options ) {

    // Don't load if theme is already loaded
    if( $('script').filter(function() { return $(this).attr('src') == src; }).length ) {
        return;
    }

    var loaded = false,
        err;

    // start listening for the timeout onload
    $( window ).load( function() {
        if ( !loaded ) {
            // give it another 20 seconds
            err = window.setTimeout(function() {
                if ( !loaded && !Galleria.theme ) {
                    Galleria.raise( "Galleria had problems loading theme at " + src + ". Please check theme path or load manually.", true );
                }
            }, 20000);
        }
    });

    // first clear the current theme, if exists
    Galleria.unloadTheme();

    // load the theme
    Utils.loadScript( src, function() {
        loaded = true;
        window.clearTimeout( err );
    });

    return Galleria;
};

/**
    unloadTheme unloads the Galleria theme and prepares for a new theme

    @returns Galleria
*/

Galleria.unloadTheme = function() {

    if ( typeof Galleria.theme == 'object' ) {

        $('script').each(function( i, script ) {

            if( new RegExp( 'galleria\\.' + Galleria.theme.name + '\\.' ).test( script.src ) ) {
                $( script ).remove();
            }
        });

        Galleria.theme = undef;
    }

    return Galleria;
};

/**
    Retrieves a Galleria instance.

    @param {number} [index] Optional index to retrieve.
    If no index is supplied, the method will return all instances in an array.

    @returns Instance or Array of instances
*/

Galleria.get = function( index ) {
    if ( !!_instances[ index ] ) {
        return _instances[ index ];
    } else if ( typeof index !== 'number' ) {
        return _instances;
    } else {
        Galleria.raise('Gallery index ' + index + ' not found');
    }
};

/**

    Configure Galleria options via a static function.
    The options will be applied to all instances

    @param {string|object} key The options to apply or a key

    @param [value] If key is a string, this is the value

    @returns Galleria

*/

Galleria.configure = function( key, value ) {

    var opts = {};

    if( typeof key == 'string' && value ) {
        opts[key] = value;
        key = opts;
    } else {
        $.extend( opts, key );
    }

    Galleria.configure.options = opts;

    $.each( Galleria.get(), function(i, instance) {
        instance.setOptions( opts );
    });

    return Galleria;
};

Galleria.configure.options = {};

/**

    Bind a Galleria event to the gallery

    @param {string} type A string representing the galleria event

    @param {function} callback The function that should run when the event is triggered

    @returns Galleria

*/

Galleria.on = function( type, callback ) {
    if ( !type ) {
        return;
    }

    callback = callback || F;

    // hash the bind
    var hash = type + callback.toString().replace(/\s/g,'') + Utils.timestamp();

    // for existing instances
    $.each( Galleria.get(), function(i, instance) {
        instance._binds.push( hash );
        instance.bind( type, callback );
    });

    // for future instances
    Galleria.on.binds.push({
        type: type,
        callback: callback,
        hash: hash
    });

    return Galleria;
};

Galleria.on.binds = [];

/**

    Run Galleria
    Alias for $(selector).galleria(options)

    @param {string} selector A selector of element(s) to intialize galleria to

    @param {object} options The options to apply

    @returns Galleria

*/

Galleria.run = function( selector, options ) {
    if ( $.isFunction( options ) ) {
        options = { extend: options };
    }
    $( selector || '#galleria' ).galleria( options );
    return Galleria;
};

/**
    Creates a transition to be used in your gallery

    @param {string} name The name of the transition that you will use as an option

    @param {Function} fn The function to be executed in the transition.
    The function contains two arguments, params and complete.
    Use the params Object to integrate the transition, and then call complete when you are done.

    @returns Galleria

*/

Galleria.addTransition = function( name, fn ) {
    _transitions.effects[name] = fn;
    return Galleria;
};

/**
    The Galleria utilites
*/

Galleria.utils = Utils;

/**
    A helper metod for cross-browser logging.
    It uses the console log if available otherwise it falls back to alert

    @example Galleria.log("hello", document.body, [1,2,3]);
*/

Galleria.log = function() {
    var args = Utils.array( arguments );
    if( 'console' in window && 'log' in window.console ) {
        try {
            return window.console.log.apply( window.console, args );
        } catch( e ) {
            $.each( args, function() {
                window.console.log(this);
            });
        }
    } else {
        return window.alert( args.join('<br>') );
    }
};

/**
    A ready method for adding callbacks when a gallery is ready
    Each method is call before the extend option for every instance

    @param {function} callback The function to call

    @returns Galleria
*/

Galleria.ready = function( fn ) {
    if ( typeof fn != 'function' ) {
        return Galleria;
    }
    $.each( _galleries, function( i, gallery ) {
        fn.call( gallery, gallery._options );
    });
    Galleria.ready.callbacks.push( fn );
    return Galleria;
};

Galleria.ready.callbacks = [];

/**
    Method for raising errors

    @param {string} msg The message to throw

    @param {boolean} [fatal] Set this to true to override debug settings and display a fatal error
*/

Galleria.raise = function( msg, fatal ) {

    var type = fatal ? 'Fatal error' : 'Error',

        self = this,

        css = {
            color: '#fff',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 100000
        },

        echo = function( msg ) {

            var html = '<div style="padding:4px;margin:0 0 2px;background:#' +
                ( fatal ? '811' : '222' ) + ';">' +
                ( fatal ? '<strong>' + type + ': </strong>' : '' ) +
                msg + '</div>';

            $.each( _instances, function() {

                var cont = this.$( 'errors' ),
                    target = this.$( 'target' );

                if ( !cont.length ) {

                    target.css( 'position', 'relative' );

                    cont = this.addElement( 'errors' ).appendChild( 'target', 'errors' ).$( 'errors' ).css(css);
                }
                cont.append( html );

            });

            if ( !_instances.length ) {
                $('<div>').css( $.extend( css, { position: 'fixed' } ) ).append( html ).appendTo( DOM().body );
            }
        };

    // if debug is on, display errors and throw exception if fatal
    if ( DEBUG ) {
        echo( msg );
        if ( fatal ) {
            throw new Error(type + ': ' + msg);
        }

    // else just echo a silent generic error if fatal
    } else if ( fatal ) {
        if ( _hasError ) {
            return;
        }
        _hasError = true;
        fatal = false;
        echo( 'Gallery could not load.' );
    }
};

// Add the version
Galleria.version = VERSION;

/**
    A method for checking what version of Galleria the user has installed and throws a readable error if the user needs to upgrade.
    Useful when building plugins that requires a certain version to function.

    @param {number} version The minimum version required

    @param {string} [msg] Optional message to display. If not specified, Galleria will throw a generic error.

    @returns Galleria
*/

Galleria.requires = function( version, msg ) {
    msg = msg || 'You need to upgrade Galleria to version ' + version + ' to use one or more components.';
    if ( Galleria.version < version ) {
        Galleria.raise(msg, true);
    }
    return Galleria;
};

/**
    Adds preload, cache, scale and crop functionality

    @constructor

    @requires jQuery

    @param {number} [id] Optional id to keep track of instances
*/

Galleria.Picture = function( id ) {

    // save the id
    this.id = id || null;

    // the image should be null until loaded
    this.image = null;

    // Create a new container
    this.container = Utils.create('galleria-image');

    // add container styles
    $( this.container ).css({
        overflow: 'hidden',
        position: 'relative' // for IE Standards mode
    });

    // saves the original measurements
    this.original = {
        width: 0,
        height: 0
    };

    // flag when the image is ready
    this.ready = false;

    // flag for iframe Picture
    this.isIframe = false;

};

Galleria.Picture.prototype = {

    // the inherited cache object
    cache: {},

    // show the image on stage
    show: function() {
        Utils.show( this.image );
    },

    // hide the image
    hide: function() {
        Utils.moveOut( this.image );
    },

    clear: function() {
        this.image = null;
    },

    /**
        Checks if an image is in cache

        @param {string} src The image source path, ex '/path/to/img.jpg'

        @returns {boolean}
    */

    isCached: function( src ) {
        return !!this.cache[src];
    },

    /**
        Preloads an image into the cache

        @param {string} src The image source path, ex '/path/to/img.jpg'

        @returns Galleria.Picture
    */

    preload: function( src ) {
        $( new Image() ).load((function(src, cache) {
            return function() {
                cache[ src ] = src;
            };
        }( src, this.cache ))).attr( 'src', src );
    },

    /**
        Loads an image and call the callback when ready.
        Will also add the image to cache.

        @param {string} src The image source path, ex '/path/to/img.jpg'
        @param {Object} [size] The forced size of the image, defined as an object { width: xx, height:xx }
        @param {Function} callback The function to be executed when the image is loaded & scaled

        @returns The image container (jQuery object)
    */

    load: function(src, size, callback) {

        if ( typeof size == 'function' ) {
            callback = size;
            size = null;
        }

        if( this.isIframe ) {
            var id = 'if'+new Date().getTime();

            this.image = $('<iframe>', {
                src: src,
                frameborder: 0,
                id: id,
                allowfullscreen: true,
                css: { visibility: 'hidden' }
            })[0];

            $( this.container ).find( 'iframe,img' ).remove();

            this.container.appendChild( this.image );

            $('#'+id).load( (function( self, callback ) {
                return function() {
                    window.setTimeout(function() {
                        $( self.image ).css( 'visibility', 'visible' );
                        if( typeof callback == 'function' ) {
                            callback.call( self, self );
                        }
                    }, 10);
                };
            }( this, callback )));

            return this.container;
        }

        this.image = new Image();

        // IE8 opacity inherit bug
        if ( Galleria.IE8 ) {
            $( this.image ).css( 'filter', 'inherit' );
        }

        var i = 0,
            reload = false,
            resort = false,

            // some jquery cache
            $container = $( this.container ),
            $image = $( this.image ),

            onerror = function() {
                if ( !reload ) {
                    reload = true;
                    // reload the image with a timestamp
                    window.setTimeout((function(image, src) {
                        return function() {
                            image.attr('src', src + '?' + Utils.timestamp() );
                        };
                    }( $(this), src )), 50);
                } else {
                    // apply the dummy image if it exists
                    if ( DUMMY ) {
                        $( this ).attr( 'src', DUMMY );
                    } else {
                        Galleria.raise('Image not found: ' + src);
                    }
                }
            },

            // the onload method
            onload = (function( self, callback, src ) {

                return function() {

                    var complete = function() {

                        $( this ).unbind( 'load' );

                        // save the original size
                        self.original = size || {
                            height: this.height,
                            width: this.width
                        };

                        self.container.appendChild( this );

                        self.cache[ src ] = src; // will override old cache

                        if (typeof callback == 'function' ) {
                            window.setTimeout(function() {
                                callback.call( self, self );
                            },1);
                        }
                    };

                    // Delay the callback to "fix" the Adblock Bug
                    // http://code.google.com/p/adblockforchrome/issues/detail?id=3701
                    if ( ( !this.width || !this.height ) ) {
                        window.setTimeout( (function( img ) {
                            return function() {
                                if ( img.width && img.height ) {
                                    complete.call( img );
                                } else {
                                    // last resort, this should never happen but just in case it does...
                                    if ( !resort ) {
                                        $(new Image()).load( onload ).attr( 'src', img.src );
                                        resort = true;
                                    } else {
                                        Galleria.raise('Could not extract width/height from image: ' + img.src +
                                            '. Traced measures: width:' + img.width + 'px, height: ' + img.height + 'px.');
                                    }
                                }
                            };
                        }( this )), 2);
                    } else {
                        complete.call( this );
                    }
                };
            }( this, callback, src ));

        // remove any previous images
        $container.find( 'iframe,img' ).remove();

        // append the image
        $image.css( 'display', 'block');

        // hide it for now
        Utils.hide( this.image );

        // remove any max/min scaling
        $.each('minWidth minHeight maxWidth maxHeight'.split(' '), function(i, prop) {
            $image.css(prop, (/min/.test(prop) ? '0' : 'none'));
        });

        // begin load and insert in cache when done
        $image.load( onload ).error( onerror ).attr( 'src', src );

        // return the container
        return this.container;
    },

    /**
        Scales and crops the image

        @param {Object} options The method takes an object with a number of options:

        <ul>
            <li>width - width of the container</li>
            <li>height - height of the container</li>
            <li>min - minimum scale ratio</li>
            <li>max - maximum scale ratio</li>
            <li>margin - distance in pixels from the image border to the container</li>
            <li>complete - a callback that fires when scaling is complete</li>
            <li>position - positions the image, works like the css background-image property.</li>
            <li>crop - defines how to crop. Can be true, false, 'width' or 'height'</li>
            <li>canvas - set to true to try a canvas-based rescale</li>
        </ul>

        @returns The image container object (jQuery)
    */

    scale: function( options ) {

        var self = this;

        // extend some defaults
        options = $.extend({
            width: 0,
            height: 0,
            min: undef,
            max: undef,
            margin: 0,
            complete: F,
            position: 'center',
            crop: false,
            canvas: false,
            iframelimit: undef
        }, options);

        if( this.isIframe ) {

            var cw = options.width, 
                ch = options.height,
                nw, nh;
            if ( options.iframelimit ) {
                var r = Math.min( options.iframelimit/cw, options.iframelimit/ch );
                if ( r < 1 ) {
                    nw = cw * r;
                    nh = ch * r;

                    $( this.image ).css({
                        top: ch/2-nh/2,
                        left: cw/2-nw/2,
                        position: 'absolute'
                    });
                } else {
                    $( this.image ).css({
                        top: 0,
                        left: 0
                    });
                }
            }
            $( this.image ).width( nw || cw ).height( nh || ch ).removeAttr( 'width' ).removeAttr( 'height' );
            $( this.container ).width( cw ).height( ch );
            options.complete.call(self, self);
            try {
                if( this.image.contentWindow ) {
                    $( this.image.contentWindow ).trigger('resize');
                }
            } catch(e) {}
            return this.container;

        }

        // return the element if no image found
        if (!this.image) {
            return this.container;
        }

        // store locale variables
        var width,
            height,
            $container = $( self.container ),
            data;

        // wait for the width/height
        Utils.wait({
            until: function() {
                width  = options.width ||
                         $container.width() ||
                         Utils.parseValue( $container.css('width') );

                height = options.height ||
                         $container.height() ||
                         Utils.parseValue( $container.css('height') );

                return width && height;
            },
            success: function() {

                // calculate some cropping
                var newWidth = ( width - options.margin * 2 ) / self.original.width,
                    newHeight = ( height - options.margin * 2 ) / self.original.height,
                    min = Math.min( newWidth, newHeight ),
                    max = Math.max( newWidth, newHeight ),
                    cropMap = {
                        'true'  : max,
                        'width' : newWidth,
                        'height': newHeight,
                        'false' : min,
                        'landscape': self.original.width > self.original.height ? max : min,
                        'portrait': self.original.width < self.original.height ? max : min
                    },
                    ratio = cropMap[ options.crop.toString() ],
                    canvasKey = '';

                // allow maxScaleRatio
                if ( options.max ) {
                    ratio = Math.min( options.max, ratio );
                }

                // allow minScaleRatio
                if ( options.min ) {
                    ratio = Math.max( options.min, ratio );
                }

                $.each( ['width','height'], function( i, m ) {
                    $( self.image )[ m ]( self[ m ] = self.image[ m ] = Math.round( self.original[ m ] * ratio ) );
                });

                $( self.container ).width( width ).height( height );

                if ( options.canvas && _canvas ) {

                    _canvas.elem.width = self.width;
                    _canvas.elem.height = self.height;

                    canvasKey = self.image.src + ':' + self.width + 'x' + self.height;

                    self.image.src = _canvas.cache[ canvasKey ] || (function( key ) {

                        _canvas.context.drawImage(self.image, 0, 0, self.original.width*ratio, self.original.height*ratio);

                        try {

                            data = _canvas.elem.toDataURL();
                            _canvas.length += data.length;
                            _canvas.cache[ key ] = data;
                            return data;

                        } catch( e ) {
                            return self.image.src;
                        }

                    }( canvasKey ) );

                }

                // calculate image_position
                var pos = {},
                    mix = {},
                    getPosition = function(value, measure, margin) {
                        var result = 0;
                        if (/\%/.test(value)) {
                            var flt = parseInt( value, 10 ) / 100,
                                m = self.image[ measure ] || $( self.image )[ measure ]();

                            result = Math.ceil( m * -1 * flt + margin * flt );
                        } else {
                            result = Utils.parseValue( value );
                        }
                        return result;
                    },
                    positionMap = {
                        'top': { top: 0 },
                        'left': { left: 0 },
                        'right': { left: '100%' },
                        'bottom': { top: '100%' }
                    };

                $.each( options.position.toLowerCase().split(' '), function( i, value ) {
                    if ( value === 'center' ) {
                        value = '50%';
                    }
                    pos[i ? 'top' : 'left'] = value;
                });

                $.each( pos, function( i, value ) {
                    if ( positionMap.hasOwnProperty( value ) ) {
                        $.extend( mix, positionMap[ value ] );
                    }
                });

                pos = pos.top ? $.extend( pos, mix ) : mix;

                pos = $.extend({
                    top: '50%',
                    left: '50%'
                }, pos);

                // apply position
                $( self.image ).css({
                    position : 'absolute',
                    top :  getPosition(pos.top, 'height', height),
                    left : getPosition(pos.left, 'width', width)
                });

                // show the image
                self.show();

                // flag ready and call the callback
                self.ready = true;
                options.complete.call( self, self );

            },
            error: function() {
                Galleria.raise('Could not scale image: '+self.image.src);
            },
            timeout: 1000
        });
        return this;
    }
};

// our own easings
$.extend( $.easing, {

    galleria: function (_, t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t*t + b;
        }
        return c/2*((t-=2)*t*t + 2) + b;
    },

    galleriaIn: function (_, t, b, c, d) {
        return c*(t/=d)*t + b;
    },

    galleriaOut: function (_, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    }

});

// the plugin initializer
$.fn.galleria = function( options ) {

    var selector = this.selector;

    // try domReady if element not found
    if ( !$(this).length ) {

        $(function() {
            if ( $( selector ).length ) {

                // if found on domReady, go ahead
                $( selector ).galleria( options );

            } else {

                // if not, try fetching the element for 5 secs, then raise a warning.
                Galleria.utils.wait({
                    until: function() {
                        return $( selector ).length;
                    },
                    success: function() {
                        $( selector ).galleria( options );
                    },
                    error: function() {
                        Galleria.raise('Init failed: Galleria could not find the element "'+selector+'".');
                    },
                    timeout: 5000
                });

            }
        });
        return this;
    }

    return this.each(function() {

        // destroy previous instance and prepare for new load
        if ( $.data(this, 'galleria') ) {
            $.data( this, 'galleria' ).destroy();
            $( this ).find( '*' ).hide();
        }

        // load the new gallery
        $.data( this, 'galleria', new Galleria().init( this, options ) );
    });

};

// phew

}( jQuery ) );
/**
 * Galleria Classic Theme 2012-08-08
 * http://galleria.io
 *
 * Licensed under the MIT license
 * https://raw.github.com/aino/galleria/master/LICENSE
 *
 */


(function($) {

/*global jQuery, Galleria */

Galleria.addTheme({
    name: 'classic',
    author: 'Galleria',
    //we have already loaded css
   // css: 'galleria.classic.css',
     css: false,
    defaults: {
        transition: 'slide',
        thumbCrop:  'height',

        // set this to false if you want to show the caption all the time:
        _toggleInfo: true
    },
    init: function(options) {

        Galleria.requires(1.28, 'This version of Classic theme requires Galleria 1.2.8 or later');

        // add some elements
        this.addElement('info-link','info-close');
        this.append({
            'info' : ['info-link','info-close']
        });

        // cache some stuff
        var info = this.$('info-link,info-close,info-text'),
            touch = Galleria.TOUCH,
            click = touch ? 'touchstart' : 'click';

        // show loader & counter with opacity
        this.$('loader,counter').show().css('opacity', 0.4);

        // some stuff for non-touch browsers
        if (! touch ) {
            this.addIdleState( this.get('image-nav-left'), { left:-50 });
            this.addIdleState( this.get('image-nav-right'), { right:-50 });
            this.addIdleState( this.get('counter'), { opacity:0 });
        }

        // toggle info
        if ( options._toggleInfo === true ) {
            info.bind( click, function() {
                info.toggle();
            });
        } else {
            info.show();
            this.$('info-link, info-close').hide();
        }

        // bind some stuff
        this.bind('thumbnail', function(e) {

            if (! touch ) {
                // fade thumbnails
                $(e.thumbTarget).css('opacity', 0.6).parent().hover(function() {
                    $(this).not('.active').children().stop().fadeTo(100, 1);
                }, function() {
                    $(this).not('.active').children().stop().fadeTo(400, 0.6);
                });

                if ( e.index === this.getIndex() ) {
                    $(e.thumbTarget).css('opacity',1);
                }
            } else {
                $(e.thumbTarget).css('opacity', this.getIndex() ? 1 : 0.6);
            }
        });

        this.bind('loadstart', function(e) {
            if (!e.cached) {
                this.$('loader').show().fadeTo(200, 0.4);
            }

            this.$('info').toggle( this.hasInfo() );

            $(e.thumbTarget).css('opacity',1).parent().siblings().children().css('opacity', 0.6);
        });

        this.bind('loadfinish', function(e) {
            this.$('loader').fadeOut(200);
        });
    }
});

}(jQuery));
(function() {
  var Gmaps;

  Gmaps = {};

  Gmaps.triggerOldOnload = function() {
    if (typeof Gmaps.oldOnload === 'function') {
      return Gmaps.oldOnload();
    }
  };

  Gmaps.loadMaps = function() {
    var key, load_function_name, searchLoadIncluded, value, _results;

    _results = [];
    for (key in Gmaps) {
      value = Gmaps[key];
      searchLoadIncluded = key.search(/load/);
      if (searchLoadIncluded === -1) {
        load_function_name = "load_" + key;
        _results.push(Gmaps[load_function_name]());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  window.Gmaps = Gmaps;

  this.Gmaps4Rails = (function() {
    function Gmaps4Rails() {
      this.map = null;
      this.serviceObject = null;
      this.visibleInfoWindow = null;
      this.userLocation = null;
      this.geolocationSuccess = function() {
        return false;
      };
      this.geolocationFailure = function() {
        return false;
      };
      this.callback = function() {
        return false;
      };
      this.customClusterer = function() {
        return false;
      };
      this.infobox = function() {
        return false;
      };
      this.jsTemplate = false;
      this.default_map_options = {
        id: 'map',
        draggable: true,
        detect_location: false,
        center_on_user: false,
        center_latitude: 0,
        center_longitude: 0,
        zoom: 7,
        maxZoom: null,
        minZoom: null,
        auto_adjust: true,
        auto_zoom: true,
        bounds: [],
        raw: {}
      };
      this.default_markers_conf = {
        title: "",
        picture: "",
        width: 22,
        length: 32,
        draggable: false,
        do_clustering: false,
        randomize: false,
        max_random_distance: 100,
        list_container: null,
        offset: 0,
        raw: {}
      };
      this.markers = [];
      this.boundsObject = null;
      this.polygons = [];
      this.polylines = [];
      this.circles = [];
      this.markerClusterer = null;
      this.markerImages = [];
      this.polylines_conf = {
        strokeColor: "#FF0000",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        zIndex: null
      };
    }

    Gmaps4Rails.prototype.initialize = function() {
      this.serviceObject = this.createMap();
      this.map = this.serviceObject;
      if (this.map_options.detect_location === true || this.map_options.center_on_user === true) {
        this.findUserLocation(this);
      }
      return this.resetSidebarContent();
    };

    Gmaps4Rails.prototype.findUserLocation = function(map_object) {
      var positionFailure, positionSuccessful;

      if (navigator.geolocation) {
        positionSuccessful = function(position) {
          map_object.userLocation = map_object.createLatLng(position.coords.latitude, position.coords.longitude);
          if (map_object.map_options.center_on_user === true) {
            map_object.centerMapOnUser();
          }
          return map_object.geolocationSuccess();
        };
        positionFailure = function() {
          return map_object.geolocationFailure(true);
        };
        return navigator.geolocation.getCurrentPosition(positionSuccessful, positionFailure);
      } else {
        return map_object.geolocationFailure(false);
      }
    };

    Gmaps4Rails.prototype.create_direction = function() {
      var directionsDisplay, directionsService, request;

      directionsDisplay = new google.maps.DirectionsRenderer();
      directionsService = new google.maps.DirectionsService();
      directionsDisplay.setMap(this.serviceObject);
      if (this.direction_conf.display_panel) {
        directionsDisplay.setPanel(document.getElementById(this.direction_conf.panel_id));
      }
      directionsDisplay.setOptions({
        suppressMarkers: false,
        suppressInfoWindows: false,
        suppressPolylines: false
      });
      request = {
        origin: this.direction_conf.origin,
        destination: this.direction_conf.destination,
        waypoints: this.direction_conf.waypoints,
        optimizeWaypoints: this.direction_conf.optimizeWaypoints,
        unitSystem: google.maps.DirectionsUnitSystem[this.direction_conf.unitSystem],
        avoidHighways: this.direction_conf.avoidHighways,
        avoidTolls: this.direction_conf.avoidTolls,
        region: this.direction_conf.region,
        travelMode: google.maps.DirectionsTravelMode[this.direction_conf.travelMode],
        language: "en"
      };
      return directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          return directionsDisplay.setDirections(response);
        }
      });
    };

    Gmaps4Rails.prototype.create_circles = function() {
      var circle, _i, _len, _ref, _results;

      _ref = this.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        _results.push(this.create_circle(circle));
      }
      return _results;
    };

    Gmaps4Rails.prototype.create_circle = function(circle) {
      var newCircle;

      if (circle === this.circles[0]) {
        if (circle.strokeColor != null) {
          this.circles_conf.strokeColor = circle.strokeColor;
        }
        if (circle.strokeOpacity != null) {
          this.circles_conf.strokeOpacity = circle.strokeOpacity;
        }
        if (circle.strokeWeight != null) {
          this.circles_conf.strokeWeight = circle.strokeWeight;
        }
        if (circle.fillColor != null) {
          this.circles_conf.fillColor = circle.fillColor;
        }
        if (circle.fillOpacity != null) {
          this.circles_conf.fillOpacity = circle.fillOpacity;
        }
      }
      if ((circle.lat != null) && (circle.lng != null)) {
        newCircle = new google.maps.Circle({
          center: this.createLatLng(circle.lat, circle.lng),
          strokeColor: circle.strokeColor || this.circles_conf.strokeColor,
          strokeOpacity: circle.strokeOpacity || this.circles_conf.strokeOpacity,
          strokeWeight: circle.strokeWeight || this.circles_conf.strokeWeight,
          fillOpacity: circle.fillOpacity || this.circles_conf.fillOpacity,
          fillColor: circle.fillColor || this.circles_conf.fillColor,
          clickable: circle.clickable || this.circles_conf.clickable,
          zIndex: circle.zIndex || this.circles_conf.zIndex,
          radius: circle.radius
        });
        circle.serviceObject = newCircle;
        return newCircle.setMap(this.serviceObject);
      }
    };

    Gmaps4Rails.prototype.clear_circles = function() {
      var circle, _i, _len, _ref, _results;

      _ref = this.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        _results.push(this.clear_circle(circle));
      }
      return _results;
    };

    Gmaps4Rails.prototype.clear_circle = function(circle) {
      return circle.serviceObject.setMap(null);
    };

    Gmaps4Rails.prototype.hide_circles = function() {
      var circle, _i, _len, _ref, _results;

      _ref = this.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        _results.push(this.hide_circle(circle));
      }
      return _results;
    };

    Gmaps4Rails.prototype.hide_circle = function(circle) {
      return circle.serviceObject.setMap(null);
    };

    Gmaps4Rails.prototype.show_circles = function() {
      var circle, _i, _len, _ref, _results;

      _ref = this.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        _results.push(this.show_circle(this.circle));
      }
      return _results;
    };

    Gmaps4Rails.prototype.show_circle = function(circle) {
      return circle.serviceObject.setMap(this.serviceObject);
    };

    Gmaps4Rails.prototype.create_polygons = function() {
      var polygon, _i, _len, _ref, _results;

      _ref = this.polygons;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polygon = _ref[_i];
        _results.push(this.create_polygon(polygon));
      }
      return _results;
    };

    Gmaps4Rails.prototype.create_polygon = function(polygon) {
      var clickable, fillColor, fillOpacity, latlng, new_poly, point, polygon_coordinates, strokeColor, strokeOpacity, strokeWeight, _i, _len;

      polygon_coordinates = [];
      for (_i = 0, _len = polygon.length; _i < _len; _i++) {
        point = polygon[_i];
        latlng = this.createLatLng(point.lat, point.lng);
        polygon_coordinates.push(latlng);
        if (point === polygon[0]) {
          strokeColor = point.strokeColor || this.polygons_conf.strokeColor;
          strokeOpacity = point.strokeOpacity || this.polygons_conf.strokeOpacity;
          strokeWeight = point.strokeWeight || this.polygons_conf.strokeWeight;
          fillColor = point.fillColor || this.polygons_conf.fillColor;
          fillOpacity = point.fillOpacity || this.polygons_conf.fillOpacity;
          clickable = point.clickable || this.polygons_conf.clickable;
        }
      }
      new_poly = new google.maps.Polygon({
        paths: polygon_coordinates,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        clickable: clickable,
        map: this.serviceObject
      });
      return polygon.serviceObject = new_poly;
    };

    Gmaps4Rails.prototype.create_markers = function() {
      this.createServiceMarkersFromMarkers();
      return this.clusterize();
    };

    Gmaps4Rails.prototype.createServiceMarkersFromMarkers = function() {
      var Lat, LatLng, Lng, index, marker, _i, _len, _ref;

      _ref = this.markers;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        marker = _ref[index];
        if (this.markers[index].serviceObject == null) {
          Lat = this.markers[index].lat;
          Lng = this.markers[index].lng;
          if (this.markers_conf.randomize) {
            LatLng = this.randomize(Lat, Lng);
            Lat = LatLng[0];
            Lng = LatLng[1];
          }
          this.markers[index].serviceObject = this.createMarker({
            "marker_picture": this.markers[index].picture ? this.markers[index].picture : this.markers_conf.picture,
            "marker_width": this.markers[index].width ? this.markers[index].width : this.markers_conf.width,
            "marker_height": this.markers[index].height ? this.markers[index].height : this.markers_conf.length,
            "marker_title": this.markers[index].title ? this.markers[index].title : null,
            "marker_anchor": this.markers[index].marker_anchor ? this.markers[index].marker_anchor : null,
            "shadow_anchor": this.markers[index].shadow_anchor ? this.markers[index].shadow_anchor : null,
            "shadow_picture": this.markers[index].shadow_picture ? this.markers[index].shadow_picture : null,
            "shadow_width": this.markers[index].shadow_width ? this.markers[index].shadow_width : null,
            "shadow_height": this.markers[index].shadow_height ? this.markers[index].shadow_height : null,
            "marker_draggable": this.markers[index].draggable ? this.markers[index].draggable : this.markers_conf.draggable,
            "rich_marker": this.markers[index].rich_marker ? this.markers[index].rich_marker : null,
            "zindex": this.markers[index].zindex ? this.markers[index].zindex : null,
            "Lat": Lat,
            "Lng": Lng,
            "index": index
          });
          this.createInfoWindow(this.markers[index]);
          this.createSidebar(this.markers[index]);
        }
      }
      return this.markers_conf.offset = this.markers.length;
    };

    Gmaps4Rails.prototype.createImageAnchorPosition = function(anchorLocation) {
      if (anchorLocation === null) {
        return null;
      } else {
        return this.createPoint(anchorLocation[0], anchorLocation[1]);
      }
    };

    Gmaps4Rails.prototype.replaceMarkers = function(new_markers, adjustBounds) {
      if (adjustBounds == null) {
        adjustBounds = true;
      }
      this.clearMarkers();
      this.markers = new Array;
      if (adjustBounds) {
        this.boundsObject = this.createLatLngBounds();
      }
      this.resetSidebarContent();
      this.markers_conf.offset = 0;
      return this.addMarkers(new_markers, adjustBounds);
    };

    Gmaps4Rails.prototype.addMarkers = function(new_markers, adjustBounds) {
      if (adjustBounds == null) {
        adjustBounds = true;
      }
      this.markers = this.markers.concat(new_markers);
      this.create_markers();
      if (adjustBounds) {
        return this.adjustMapToBounds();
      }
    };

    Gmaps4Rails.prototype.createSidebar = function(marker_container) {
      var aSel, currentMap, html, li, ul;

      if (this.markers_conf.list_container) {
        ul = document.getElementById(this.markers_conf.list_container);
        li = document.createElement('li');
        aSel = document.createElement('a');
        aSel.href = 'javascript:void(0);';
        html = marker_container.sidebar != null ? marker_container.sidebar : "Marker";
        aSel.innerHTML = html;
        currentMap = this;
        aSel.onclick = this.sidebar_element_handler(currentMap, marker_container.serviceObject, 'click');
        li.appendChild(aSel);
        return ul.appendChild(li);
      }
    };

    Gmaps4Rails.prototype.sidebar_element_handler = function(currentMap, marker, eventType) {
      return function() {
        currentMap.map.panTo(marker.position);
        return google.maps.event.trigger(marker, eventType);
      };
    };

    Gmaps4Rails.prototype.resetSidebarContent = function() {
      var ul;

      if (this.markers_conf.list_container !== null) {
        ul = document.getElementById(this.markers_conf.list_container);
        return ul.innerHTML = "";
      }
    };

    Gmaps4Rails.prototype.adjustMapToBounds = function() {
      if (this.map_options.auto_adjust || this.map_options.bounds !== null) {
        this.boundsObject = this.createLatLngBounds();
        if (this.map_options.auto_adjust) {
          this.extendBoundsWithMarkers();
          this.updateBoundsWithPolylines();
          this.updateBoundsWithPolygons();
          this.updateBoundsWithCircles();
        }
        this.extendMapBounds();
        return this.adaptMapToBounds();
      }
    };

    Gmaps4Rails.prototype.replacePolylines = function(new_polylines) {
      this.destroy_polylines();
      this.polylines = new_polylines;
      this.create_polylines();
      return this.adjustMapToBounds();
    };

    Gmaps4Rails.prototype.destroy_polylines = function() {
      var polyline, _i, _len, _ref;

      _ref = this.polylines;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polyline = _ref[_i];
        polyline.serviceObject.setMap(null);
      }
      return this.polylines = [];
    };

    Gmaps4Rails.prototype.create_polylines = function() {
      var polyline, _i, _len, _ref, _results;

      _ref = this.polylines;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polyline = _ref[_i];
        _results.push(this.create_polyline(polyline));
      }
      return _results;
    };

    Gmaps4Rails.prototype.exists = function(var_name) {
      return var_name !== "" && typeof var_name !== "undefined";
    };

    Gmaps4Rails.prototype.randomize = function(Lat0, Lng0) {
      var Lat, Lng, dx, dy;

      dx = this.markers_conf.max_random_distance * this.random();
      dy = this.markers_conf.max_random_distance * this.random();
      Lat = parseFloat(Lat0) + (180 / Math.PI) * (dy / 6378137);
      Lng = parseFloat(Lng0) + (90 / Math.PI) * (dx / 6378137) / Math.cos(Lat0);
      return [Lat, Lng];
    };

    Gmaps4Rails.prototype.mergeObjectWithDefault = function(object1, object2) {
      var copy_object1, key, value;

      copy_object1 = {};
      for (key in object1) {
        value = object1[key];
        copy_object1[key] = value;
      }
      for (key in object2) {
        value = object2[key];
        if (copy_object1[key] == null) {
          copy_object1[key] = value;
        }
      }
      return copy_object1;
    };

    Gmaps4Rails.prototype.mergeWithDefault = function(objectName) {
      var default_object, object;

      default_object = this["default_" + objectName];
      object = this[objectName];
      this[objectName] = this.mergeObjectWithDefault(object, default_object);
      return true;
    };

    Gmaps4Rails.prototype.random = function() {
      return Math.random() * 2 - 1;
    };

    return Gmaps4Rails;

  })();

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Gmaps4RailsGoogle = (function(_super) {
    __extends(Gmaps4RailsGoogle, _super);

    function Gmaps4RailsGoogle() {
      Gmaps4RailsGoogle.__super__.constructor.apply(this, arguments);
      this.map_options = {
        disableDefaultUI: false,
        disableDoubleClickZoom: false,
        type: "ROADMAP"
      };
      this.markers_conf = {
        clusterer_gridSize: 50,
        clusterer_maxZoom: 5,
        custom_cluster_pictures: null,
        custom_infowindow_class: null
      };
      this.mergeWithDefault("map_options");
      this.mergeWithDefault("markers_conf");
      this.kml_options = {
        clickable: true,
        preserveViewport: false,
        suppressInfoWindows: false
      };
      this.polygons_conf = {
        strokeColor: "#FFAA00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#000000",
        fillOpacity: 0.35,
        clickable: false
      };
      this.circles_conf = {
        fillColor: "#00AAFF",
        fillOpacity: 0.35,
        strokeColor: "#FFAA00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        clickable: false,
        zIndex: null
      };
      this.direction_conf = {
        panel_id: null,
        display_panel: false,
        origin: null,
        destination: null,
        waypoints: [],
        optimizeWaypoints: false,
        unitSystem: "METRIC",
        avoidHighways: false,
        avoidTolls: false,
        region: null,
        travelMode: "DRIVING"
      };
    }

    Gmaps4RailsGoogle.prototype.createPoint = function(lat, lng) {
      return new google.maps.Point(lat, lng);
    };

    Gmaps4RailsGoogle.prototype.createLatLng = function(lat, lng) {
      return new google.maps.LatLng(lat, lng);
    };

    Gmaps4RailsGoogle.prototype.createLatLngBounds = function() {
      return new google.maps.LatLngBounds();
    };

    Gmaps4RailsGoogle.prototype.createMap = function() {
      var defaultOptions, mergedOptions;

      defaultOptions = {
        maxZoom: this.map_options.maxZoom,
        minZoom: this.map_options.minZoom,
        zoom: this.map_options.zoom,
        center: this.createLatLng(this.map_options.center_latitude, this.map_options.center_longitude),
        mapTypeId: google.maps.MapTypeId[this.map_options.type],
        mapTypeControl: this.map_options.mapTypeControl,
        disableDefaultUI: this.map_options.disableDefaultUI,
        disableDoubleClickZoom: this.map_options.disableDoubleClickZoom,
        draggable: this.map_options.draggable
      };
      mergedOptions = this.mergeObjectWithDefault(this.map_options.raw, defaultOptions);
      return new google.maps.Map(document.getElementById(this.map_options.id), mergedOptions);
    };

    Gmaps4RailsGoogle.prototype.createMarkerImage = function(markerPicture, markerSize, origin, anchor, scaledSize) {
      return new google.maps.MarkerImage(markerPicture, markerSize, origin, anchor, scaledSize);
    };

    Gmaps4RailsGoogle.prototype.createSize = function(width, height) {
      return new google.maps.Size(width, height);
    };

    Gmaps4RailsGoogle.prototype.createMarker = function(args) {
      var defaultOptions, imageAnchorPosition, markerImage, markerLatLng, mergedOptions, shadowAnchorPosition, shadowImage;

      markerLatLng = this.createLatLng(args.Lat, args.Lng);
      if (args.marker_picture === "" && args.rich_marker === null) {
        defaultOptions = {
          position: markerLatLng,
          map: this.serviceObject,
          title: args.marker_title,
          draggable: args.marker_draggable,
          zIndex: args.zindex
        };
        mergedOptions = this.mergeObjectWithDefault(this.markers_conf.raw, defaultOptions);
        return new google.maps.Marker(mergedOptions);
      }
      if (args.rich_marker !== null) {
        return new RichMarker({
          position: markerLatLng,
          map: this.serviceObject,
          draggable: args.marker_draggable,
          content: args.rich_marker,
          flat: args.marker_anchor === null ? false : args.marker_anchor[1],
          anchor: args.marker_anchor === null ? 0 : args.marker_anchor[0],
          zIndex: args.zindex
        });
      }
      imageAnchorPosition = this.createImageAnchorPosition(args.marker_anchor);
      shadowAnchorPosition = this.createImageAnchorPosition(args.shadow_anchor);
      markerImage = this.createOrRetrieveImage(args.marker_picture, args.marker_width, args.marker_height, imageAnchorPosition);
      shadowImage = this.createOrRetrieveImage(args.shadow_picture, args.shadow_width, args.shadow_height, shadowAnchorPosition);
      defaultOptions = {
        position: markerLatLng,
        map: this.serviceObject,
        icon: markerImage,
        title: args.marker_title,
        draggable: args.marker_draggable,
        shadow: shadowImage,
        zIndex: args.zindex
      };
      mergedOptions = this.mergeObjectWithDefault(this.markers_conf.raw, defaultOptions);
      return new google.maps.Marker(mergedOptions);
    };

    Gmaps4RailsGoogle.prototype.includeMarkerImage = function(arr, obj) {
      var index, object, _i, _len;

      for (index = _i = 0, _len = arr.length; _i < _len; index = ++_i) {
        object = arr[index];
        if (object.url === obj) {
          return index;
        }
      }
      return false;
    };

    Gmaps4RailsGoogle.prototype.createOrRetrieveImage = function(currentMarkerPicture, markerWidth, markerHeight, imageAnchorPosition) {
      var markerImage, test_image_index;

      if (currentMarkerPicture === "" || currentMarkerPicture === null) {
        return null;
      }
      test_image_index = this.includeMarkerImage(this.markerImages, currentMarkerPicture);
      switch (test_image_index) {
        case false:
          markerImage = this.createMarkerImage(currentMarkerPicture, this.createSize(markerWidth, markerHeight), null, imageAnchorPosition, null);
          this.markerImages.push(markerImage);
          return markerImage;
          break;
        default:
          if (typeof test_image_index === 'number') {
            return this.markerImages[test_image_index];
          }
          return false;
      }
    };

    Gmaps4RailsGoogle.prototype.clearMarkers = function() {
      var marker, _i, _len, _ref, _results;

      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(this.clearMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.showMarkers = function() {
      var marker, _i, _len, _ref, _results;

      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(this.showMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.hideMarkers = function() {
      var marker, _i, _len, _ref, _results;

      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(this.hideMarker(marker));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.clearMarker = function(marker) {
      return marker.serviceObject.setMap(null);
    };

    Gmaps4RailsGoogle.prototype.showMarker = function(marker) {
      return marker.serviceObject.setVisible(true);
    };

    Gmaps4RailsGoogle.prototype.hideMarker = function(marker) {
      return marker.serviceObject.setVisible(false);
    };

    Gmaps4RailsGoogle.prototype.extendBoundsWithMarkers = function() {
      var marker, _i, _len, _ref, _results;

      _ref = this.markers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        _results.push(this.boundsObject.extend(marker.serviceObject.position));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.createClusterer = function(markers_array) {
      return new MarkerClusterer(this.serviceObject, markers_array, {
        maxZoom: this.markers_conf.clusterer_maxZoom,
        gridSize: this.markers_conf.clusterer_gridSize,
        styles: this.customClusterer()
      });
    };

    Gmaps4RailsGoogle.prototype.clearClusterer = function() {
      return this.markerClusterer.clearMarkers();
    };

    Gmaps4RailsGoogle.prototype.clusterize = function() {
      var marker, markers_array, _i, _len, _ref;

      if (this.markers_conf.do_clustering === true) {
        if (this.markerClusterer !== null) {
          this.clearClusterer();
        }
        markers_array = new Array;
        _ref = this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          markers_array.push(marker.serviceObject);
        }
        return this.markerClusterer = this.createClusterer(markers_array);
      }
    };

    Gmaps4RailsGoogle.prototype.createInfoWindow = function(marker_container) {
      var boxText, currentMap;

      if (typeof this.jsTemplate === "function" || (marker_container.description != null)) {
        if (typeof this.jsTemplate === "function") {
          marker_container.description = this.jsTemplate(marker_container);
        }
        if (this.markers_conf.custom_infowindow_class !== null) {
          boxText = document.createElement("div");
          boxText.setAttribute("class", this.markers_conf.custom_infowindow_class);
          boxText.innerHTML = marker_container.description;
          marker_container.infowindow = new InfoBox(this.infobox(boxText));
          currentMap = this;
          return google.maps.event.addListener(marker_container.serviceObject, 'click', this.openInfoWindow(currentMap, marker_container.infowindow, marker_container.serviceObject));
        } else {
          marker_container.infowindow = new google.maps.InfoWindow({
            content: marker_container.description
          });
          currentMap = this;
          return google.maps.event.addListener(marker_container.serviceObject, 'click', this.openInfoWindow(currentMap, marker_container.infowindow, marker_container.serviceObject));
        }
      }
    };

    Gmaps4RailsGoogle.prototype.openInfoWindow = function(currentMap, infoWindow, marker) {
      return function() {
        if (currentMap.visibleInfoWindow !== null) {
          currentMap.visibleInfoWindow.close();
        }
        infoWindow.open(currentMap.serviceObject, marker);
        return currentMap.visibleInfoWindow = infoWindow;
      };
    };

    Gmaps4RailsGoogle.prototype.createKmlLayer = function(kml) {
      var kml_options;

      kml_options = kml.options || {};
      kml_options = this.mergeObjectWithDefault(kml_options, this.kml_options);
      kml = new google.maps.KmlLayer(kml.url, kml_options);
      kml.setMap(this.serviceObject);
      return kml;
    };

    Gmaps4RailsGoogle.prototype.create_polyline = function(polyline) {
      var clickable, decoded_array, element, latlng, new_poly, point, polyline_coordinates, strokeColor, strokeOpacity, strokeWeight, zIndex, _i, _j, _len, _len1;

      polyline_coordinates = [];
      for (_i = 0, _len = polyline.length; _i < _len; _i++) {
        element = polyline[_i];
        if (element.coded_array != null) {
          decoded_array = new google.maps.geometry.encoding.decodePath(element.coded_array);
          for (_j = 0, _len1 = decoded_array.length; _j < _len1; _j++) {
            point = decoded_array[_j];
            polyline_coordinates.push(point);
          }
        } else {
          if (element === polyline[0]) {
            strokeColor = element.strokeColor || this.polylines_conf.strokeColor;
            strokeOpacity = element.strokeOpacity || this.polylines_conf.strokeOpacity;
            strokeWeight = element.strokeWeight || this.polylines_conf.strokeWeight;
            clickable = element.clickable || this.polylines_conf.clickable;
            zIndex = element.zIndex || this.polylines_conf.zIndex;
          }
          if ((element.lat != null) && (element.lng != null)) {
            latlng = this.createLatLng(element.lat, element.lng);
            polyline_coordinates.push(latlng);
          }
        }
      }
      new_poly = new google.maps.Polyline({
        path: polyline_coordinates,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight,
        clickable: clickable,
        zIndex: zIndex
      });
      polyline.serviceObject = new_poly;
      return new_poly.setMap(this.serviceObject);
    };

    Gmaps4RailsGoogle.prototype.updateBoundsWithPolylines = function() {
      var point, polyline, polyline_points, _i, _len, _ref, _results;

      _ref = this.polylines;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polyline = _ref[_i];
        polyline_points = polyline.serviceObject.latLngs.getArray()[0].getArray();
        _results.push((function() {
          var _j, _len1, _results1;

          _results1 = [];
          for (_j = 0, _len1 = polyline_points.length; _j < _len1; _j++) {
            point = polyline_points[_j];
            _results1.push(this.boundsObject.extend(point));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.create_kml = function() {
      var kml, _i, _len, _ref, _results;

      _ref = this.kml;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        kml = _ref[_i];
        _results.push(kml.serviceObject = this.createKmlLayer(kml));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.fitBounds = function() {
      if (!this.boundsObject.isEmpty()) {
        return this.serviceObject.fitBounds(this.boundsObject);
      }
    };

    Gmaps4RailsGoogle.prototype.centerMapOnUser = function() {
      return this.serviceObject.setCenter(this.userLocation);
    };

    Gmaps4RailsGoogle.prototype.updateBoundsWithPolygons = function() {
      var point, polygon, polygon_points, _i, _len, _ref, _results;

      _ref = this.polygons;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        polygon = _ref[_i];
        polygon_points = polygon.serviceObject.latLngs.getArray()[0].getArray();
        _results.push((function() {
          var _j, _len1, _results1;

          _results1 = [];
          for (_j = 0, _len1 = polygon_points.length; _j < _len1; _j++) {
            point = polygon_points[_j];
            _results1.push(this.boundsObject.extend(point));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.updateBoundsWithCircles = function() {
      var circle, _i, _len, _ref, _results;

      _ref = this.circles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circle = _ref[_i];
        this.boundsObject.extend(circle.serviceObject.getBounds().getNorthEast());
        _results.push(this.boundsObject.extend(circle.serviceObject.getBounds().getSouthWest()));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.extendMapBounds = function() {
      var bound, _i, _len, _ref, _results;

      _ref = this.map_options.bounds;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bound = _ref[_i];
        _results.push(this.boundsObject.extend(this.createLatLng(bound.lat, bound.lng)));
      }
      return _results;
    };

    Gmaps4RailsGoogle.prototype.adaptMapToBounds = function() {
      var map_center;

      if (!this.map_options.auto_zoom) {
        map_center = this.boundsObject.getCenter();
        this.map_options.center_latitude = map_center.lat();
        this.map_options.center_longitude = map_center.lng();
        return this.serviceObject.setCenter(map_center);
      } else {
        return this.fitBounds();
      }
    };

    return Gmaps4RailsGoogle;

  })(Gmaps4Rails);

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//







;
