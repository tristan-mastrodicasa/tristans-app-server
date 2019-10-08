/**
 * An interface to describe the different available user settings
 */
export interface IUserSettings {
  notifications: {
    canvasInvites: boolean;
    subscriptionUploadedACanvas: boolean;
    userMemedMyCanvas: boolean;
    pointsUpdate: boolean;
  };
}
