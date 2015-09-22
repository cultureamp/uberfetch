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
    var req = uberfetch(url);

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.equal(fetch.lastCall.args[1].headers['accept'], 'application/json');
  });

  it('sets no method by default', function () {
    var url = 'http://api.example.com/thing/1';
    var req = uberfetch(url);

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.equal(fetch.lastCall.args[1].method, undefined);
  });

  it('when a body is present, defaults to a json post', function () {
    var url = 'http://api.example.com/thing/1';
    var req = uberfetch(url, {body: {a: 'b'}});

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.deepEqual(fetch.lastCall.args[1], {
      method: 'post',
      body: '{"a":"b"}',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
    });
  });

  it('posts a form', function () {
    var url = 'http://api.example.com/thing/1';
    var req = uberfetch(url, {accept: 'html', contentType: 'form', body: 'a=a'});

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.deepEqual(fetch.lastCall.args[1], {
      method: 'post',
      body: 'a=a',
      headers: {
        'accept': 'text/html',
        'content-type': 'application/x-www-form-urlencoded'
      },
    });
  });

  describe('.get', function() {
    it('sets the GET method', function () {
      var url = 'http://api.example.com/thing/1';
      var req = uberfetch.get(url);

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'get');
    });
  });

  describe('.post', function() {
    it('sets the POST method', function () {
      var url = 'http://api.example.com/thing/1';
      var req = uberfetch.post(url, {method: 'post', body: {a: 'b'}});

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'post');
    });
  });

  describe('.put', function() {
    it('sets the PUT method', function () {
      var url = 'http://api.example.com/thing/1';
      var req = uberfetch.put(url, {method: 'put', body: {a: 'b'}});

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'put');
    });
  });

  describe('.delete', function() {
    it('sets the DELETE method', function () {
      var url = 'http://api.example.com/thing/1';
      var req = uberfetch.delete(url, {method: 'delete', body: {a: 'b'}});

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'delete');
    });
  });
});
