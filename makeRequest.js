import omit from 'lodash.omit';

function expandMimeType(short) {
  if (short.includes('/')) return short;

  switch (short) {
    case 'form':
      return 'application/x-www-form-urlencoded';
    case 'text':
      return 'text/plain';
    case 'html':
      return 'text/html';
    case 'json':
      return 'application/json';
    default:
      return `application/${short}`;
  }
}

function expandHighLevelOpts(highLevelOpts) {
  const lowLevelOpts = omit(highLevelOpts, 'accept', 'contentType');
  let {accept, contentType} = highLevelOpts;
  // TODO: add opt to not automatically parse response body?
  // TODO: default accept header to json?

  if (highLevelOpts.body && typeof highLevelOpts.body == 'object') {
    if (contentType === 'form') {
      // TODO: add support for form serialization?
      throw new Error('Implicit serialization of form data not supported');
    }
    // default serialization of 'body' field is JSON :)
    lowLevelOpts.body = JSON.stringify(highLevelOpts.body);
    contentType = 'json';
    lowLevelOpts.method = lowLevelOpts.method || 'post';
  }

  if (accept || contentType) {
    lowLevelOpts.headers = lowLevelOpts.headers || {};
    const {headers} = lowLevelOpts;

    if (accept) headers.Accept = expandMimeType(accept);
    if (contentType) headers['Content-Type'] = expandMimeType(contentType);
  }

  return lowLevelOpts;
}

export default function makeRequest(url, opts) {
  return fetch(url, expandHighLevelOpts(opts));
}
