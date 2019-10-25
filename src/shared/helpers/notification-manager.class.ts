import axios from 'axios';
import { User } from 'database/entities/user.entity';
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
        contents: { en: 'You have reached 10,000 influence points' },
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

}
