var omit = require ('lodash.omit');
var expandMimeType = require('./expandMimeType');

var highLevelOptNames = ['accept', 'contentType', 'parseBody'];

module.exports = function expandHighLevelOpts(uberOpts) {
  var fetchOpts = omit(uberOpts, highLevelOptNames);

  // default accept type is JSON
  uberOpts.accept = uberOpts.accept || 'json';

  if (uberOpts.body) {
    // default serialization of 'body' field is JSON
    uberOpts.contentType = uberOpts.contentType || 'json';

    if (uberOpts.body && typeof uberOpts.body == 'object') {
      // serialize object provided as request body
      if (uberOpts.contentType === 'json') {
        fetchOpts.body = JSON.stringify(uberOpts.body);
      } else if (typeof FormData != 'undefined' && uberOpts.body instanceof FormData) {
        // do nothing
      } else {
        throw new Error('Implicit serialization of request body to string not supported for contentType: '+uberOpts.contentType);
      }
    }

    // when request has a body, default method to post
    fetchOpts.method = fetchOpts.method || 'post';
  }

  fetchOpts.headers = fetchOpts.headers || {};

  if (!fetchOpts.headers['Accept']) {
    fetchOpts.headers['Accept'] = expandMimeType(uberOpts.accept);
  }

  if (uberOpts.contentType && !fetchOpts.headers['Content-Type']) {
    fetchOpts.headers['Content-Type'] = expandMimeType(uberOpts.contentType);
  }

  return fetchOpts;
}
