var assign = require('lodash.assign');
var RequestError = require('./RequestError');
var parseBody = require('./parseBody');
var expandHighLevelOpts = require('./expandHighLevelOpts');

function rejectOnRequestError(res) {
  // TODO: also allow 304: Not Modified?
  if (res.ok) return res;

  return parseBody(res)
    .then(function(body) {
      return Promise.reject(new RequestError(res, {body: body}));
    });
}

function makeRequest(url, opts) {
  return fetch(url, expandHighLevelOpts(opts));
}

// wrap an existing fetch promise with error handling and body parsing behavior
function wrapRequest(req, autoParseBody) {
  var reqWithErrorHandler = Promise.resolve(req)
    .then(rejectOnRequestError);

  if (autoParseBody === false) return reqWithErrorHandler;

  return reqWithErrorHandler.then(parseBody);
}

// exposed api function to make a generic request
function uberfetch(url, opts) {
  opts = opts || {};
  var autoParseBody = opts.parseBody === false ? false : true;
  return wrapRequest(makeRequest(url, opts), autoParseBody);
}

// util to generate request function with partially applied opts
function makeCustomRequestFn(defaultOpts) {
  return function(url, opts) {
    opts = opts || {};
    return uberfetch(url, assign({}, defaultOpts, opts));
  };
}

uberfetch.RequestError = RequestError;
uberfetch.wrapRequest = wrapRequest;
uberfetch.get = makeCustomRequestFn({method: 'get'});
uberfetch.post = makeCustomRequestFn({method: 'post'});
uberfetch.put = makeCustomRequestFn({method: 'put'});
uberfetch.delete = makeCustomRequestFn({method: 'delete'});
uberfetch.patch = makeCustomRequestFn({method: 'patch'});

module.exports = uberfetch;
