var StandardError = require('standard-error');

module.exports = function RequestError(response) {
  var msg = response.status + ': ' + response.statusText;
  var extraProperties = {
    response: response,
    status: response.status
  };

  StandardError.call(this, msg, extraProperties);
}

RequestError.prototype = Object.create(StandardError.prototype, {
  constructor: {value: RequestError, configurable: true, writable: true}
});
