/*
 * verror.js: richer JavaScript errors
 */

var mod_util = { 
	inherits: require('util.inherits')
}

module.exports = VError;

/*
 * See README.md for reference documentation.
 */
function VError(message = 'VError', err)
{
	var args, obj, parsed, cause, ctor, k;
	this.name = this.constructor.name;
	if (err) {
		if (!err instanceof Error) {
			throw new Error('Provided error to VError constructor is not Error');
		}

		this.jse_cause = err;
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
