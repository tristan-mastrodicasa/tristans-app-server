import crypto from 'crypto';
import { Canvas } from 'database/entities/canvas.entity';
import { EVisibility } from 'shared/models';
import { createNewCanvas } from 'shared/helpers';

/**
 * Create a phony canvas
 * @param  userid User to link the canvas too
 * @return        canvas id
 */
export async function getPhonyCanvas(userid: number): Promise<Canvas> {

  // Generate a phony canvas //
  const canvas = new Canvas();
  canvas.imagePath = `${(+new Date())}.jpg`; // unique image path
  canvas.mimetype = 'image/jpeg';
  canvas.visibility = EVisibility.public; // Only public to start
  canvas.uniqueKey = crypto.randomBytes(32).toString('hex');

  return createNewCanvas(canvas, userid);

}
