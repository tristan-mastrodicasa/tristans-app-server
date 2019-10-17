/**
 * Basic User
 */
export interface IBasicUser {
  id: number;
  firstName: string;
  username: string;
  photo: string;
}

/**
 * Info required for profile cards
 */
export interface IProfile extends IBasicUser {
  influence: number;
  followers: number;
  contentNumber: number;
}

/**
 * Info required for useritems
 */
export interface IUserItem extends IBasicUser {
  influence: number;
  youAreFollowing?: boolean;
  activeCanvases?: number; // Number of active canvases
}

/**
 * Comprehensive User interface
 */
export interface IUser extends IProfile, IUserItem {}
