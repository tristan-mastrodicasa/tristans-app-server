import { UserStatistics } from 'database/entities/user-statistics.entity';
import { getConnection } from 'typeorm';

/**
 * Manages the number of submitted content by a user
 * @param  action  Add or remove content numbers
 * @param  userid  The user to act upon
 * @param  content Amount of new content
 */
export async function userContentNumberManager(action: 'add' | 'remove', userid: number, content: number): Promise<void> {
  await getConnection()
    .getRepository(UserStatistics)
    .createQueryBuilder('user_statistics')
    .update(UserStatistics)
    .where('user = :userid', { userid })
    .set({ contentNum: () => `contentNum ${(action === 'remove' ? `- ${content}` : `+ ${content}`)}` })
    .execute();
}
