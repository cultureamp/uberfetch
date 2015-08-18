import defaults from 'lodash.defaults';
import RequestError from './RequestError';
import makeRequest from './makeRequest';
import parseBody from './parseBody';

function rejectOnRequestError(res) {
  // TODO: also allow 304: Not Modified?
  if (res.ok) return res;
  return Promise.reject(new RequestError(res));
}

// wrap an existing fetch promise
function wrapRequest(req) {
  return Promise.resolve(req)
    .then(rejectOnRequestError)
    .then(parseBody)
}

function request(url, opts) {
  return wrapRequest(makeRequest(url, opts));
}

function makeRequestFn(defaultOpts) {
  return (url, opts) => request(url, defaults(opts, defaultOpts));
}

export default {
  request,
  wrapRequest,
  get: makeRequestFn({method: 'get'}),
  post: makeRequestFn({method: 'post'}),
  put: makeRequestFn({method: 'put'}),
  delete: makeRequestFn({method: 'delete'}),
  patch: makeRequestFn({method: 'patch'}),
}
