/**
 * **SHARED CODE WARNING**
 * The interfaces defined here are used in the server!
 * When making edits please update the client code aswell (response.ts)
 */

/**
 * Error interface
 */
export interface Error {
  error: string | object[];
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
