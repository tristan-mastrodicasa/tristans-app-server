/**
 * Interfaces and types to define data structures
 */

import { EContentType } from './enums'; //tslint:disable-line

/**
 * Interface for a basic user object
 */
interface BasicUser {
  id: string;
  firstName: string;
  username: string;
  photo: string;
}

/**
 * An interface suited more for a more comprehensive set of information
 */
export interface Profile extends BasicUser {
  influence: number;
  followers: number;
  contentNumber: number;
}

/**
 * An interface for small user objects to be returned in searches in the database
 */
export interface UserItem extends BasicUser {
  influence: number;
  activeCanvases?: number; // Number of active canvases
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

/** How the jwt will be formatted */
export interface JwtContent { id: number; }
