import { BasicUser } from './basic-user.interface';

/**
 * An interface for small user objects to be returned in searches in the database
 */
export interface UserItem extends BasicUser {
  influence: number;
  activeCanvases?: number; // Number of active canvases
}
