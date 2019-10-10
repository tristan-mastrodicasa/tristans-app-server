import { User } from 'database/entities/user.entity';

/**
 * Check how many active canvases a user has
 * @param  userid The user to check
 * @return        Number of active canvases
 */
export async function checkForActiveCanvases(userid: number): Promise<number> {

  const user = await User.findOne(userid, { relations: ['canvases'] });

  let canvasCounter = 0;

  user.canvases.forEach((canvas) => {
    if (+canvas.utc > (new Date().setDate((new Date().getDate() - 1)))) canvasCounter += 1;
  });

  return canvasCounter;
}
