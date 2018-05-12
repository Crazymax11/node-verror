class VError extends Error {
  constructor(message = 'VError', err) {
    super(message);
    this.name = this.constructor.name;
    if (err) {
      if (!(err instanceof Error)) {
        throw new Error('Provided error to VError constructor is not Error');
      }

      this.jse_cause = err;
    }

    this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    return this;
  }

  fullStack() {
    const cause = this.jse_cause;

    if (cause) {
      const causeStack = cause instanceof VError ? cause.fullStack() : cause.stack;
      return `${this.stack}\nCaused by: ${causeStack}`;
    }

    return this.stack;
  }

  toString() {
    const errorClassName = this.name || this.constructor.name || this.constructor.prototype.name;
    return this.message ? `${errorClassName}: ${this.message}` : errorClassName;
  }
}


module.exports = VError;
