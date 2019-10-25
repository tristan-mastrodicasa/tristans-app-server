import axios from 'axios';
import { User } from 'database/entities/user.entity';
import { UserNetwork } from 'database/entities/user-network.entity';
import env from 'conf/env';

export class NotificationManager {

  /**
   * Send a user a push notification about their influence points situation
   * @param  userid To send the notification too
   * @param  points Number of points the users has
   */
  public static async sendPointsPushNotification(userid: number, points: number): Promise<void> {

    const user = await User.findOne(userid, { relations: ['mobileDevice', 'settings'] });

    // Check if a device is registered //
    if (!user || !user.mobileDevice || !user.mobileDevice.deviceId) return;

    // Check if the user(s) have enabled push notifications for this event //
    if (!user.settings.nPointsUpdate) return;

    axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: env.push_service_id,
        include_player_ids: [user.mobileDevice.deviceId],
        headings: { en: 'Congratulations!' },
        contents: { en: `You have surpassed ${new Intl.NumberFormat().format(points)} influence points` },
        small_icon: 'ic_stat_onesignal_default',
        android_accent_color: 'FFFF9933',
        data: { page: `/profile/${userid}` },
      },
      {
        headers: {
          Authorization: `Basic ${env.push_service_secret}`,
        },
      },
    );
  }

  /**
   * Send a user a push notification when another users memes their canvas
   * @param  userid         To send the notification too
   * @param  canvasid       Canvas that was memed
   * @param  contentCreator Username of the user who created a meme
   */
  public static async sendUserCreatedMemePushNotification(userid: number, canvasid: number, contentCreator: string): Promise<void> {

    const user = await User.findOne(userid, { relations: ['mobileDevice', 'settings'] });

    // Check if a device is registered //
    if (!user || !user.mobileDevice || !user.mobileDevice.deviceId) return;

    // Check if the user(s) have enabled push notifications for this event //
    if (!user.settings.nUserMemedMyCanvas) return;

    axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: env.push_service_id,
        include_player_ids: [user.mobileDevice.deviceId],
        headings: { en: 'New Meme' },
        contents: { en: `${contentCreator} created a meme from your canvas` },
        small_icon: 'ic_stat_onesignal_default',
        android_accent_color: 'FFFF9933',
        data: { page: `/canvas/${canvasid}` },
      },
      {
        headers: {
          Authorization: `Basic ${env.push_service_secret}`,
        },
      },
    );
  }

  /**
   * Send the followers of a content creator a notification that they uploaded a canvas
   * @param  contentCreator The user who uploaded the canvas
   * @param  canvasid       Canvas that was created
   */
  public static async sendUploadedCanvasPushNotifications(contentCreator: User, canvasid: number): Promise<void> {

    const networkRecords = await UserNetwork.find({
      relations: ['follower'],
      where: {
        user: contentCreator,
      },
      take: 2000,
    });

    const subscriptionList: string[] = [];

    // Compile a list of users to notify based on their settings //
    for (const record of networkRecords) {
      const user = await User.findOne(record.follower.id, { relations: ['mobileDevice', 'settings'] });

      // Check if a device is registered //
      if (!user || !user.mobileDevice || !user.mobileDevice.deviceId) continue;

      // Check if the user(s) have enabled push notifications for this event //
      if (!user.settings.nSubscriptionUploadedACanvas) continue;

      subscriptionList.push(user.mobileDevice.deviceId);

    }

    if (subscriptionList.length === 0) return;

    axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: env.push_service_id,
        include_player_ids: subscriptionList,
        headings: { en: 'Canvas Uploaded' },
        contents: { en: `${contentCreator.username} uploaded a new canvas` },
        small_icon: 'ic_stat_onesignal_default',
        android_accent_color: 'FFFF9933',
        data: { page: `/canvas/${canvasid}` },
      },
      {
        headers: {
          Authorization: `Basic ${env.push_service_secret}`,
        },
      },
    );
  }

}
