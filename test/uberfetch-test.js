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
  {
    name: 'fail',
    matcher: 'http://fail.example.com/bad/1',
    response: 422
  },
]);

fetchMock.mock({
  greed: 'bad' // bad: all unmatched calls result in a rejected promise 
});

var uberfetch = require('../uberfetch');
 
describe('uberfetch', function() {
  var url;

  beforeEach(function() {
    url = 'http://api.example.com/thing/1';
  });

  afterEach(function() {
    fetchMock.reset();
  });

  it('makes a json request by default', function () {
    var req = uberfetch(url);

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.equal(fetch.lastCall.args[1].headers['accept'], 'application/json');
  });

  it('sets no method by default', function () {
    var req = uberfetch(url);

    assert(fetch.calledOnce);
    assert.equal(fetch.lastCall.args[0], url);
    assert.equal(fetch.lastCall.args[1].method, undefined);
  });

  it('when a body is present, defaults to a json post', function () {
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

  describe('when making a successful request', function() {
    beforeEach(function() {
      url = 'http://api.example.com/thing/1';
    });
    it('resolves with a response object', function () {
      var requestErr;
      return uberfetch.post(url, {body: {}})
        .catch(function(err) {
          if (err instanceof uberfetch.RequestError) requestErr = err;
          else return Promise.reject(err);
        })
        .then(function(res) {
          assert(!requestErr);
          assert.equal(res.status, 200);
          assert.equal(res.ok, true);
        })
    });
  });

  describe('when making an unsuccessful request', function() {
    beforeEach(function() {
      url = 'http://fail.example.com/bad/1';
    });

    it('rejects with an error object representing a http error', function () {
      assert.equal(typeof uberfetch.RequestError, 'function');

      var requestErr;
      return uberfetch(url)
        .catch(function(err) {
          if (err instanceof uberfetch.RequestError) requestErr = err;
          else return Promise.reject(err);
        })
        .then(function(arg) {
          assert(requestErr instanceof uberfetch.RequestError);
          assert.equal(requestErr.status, 422);
          assert.equal(requestErr.response.ok, false);
        })
    });
  });

  describe('.get', function() {
    it('sets the GET method', function () {
      var req = uberfetch.get(url);

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'get');
    });
  });

  describe('.post', function() {
    it('sets the POST method', function () {
      var req = uberfetch.post(url, {method: 'post', body: {a: 'b'}});

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'post');
    });
  });

  describe('.put', function() {
    it('sets the PUT method', function () {
      var req = uberfetch.put(url, {method: 'put', body: {a: 'b'}});

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'put');
    });
  });

  describe('.delete', function() {
    it('sets the DELETE method', function () {
      var req = uberfetch.delete(url, {method: 'delete', body: {a: 'b'}});

      assert(fetch.calledOnce);
      assert.equal(fetch.lastCall.args[0], url);
      assert.equal(fetch.lastCall.args[1].method, 'delete');
    });
  });
});
