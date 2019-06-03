
/**
 * The Response class manages the format of the response JSON objects
 * Make sure that almost every response is sent with this class as changes to
 * the format will be reflected here and in the angular response interface file
 * @type {Object}
 */
export default class Response {

  /**
   * Initialize the fields for the response object
   */
  constructor() {

    this.error = { exists: false };
    this.content;

  }

  /**
   * Replace the content field with your content object
   * @param {Object} content An object with your response data
   */
  addContent(content) {

    this.content = content;

  }

  /**
   * Add an error to the request object. The request object will flag that an
   * application level error has occured
   * Ex. a user enters an invalid username; return error message(s)
   * @param {Object} content The information regarding the error
   */
  addError(content) {

    this.error.exists = true;
    this.error.errorInfo = content;

  }

  /**
   * Return the formatted response object
   * @return {Object} JSON to send to the client
   */
  get output() {

    return { error: this.error, content: this.content };

  }

}
