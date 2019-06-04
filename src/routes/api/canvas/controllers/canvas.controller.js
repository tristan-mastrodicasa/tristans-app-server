import CanvasModel from '../../../../models/canvas.model';
import Response from '../../../../util/response.util';

/**
 * Return a list of canvas
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON including all canvas
 */
export const getCanvas = async (req, res) => {

  const response = new Response();
  const canvas = await CanvasModel.find().catch((error) => {

    response.addError(error);

  });

  response.addContent({ canvas: canvas });

  return res.status(response.getState()).send(response.getOutput());

};
