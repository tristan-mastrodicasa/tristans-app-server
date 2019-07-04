/**
 * **SHARED CODE WARNING**
 * The interfaces defined here are used in the client angular application!
 * When making edits please update the client code aswell (response.ts)
 */

/**
 * Interface for all response objects from the server,
 * <T> is the type of object / array containing the content
 */
export interface Response<T> {
  error: {
    exists: boolean,
    errorInfo?: any
  };
  content?: T;
}

/** Internally used Interfaces */

interface BasicUser {
  id: string;
  firstName: string;
  username: string;
  photo: string;
}

/**
 * Content type Options
 */

export interface Profile extends BasicUser {
  influence: number;
  followers: number;
  contentNumber: number;
}

export interface UserItem extends BasicUser {
  influence: number;
  activeCanvases?: number; // Number of active canvases
}

export interface CanvasCard {
  cid: string;
  users: {
    primary: BasicUser,
    secondary: BasicUser
  };
  imagePath: string;
  description?: string;
  stars: number;
  utcTime: number;
}


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
  private _state = 200;

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

    this.state = 400;
    this.error.exists = true;
    this.error.errorInfo = error;

  }

  /**
   * Return the response code state
   * @return code of the state. Ex: 200 or 400
   */
  get state(): number {

    return this._state;

  }
  /**
   * Set the response state
   * @param state http code of the response
   */
  set state(state: number) {

    this._state = state;

  }

  /**
   * Return the formatted response object
   * @return JSON to send to the client
   */
  get output(): Response<T> {

    return { error: this.error, content: this.content };

  }

}
