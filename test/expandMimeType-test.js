var assert = require('assert');
var expandMimeType = require('../expandMimeType');

describe('expandMimeType', function() {
  it('expands known mime types', function () {
    assert.equal(expandMimeType('form'), 'application/x-www-form-urlencoded');
    assert.equal(expandMimeType('json'), 'application/json');
    assert.equal(expandMimeType('xml'), 'application/xml');
    assert.equal(expandMimeType('html'), 'text/html');
    assert.equal(expandMimeType('text'), 'text/plain');
    assert.equal(expandMimeType('csv'), 'text/csv');
  });

  it('returns the input value when already a valid mime type', function () {
    assert.equal(expandMimeType('text/plain'), 'text/plain');
    assert.equal(expandMimeType('text/html'), 'text/html');
    assert.equal(expandMimeType('application/x-www-form-urlencoded'), 'application/x-www-form-urlencoded');
  });

  it('returns an application/[type] mimetype when not a known type', function () {
    assert.equal(expandMimeType('asdasd'), 'application/asdasd');
    assert.equal(expandMimeType('application/1234'), 'application/1234');
  });
});
