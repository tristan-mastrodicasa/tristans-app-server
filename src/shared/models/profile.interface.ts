import { BasicUser } from './basic-user.interface';

/**
 * An interface suited more for a more comprehensive set of information
 */
export interface Profile extends BasicUser {
  influence: number;
  followers: number;
  contentNumber: number;
}
