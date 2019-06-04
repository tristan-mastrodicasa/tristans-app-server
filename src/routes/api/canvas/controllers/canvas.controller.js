import CanvasModel from '../../../../models/canvas.model';
import UserModel from '../../../../models/user.model';
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

/**
 * Create a new canvas
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON of the created canvas
 */
export const postCanvas = async (req, res) => {

  const { uid, description, imagePath, visibility, stars, utcTime } = req.body;
  const response = new Response();

  try {

    // Check if the UID is an existing user
    const userExist = await UserModel.findById(uid);
    if (userExist) {

      const canvas = await CanvasModel.create({ uid, description, imagePath, visibility, stars, utcTime });

      response.addContent({ canvas: canvas });
      response.setState(201); // Canvas created -> 201 code assigned to response

    } else {

      response.addError({
        error: 'UID is not a assigned to any user',
      });

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.getState()).send(response.getOutput());

};
