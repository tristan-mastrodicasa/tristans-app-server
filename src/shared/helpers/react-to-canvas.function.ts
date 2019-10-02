import { User } from 'database/entities/user.entity';
import { Canvas } from 'database/entities/canvas.entity';
import { CanvasReacts } from 'database/entities/canvas-reacts.entity';
import { EInfluence } from 'shared/models';
import { checkReactionToCanvas } from './';

/**
 * React to a canvas if the user has not already done so
 * @param  canvasId Canvas id to react to
 * @param  userId   The user who is reacting to the canvas
 */
export async function reactToCanvas(canvasId: number, userId: number): Promise<void> {

  // Onlys react the canvas if not already done //
  if (! await checkReactionToCanvas(canvasId, userId)) {

    const user = await User.findOne(userId);
    const canvas = await Canvas.findOne(canvasId, { relations: ['user'] });

    // Increase canvas star stats //
    canvas.stars += 1;
    await canvas.save();

    // Increase influence of the canvas owner //
    const canvasOwner = await User.findOne(canvas.user.id, { relations: ['statistics'] });
    canvasOwner.statistics.influence += EInfluence.star;
    await canvasOwner.statistics.save();

    const reactsRecord = new CanvasReacts();
    reactsRecord.canvas = canvas;
    reactsRecord.user = user;
    await reactsRecord.save();

  }

}
