import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { EInfluence } from 'shared/models';
import { userInfluenceManager } from 'shared/helpers';

/**
 * Manage reacts to a canvas
 * @param  action   Add or remove star
 * @param  canvasId Canvas id to react to
 * @param  userId   The user who is reacting to the canvas
 */
export async function canvasReactManager(action: 'add' | 'remove', canvasId: number, userId: number): Promise<void> {

  const user = await User.findOne(userId);
  const canvas = await Canvas.findOne(canvasId, { relations: ['user'] });

  // Check react status //
  const hasReacted = await CanvasReacts.findOne({ canvas, user });

  // Do nothing if the action has already occured //
  if (hasReacted && action === 'add') return;
  if (!hasReacted && action === 'remove') return;

  if (action === 'add') {

    const reactsRecord = new CanvasReacts();
    reactsRecord.canvas = canvas;
    reactsRecord.user = user;
    await reactsRecord.save();

  } else if (action === 'remove') {

    const reactsRecord = await CanvasReacts.findOne({ user, canvas });
    await reactsRecord.remove();

  }

  // Update canvas star stats //
  canvas.stars = await CanvasReacts.count({ where: { canvas: canvasId } });
  await canvas.save();

  // Canvas owner cannot get influence from reacting own content //
  if (canvas.user.id !== userId) {

    // Update influence of the canvas owner //
    await userInfluenceManager(action, canvas.user.id, EInfluence.star);

  }

}
