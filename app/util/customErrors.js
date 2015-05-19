var util = require('util');

module.exports = function EducationPlatformError(code,message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.extra = extra;
    this.code = code;
};

util.inherits(module.exports, Error);