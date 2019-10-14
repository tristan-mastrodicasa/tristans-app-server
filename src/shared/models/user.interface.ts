/**
 * Interface for the user resource
 */
export interface IUser {
  id: number;
  firstName: string;
  username: string;
  photo: string;
  influence: number;
  followers: number;
  contentNumber: number;
  activeCanvases: number; // Number of active canvases
}
