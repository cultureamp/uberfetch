# uberfetch
a layer over whatwg-fetch

```js
import uberFetch from 'uberfetch';
```

## JSON
```js
// get some json
uberFetch.get('/cats/10')
  .then(cat =>  console.log('parsed json of cat #10', cat));

// which is equivalent to
fetch('/cats/10', {
  method: 'get',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(res => res.json())
  .then(cat =>  console.log('parsed json of cat #10', cat));

// post some json
uberFetch.post('/cats/10', {body: {id: 10, name: 'Keith'}})
  .then(cat => console.log('parsed json of updated cat #10', cat));

// which is equivalent to
fetch('/cats/10', {
  method: 'post',
  body: JSON.stringify({id: 10, name: 'Keith'}),
  headers: {
    'Content-Type': 'application/json'
    'Accept': 'application/json'
  }
})
  .then(res => res.json())
  .then(cat =>  console.log('parsed json of updated cat #10', cat));
```

## HTML
```js
// get some html
uberFetch.get('/cats/10', {accept: 'html'})
  .then((body) => {
    document.body.innerHTML = body
  });

// which is equivalent to
fetch('/cats/10', {
  method: 'get',
  headers: {
    'Accept': 'text/html'
  }
})
  .then((response) => response.text())
  .then((body) => {
    document.body.innerHTML = body
  });
```
