/*
 * verror.js: richer JavaScript errors
 */

function throwError(message) {
	throw new Error(message);
}
var mod_assertplus = {
	object(obj, message) {
		typeof obj === 'object' && obj !== null || throwError(message);
	},
	func(f, message) {
		return typeof f === 'function' || throwError(message);
	},
	bool(b, message) {
		return typeof b === 'boolean' || throwError(message);
	},
	array(arr, message) {
		return Array.isArray(arr) || throwError('list of errors (array) is required');
	},
	string(str, message) {
		return typeof str === 'string' || throwError('string is required');
	},
	ok(value, message) {
		return !!value || throwError(message);
	},
	arrayOfObject(arr, message) {
		return Array.isArray(arr) && arr.every(mod_assertplus.object) || throwError('AssertionError: errors ([object]) is required');
	}
}
var mod_util = { 
	inherits: require('util.inherits')
}

function isError(e) {
	return (Object.prototype.toString.call(e) === '[object Error]' || e instanceof Error);
}

/*
 * Public interface
 */

/* So you can 'var VError = require('verror')' */
module.exports = VError;

/*
 * See README.md for reference documentation.
 */
function VError(message = 'VError', err, skipCauseMessage = false)
{
	var args, obj, parsed, cause, ctor, k;

	if (err) {
		if (!err instanceof Error) {
			throw new Error('Provided error to VError constructor is not Error');
		}

		this.jse_cause = err;

		if (!skipCauseMessage) {
			message += ': ' + err.message;
		}
	}

	this.message = message;
	Error.call(this, message);

	if (Error.captureStackTrace) {
		ctor = this.constructor;
		Error.captureStackTrace(this, ctor);
	}

	return (this);
}

mod_util.inherits(VError, Error);
VError.prototype.name = 'VError';

VError.prototype.toString = function verror_toString()
{
	var str = (this.hasOwnProperty('name') && this.name ||
		this.constructor.name || this.constructor.prototype.name);
	if (this.message)
		str += ': ' + this.message;

	return (str);
};

VError.fullStack = function (err) {

	var cause = err.jse_cause;

	if (cause) {
		return (err.stack + '\nCaused by: ' + VError.fullStack(cause));
	}

	return (err.stack);
};
