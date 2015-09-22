var StandardError = require('standard-error');
var assign = require('lodash.assign');

function RequestError(response, extraProperties) {
  var message = response.status + ': ' + response.statusText;
  var properties = assign(
    {
      response: response,
      status: response.status
    },
    extraProperties
  );

  StandardError.call(this, message, properties);
}

RequestError.prototype = Object.create(StandardError.prototype, {
  constructor: {value: RequestError, configurable: true, writable: true}
});

module.exports = RequestError;
