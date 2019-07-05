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
