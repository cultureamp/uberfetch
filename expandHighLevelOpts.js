var assign = require ('object.assign');
var expandMimeType = require('./expandMimeType');

var highLevelOptNames = ['accept', 'contentType'];
var MIME_JSON = 'application/json';

module.exports = function expandHighLevelOpts(uberOpts) {
  var derivedContentType;
  var fetchOpts = assign({}, uberOpts);

  for (var i = highLevelOptNames.length - 1; i >= 0; i--) {
    delete fetchOpts[highLevelOptNames[i]];
  };

  fetchOpts.headers = fetchOpts.headers || {};

  var existingHeaders = {};
  Object.keys(fetchOpts.headers).forEach(function(headerName) {
    existingHeaders[headerName.toLowerCase()] = fetchOpts.headers[headerName];
  });

  if (uberOpts.body) {
    // when request has a body, default method to post
    fetchOpts.method = fetchOpts.method || 'post';
  }

  // set accept header from high level opt
  if (uberOpts.accept) {
    fetchOpts.headers['accept'] = expandMimeType(uberOpts.accept);
  } else {
    if (!existingHeaders['accept']) {
      // default accept type is JSON
      fetchOpts.headers['accept'] = MIME_JSON;
    }
  }

  // set content-type header from high level opt
  if (uberOpts.contentType) {
    fetchOpts.headers['content-type'] = expandMimeType(uberOpts.contentType);
  } else {
    if (!existingHeaders['content-type']) {
      if (uberOpts.body) {
        // when body present default content-type is JSON
        fetchOpts.headers['content-type'] = MIME_JSON;
      }
    }
  }

  derivedContentType = existingHeaders['content-type'] || fetchOpts.headers['content-type']

  if (uberOpts.body) {
    if (typeof uberOpts.body == 'object') {
      // serialize object provided as request body for known content-type
      if (derivedContentType === MIME_JSON) {
        fetchOpts.body = JSON.stringify(uberOpts.body);
      }
    }
  }

  return fetchOpts;
}
