/**
 * Global enums for the project
 */

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
  Meme = 'meme',
}

/**
 * Enum for the actions that can be taken on a canvas
 */
export enum ECanvasActions {
  starred,
}

/**
 * Enum for the actions that can be taken on a meme
 */
export enum EMemeActions {
  updated,
  starred,
}

/**
 * Enum for the actions that can be taken on a profile
 */
export enum EProfileActions {
  profileUpdate,
}
