/**
 * **SHARED CODE WARNING**
 */

/**
 * API Interface
 * @todo Sometime in the future implement standard REST API responses
 * https://jsonapi.org/examples/
 * https://jsonapi.org/examples/#pagination
 */
/*
export interface Response<D, I = {}> {
  data: D;
  links?: {};
  meta?: {};
  included?: I;
}
*/

/**
 * https://jsonapi.org/examples/#error-objects
 */
export interface Error {
  status?: number;
  source?: { pointer?: string };
  title?: string;
  detail: string;
}

/** Basic reponses */
export interface Token { token: string; }
export interface JwtContent { id: number; }

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

/**
 * Enum for content visibility
 */
export enum EVisibility {
  public = 'public',
  followers = 'followers',
  followBacks = 'follow-backs',
  specificUsers = 'specific-users',
}

/**
 * Enum for the ContentCard type to decide what type of card it is
 */
export enum EContentType {
  Canvas = 'canvas',
  Meme = 'meme'
}

/**
 * A complex type that defines the content card
 * The content card is defined in two ways depending on the type of card
 */
export type ContentCard = {
  type: EContentType.Meme;
  id: string;
  cid: string;
  users: {
    primary: BasicUser;
    secondary: BasicUser;
  },
  imagePath: string;
  description?: string;
  stars: number;
  starred: boolean;
  utcTime: number;
} | {
  type: EContentType.Canvas;
  id: string;
  cid?: never;
  users: {
    primary: BasicUser;
    secondary?: never;
  },
  imagePath: string;
  description?: string;
  stars: number;
  starred: boolean;
  utcTime: number;
};
