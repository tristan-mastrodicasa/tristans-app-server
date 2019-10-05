import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { EInfluence } from 'shared/models';

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
