import { IUserItem } from 'shared/models';
import { User } from 'database/entities/user.entity';
import { UserNetwork } from 'database/entities/user-network.entity';
import { checkForActiveCanvases, buildImageUrl } from 'shared/helpers';

/**
 * Get a network of users for a specific user
 *
 * @todo When reaching production allow pagination for whole user list
 * @todo When ordering by canvas do it before getting the most recent users (in prod)
 *
 * @param  networkType The followers or following etc
 * @param  userid      The user to get the network from
 * @return             List of user items to send to the client
 */
export async function getUserNetwork(networkType: 'followers' | 'following' | 'follow-backs', userid: number): Promise<IUserItem[]> {

  let user: User;

  if (networkType === 'followers') {
    user = await User.findOne(userid, { relations: ['followers', 'followers.follower', 'followers.follower.statistics'] });
  } else if (networkType === 'following') {
    user = await User.findOne(userid, { relations: ['following', 'following.user', 'following.user.statistics'] });
  } else if (networkType === 'follow-backs') {

    const followBackList: UserNetwork[] = [];

    user = await User.findOne(userid, { relations: ['following', 'following.user', 'following.user.statistics'] });
    for (const networkRecord of user.following) {
      // Does the subscription follow you? //
      if (await UserNetwork.findOne({ user, follower: networkRecord.user })) followBackList.push(networkRecord);
    }

    user.following = followBackList;
  }

  // Container for user items //
  const userItems: IUserItem[] = [];

  let network = (networkType === 'followers' ? user.followers : user.following);

  // Sort by UTC decending (newest follower first) //
  network.sort((a, b) => {
    return +b.utc - +a.utc;
  });

  // Limit 150 users //
  network = network.splice(0, 150);

  // compile user items and ship //
  for (const record of network) {

    const user = (networkType === 'followers' ? record.follower : record.user);

    userItems.push({
      id: user.id,
      firstName: user.firstName,
      username: user.username,
      photo: buildImageUrl('user', user.profileImg),
      influence: user.statistics.influence,
      activeCanvases: await checkForActiveCanvases(user.id),
    });
  }

  // Move those with active canvases to display first //
  userItems.sort((a, b) => {
    return b.activeCanvases - a.activeCanvases;
  });

  return userItems;

}
