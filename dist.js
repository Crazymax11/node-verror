'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var VError = function (_extendableBuiltin2) {
  _inherits(VError, _extendableBuiltin2);

  function VError() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'VError';

    var _ret;

    var err = arguments[1];

    _classCallCheck(this, VError);

    var _this = _possibleConstructorReturn(this, (VError.__proto__ || Object.getPrototypeOf(VError)).call(this, message));

    _this.name = _this.constructor.name;
    if (err) {
      if (!(err instanceof Error)) {
        throw new Error('Provided error to VError constructor is not Error');
      }

      _this.jse_cause = err;
    }

    _this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this, _this.constructor);
    }

    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(VError, [{
    key: 'fullStack',
    value: function fullStack() {
      var cause = this.jse_cause;

      if (cause) {
        var causeStack = cause instanceof VError ? cause.fullStack() : cause.stack;
        return this.stack + '\nCaused by: ' + causeStack;
      }

      return this.stack;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var errorClassName = this.name || this.constructor.name || this.constructor.prototype.name;
      return this.message ? errorClassName + ': ' + this.message : errorClassName;
    }
  }]);

  return VError;
}(_extendableBuiltin(Error));

module.exports = VError;
