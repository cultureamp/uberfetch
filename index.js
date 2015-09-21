var defaults = require('lodash.defaults');
var RequestError = require('./RequestError');
var parseBody = require('./parseBody');
var expandHighLevelOpts = require('./expandHighLevelOpts');

function rejectOnRequestError(res) {
  // TODO: also allow 304: Not Modified?
  if (res.ok) return res;
  return Promise.reject(new RequestError(res));
}

function makeRequest(url, opts) {
  return fetch(url, expandHighLevelOpts(opts));
}

// wrap an existing fetch promise with error handling and body parsing behavior
function wrapRequest(req, autoParseBody) {
  var reqWithErrorHandler = Promise.resolve(req)
    .then(rejectOnRequestError);

  if (autoParseBody !== false) return reqWithErrorHandler;

  return reqWithErrorHandler.then(parseBody);
}

// exposed api function to make a generic request
function request(url, opts) {
  var autoParseBody = opts && typeof opts.parseBody == 'boolean' ? opts.parseBody : true;
  return wrapRequest(makeRequest(url, opts), autoParseBody);
}

// util to generate request function with partially applied opts
function makeCustomRequestFn(defaultOpts) {
  return function(url, opts) {
    return request(url, defaults(opts, defaultOpts));
  };
}

module.exports = {
  request: request,
  wrapRequest: wrapRequest,
  get: makeCustomRequestFn({method: 'get'}),
  post: makeCustomRequestFn({method: 'post'}),
  put: makeCustomRequestFn({method: 'put'}),
  delete: makeCustomRequestFn({method: 'delete'}),
  patch: makeCustomRequestFn({method: 'patch'}),
}
