var assign = require('object.assign');
var RequestError = require('./RequestError');
var expandHighLevelOpts = require('./expandHighLevelOpts');

function rejectOnRequestError(res) {
  // TODO: also allow 304: Not Modified?
  if (res.ok) return res;
  return Promise.reject(new RequestError(res));
}

function makeRequest(url, opts) {
  return fetch(url, expandHighLevelOpts(opts || {}));
}

// wrap an existing fetch promise with error handling and body parsing behavior
function wrapRequest(req, autoParseBody) {
  return Promise.resolve(req)
    .then(rejectOnRequestError);
}

// exposed api function to make a generic request
function uberfetch(url, opts) {
  return wrapRequest(makeRequest(url, opts));
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
uberfetch['delete'] = makeCustomRequestFn({method: 'delete'});
uberfetch.patch = makeCustomRequestFn({method: 'patch'});

module.exports = uberfetch;
