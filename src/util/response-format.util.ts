import { Response } from './response.interface';

/**
 * The ResponseFormat class manages the format of the response JSON objects
 *
 * @usageNotes
 *
 * Make sure that almost every response is sent with this class as changes to
 * the format will be reflected here and in the angular response interface file
 */
export default class ResponseFormat<T> {

  private error: { exists: boolean, errorInfo?: any } = { exists: false };
  private content: T;

  /**
   * Replace the content field with your content object
   * @param content An object with your response data
   */
  public addContent(content: T): void {

    this.content = content;

  }

  /**
   * Add an error to the request object. The request object will flag that an
   * application level error has occured.
   * It also set the state as 400 error code
   * Ex. a user enters an invalid username; return error message(s)
   * @param error The information regarding the error
   */
  public addError(error: any): void {

    this.error.exists = true;
    this.error.errorInfo = error;

  }

  /**
   * Return the formatted response object
   * @return JSON to send to the client
   */
  get output(): Response<T> {

    return { error: this.error, content: this.content };

  }

}
