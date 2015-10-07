# uberfetch
A thin layer over [fetch](https://github.com/github/fetch) which makes JSON the default, and turns HTTP errors into Promise rejections.

```js
import uberfetch from 'uberfetch';
```

### get JSON
```js
uberfetch('/cats/10')
  .then(res => /* do stuff */);
```

which is equivalent to:

```js
function rejectOnRequestError(res) {
  if (res.ok) return res;
  return Promise.reject(new RequestError(res));
}

fetch('/cats/10', {
  credentials: 'same-origin',
  headers: {
    'accept': 'application/json'
  }
})
  .then(rejectOnRequestError)
  .then(res => /* do stuff */);
```

### post JSON
```js
let updatedCat = {id: 10, name: 'Keith'};

uberfetch.post('/cats/10', {body: updatedCat});
```

which is equivalent to:

```js
let updatedCat = {id: 10, name: 'Keith'};

fetch('/cats/10', {
  method: 'post',
  body: JSON.stringify(updatedCat),
  credentials: 'same-origin',
  headers: {
    'content-type': 'application/json'
    'accept': 'application/json'
  }
})
  .then(rejectOnRequestError);
```

### get HTML
```js
// get some html
uberfetch('/cats/10', {accept: 'html'})
  .then(res => /* do stuff */);
```

which is equivalent to:

```js
fetch('/cats/10', {
  credentials: 'same-origin',
  headers: {
    'accept': 'text/html'
  }
})
  .then(rejectOnRequestError)
  .then(res => /* do stuff */);
```

### catch typed errors

```js
let cat = {id: 10, name: 'Keith'};

uberfetch.post('/cats/10', {body: cat})
  .then(res => res.json())
  .then(body => FlashMessage.show(`${body.name} saved`))
  .catch(err => {
    if (err instanceof uberfetch.RequestError) {
      if (err.status == 422) {
        return err.response.json()
          .then(body => 
            AlertModal.show(`Validation failed: ${body.validationErrors}`)
          );
      }
    }
    return Promise.reject(err);
  });
```

Or with ES7 `async/await`

```js
async function() {
  let cat = {id: 10, name: 'Keith'};

  try {
    let response = await uberfetch.post('/cats/10', {body: cat})
    let body = await response.json();
    FlashMessage.show(`${body.name} saved`);
  } catch (err) {
    if (err instanceof uberfetch.RequestError) {
      if (err.status == 422) {
        let body = err.response.json()
        AlertModal.show(`Validation failed: ${body.validationErrors}`);
        return;
      }
    }
    return Promise.reject(err);
  }
}
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

