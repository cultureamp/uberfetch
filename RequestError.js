import StandardError from 'standard-error';

export default class RequestError extends StandardError {
  constructor(response) {
    this.response = response;
    this.status = response.status;
  }
}
