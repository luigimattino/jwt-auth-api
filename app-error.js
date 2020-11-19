function AppError(message) {
    this.type = 'app';
    this.message = message || '';
    var error = new Error(this.message);
    error.type = this.name;
    this.stack = error.stack;
  }
  AppError.prototype = Object.create(Error.prototype);
  
  module.exports = AppError;