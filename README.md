# uberfetch
A thin layer over [fetch](https://github.com/github/fetch) which makes JSON the default, and turns HTTP errors into Promise rejections.

```js
import uberfetch from 'uberfetch';
```

### get JSON
```js
uberfetch('/cats/10')
  .then(cat =>  console.log('parsed json of cat #10', cat));
```

which is equivalent to:

```js
fetch('/cats/10', {
  headers: {
    'accept': 'application/json'
  }
})
  .then(rejectOnRequestError)
  .then(res => res.json())
  .then(cat =>  console.log('parsed json of cat #10', cat));

function rejectOnRequestError(res) {
  if (res.ok) return res;
  return Promise.reject(new RequestError(res));
}
```

### post JSON
```js
uberfetch.post('/cats/10', {
  body: {id: 10, name: 'Keith'}
})
  .then(cat => console.log('parsed json of updated cat #10', cat));
```

which is equivalent to:

```js
fetch('/cats/10', {
  method: 'post',
  body: JSON.stringify({id: 10, name: 'Keith'}),
  headers: {
    'content-type': 'application/json'
    'accept': 'application/json'
  }
})
  .then(rejectOnRequestError)
  .then(res => res.json())
  .then(cat =>  console.log('parsed json of updated cat #10', cat));
```

### get HTML
```js
// get some html
uberfetch('/cats/10', {
  accept: 'html'
})
  .then((body) => {
    document.body.innerHTML = body
  });
```

which is equivalent to:

```js
fetch('/cats/10', {
  headers: {
    'accept': 'text/html'
  }
})
  .then(rejectOnRequestError)
  .then((response) => response.text())
  .then((body) => {
    document.body.innerHTML = body
  });
```

## API

Use `uberfetch(url, opts)` exactly as you would `fetch(url, opts)`, with the 
following additional opts which can be provided in the opts object:

- `accept: string` shorthand for setting an accept header, which takes 
  either a mime type, or a convenient short name like `form`, `html`, `text` etc.
- `contentType: string` shorthand for setting an content-type header, 
  which takes either a mime type, or a convenient short name like `form`, 
  `html`, `text` etc.
- `body: any` works like the normal `fetch` body field, except that known 
  content-types will be automatically serialized. When `body` is present, the
  default http method becomes POST.

In addition to the `uberfetch()` function, the following convenience helpers are
available:

- `uberfetch.get()` automatically sets `method: 'get'`
- `uberfetch.post()` automatically sets `method: 'post'`
- `uberfetch.put()` automatically sets `method: 'put'`
- `uberfetch.patch()` automatically sets `method: 'patch'`
- `uberfetch.delete()` automatically sets `method: 'delete'`

