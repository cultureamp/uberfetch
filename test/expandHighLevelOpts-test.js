var assert = require('assert');
var expandHighLevelOpts = require('../expandHighLevelOpts');

describe('expandHighLevelOpts', function() {
  it('expands to a json request by default', function () {
    var actual = expandHighLevelOpts({});

    var expected = {
      headers: {
        'accept': 'application/json'
      }
    };

    assert.deepEqual(expected, actual);
  });

  it('expands a request with an object body to a json post', function () {  
    var expected = expandHighLevelOpts({
      body: {a: 'b'}
    });

    var actual = {
      method: 'post',
      body: '{"a":"b"}',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    };

    assert.deepEqual(expected, actual);
  });

  it('expands a form post with appropriate headers', function () {  
    var expected = expandHighLevelOpts({
      contentType: 'form',
      accept: 'html',
      body: 'asd=asd'
    });

    var actual = {
      method: 'post',
      body: 'asd=asd',
      headers: {
        'accept': 'text/html',
        'content-type': 'application/x-www-form-urlencoded'
      }
    };

    assert.deepEqual(expected, actual);
  });

  it('expands html request with appropriate headers', function () {  
    var expected = expandHighLevelOpts({
      accept: 'html',
    });

    var actual = {
      headers: {
        'accept': 'text/html',
      }
    };

    assert.deepEqual(expected, actual);
  });

  it('expands a delete request', function () {  
    var expected = expandHighLevelOpts({
      method: 'delete',
    });

    var actual = {
      method: 'delete',
      headers: {
        'accept': 'application/json',
      }
    };

    assert.deepEqual(expected, actual);
  });
});
