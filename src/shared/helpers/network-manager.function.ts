import { User } from 'database/entities/user.entity';
import { UserNetwork } from 'database/entities/user-network.entity';

/**
 * Manages the following and unfollowing of users
 * @param  action Follow or unfollow
 * @param  cuid   user who will follow
 * @param  huid   user who is being followed
 */
export async function networkManager(action: 'unfollow' | 'follow', cuid: number, huid: number): Promise<void> {

  const hostUser = await User.findOne(huid, { relations: ['statistics'] });
  const clientUser = await User.findOne(cuid, { relations: ['statistics'] });

  // Check network status //
  const networkRecord = await UserNetwork.findOne({ user: hostUser, follower: clientUser });

  // Action has already occured //
  if (!networkRecord && action === 'unfollow') return;
  if (networkRecord && action === 'follow') return;

  if (action === 'follow') {

    const newNetworkLink = new UserNetwork();
    newNetworkLink.user = hostUser;
    newNetworkLink.follower = clientUser;
    await newNetworkLink.save();

  } else if (action === 'unfollow') {

    await networkRecord.remove();

  }

}
