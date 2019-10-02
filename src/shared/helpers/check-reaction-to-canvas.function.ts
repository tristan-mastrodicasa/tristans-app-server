import { getConnection } from 'typeorm';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';

/**
 * Check if the user has reacted to this canvas
 * @param  canvas Canvas id to check
 * @param  user   User id which has hypothetically reacted to the canvas
 * @return        true is the user has reacted, false otherwise
 */
export async function checkReactionToCanvas(canvasId: number, userId: number): Promise<boolean> {

  const reactCount = await getConnection()
    .getRepository(CanvasReacts)
    .createQueryBuilder('entity')
    .where('userId = :uid AND canvasId = :cid', { uid: userId, cid: canvasId })
    .getCount();

  return (reactCount > 0);

}
