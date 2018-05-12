export default class ChainableError extends Error {
  constructor(message = 'ChainableError', err) {
    super(message);
    this.name = this.constructor.name;
    if (err) {
      if (!(err instanceof Error)) {
        throw new Error('Provided error to ChainableError constructor is not Error');
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
      const causeStack = cause instanceof ChainableError ? cause.fullStack() : cause.stack;
      return `${this.stack}\nCaused by: ${causeStack}`;
    }

    return this.stack;
  }

  toString() {
    const errorClassName = this.name || this.constructor.name || this.constructor.prototype.name;
    return this.message ? `${errorClassName}: ${this.message}` : errorClassName;
  }
}

