export default function parseBody(res) {
  switch (res.headers.get('Content-Type')) {
    case 'application/json':
      return res.json();
    default:
      return res.text();
  }
}
