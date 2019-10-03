import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { EInfluence } from 'shared/models';
import { checkReactionToCanvas } from './';

/**
 * Manage reacts to a canvas
 * @param  action   Add or remove star
 * @param  canvasId Canvas id to react to
 * @param  userId   The user who is reacting to the canvas
 */
export async function canvasReactmanager(action: 'add' | 'remove', canvasId: number, userId: number): Promise<void> {

  // Check react status //
  const hasReacted = await checkReactionToCanvas(canvasId, userId);

  // Do nothing if the action has already occured //
  if (hasReacted && action === 'add') return;
  if (!hasReacted && action === 'remove') return;

  const user = await User.findOne(userId);
  const canvas = await Canvas.findOne(canvasId, { relations: ['user'] });

  // Increase canvas star stats //
  canvas.stars += (action === 'remove' ? -1 : 1);
  await canvas.save();

  // Increase influence of the canvas owner //
  const canvasOwner = await User.findOne(canvas.user.id, { relations: ['statistics'] });
  canvasOwner.statistics.influence += (action === 'remove' ? -EInfluence.star : EInfluence.star);
  await canvasOwner.statistics.save();

  if (action === 'add') {

    const reactsRecord = new CanvasReacts();
    reactsRecord.canvas = canvas;
    reactsRecord.user = user;
    await reactsRecord.save();

  } else if (action === 'remove') {

    const reactsRecord = await CanvasReacts.findOne({ user, canvas });
    reactsRecord.remove();

  }

}
