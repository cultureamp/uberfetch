module.exports = function expandMimeType(abbreviatedType) {
  if (abbreviatedType == null) throw new Error('Missing required argument abbreviatedType');
  if (abbreviatedType.indexOf('/') > -1) return abbreviatedType;

  switch (abbreviatedType) {
    case 'form':
      return 'application/x-www-form-urlencoded';
    case 'text':
      return 'text/plain';
    case 'html':
      return 'text/html';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/' + abbreviatedType;
  }
}
