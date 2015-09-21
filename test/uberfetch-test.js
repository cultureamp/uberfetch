var assert = require('assert');
var sinon = require('sinon');
 
global.fetch = require('node-fetch');
var fetchMock = require('fetch-mock');

fetchMock.registerRoute([
  {
    name: 'api',
    matcher: 'http://api.example.com/thing/1',
    response: {
      body: '{"a":"b"}',
    }
  },
]);

fetchMock.mock({
  greed: 'bad' // bad: all unmatched calls result in a rejected promise 
});

var uberfetch = require('../uberfetch');
 
describe('uberfetch', function() {
  afterEach(function() {
    fetchMock.reset();
  });

  it('makes a json request by default', function () {    
    var url = 'http://api.example.com/thing/1';
    var req = uberfetch.get(url);

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.deepEqual(fetch.lastCall.args[1], {
      method: 'get',
      headers: {
        'Accept': 'application/json'
      },
    });
  });

  it('makes a post', function () {    
    var url = 'http://api.example.com/thing/1';
    var req = uberfetch.post(url, {body: {a: 'b'}});

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.deepEqual(fetch.lastCall.args[1], {
      method: 'post',
      body: '{"a":"b"}',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
  });
});
