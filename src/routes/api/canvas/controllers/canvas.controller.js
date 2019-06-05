import CanvasModel from '../../../../models/canvas.model';
import UserModel from '../../../../models/user.model';
import Response from '../../../../util/response.util';
import {
  CID_NOT_FOUND,
  UID_NOT_FOUND,
} from '../../../../util/errors.util';

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
 * Get a canvas given an id
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON of found canvas
 */
export const getCanvasById = async (req, res) => {

  const { id } = req.params;
  const response = new Response();

  try {

    const canvas = await CanvasModel.findById(id);
    response.addContent({ canvas });

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.getState()).send(response.getOutput());

};

/**
 * Create a new canvas
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON of the created canvas
 */
export const postCanvas = async (req, res) => {

  const { body } = req;
  const { uid } = body;
  const response = new Response();

  try {

    // Check if the UID is an existing user
    const userExist = await UserModel.findById(uid);
    if (userExist) {

      const canvas = await CanvasModel.create(body);

      response.addContent({ canvas: canvas });
      response.setState(201); // Canvas created -> 201 code assigned to response

    } else {

      throw UID_NOT_FOUND; // UID is not found

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.getState()).send(response.getOutput());

};

/**
 * Updated a canvas given an id
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON of the created canvas
 */
export const postUpdateCanvasById = async (req, res) => {

  const { id } = req.params;
  const { body } = req;
  const response = new Response();

  try {

    const isUpdated = await CanvasModel.findByIdAndUpdate(id, body, { new: true });

    // Canvas found and updated
    if (isUpdated) {

      response.addContent({ updated: true, canvas: isUpdated });

    } else {

      throw CID_NOT_FOUND; // Canvas id is not found

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.getState()).send(response.getOutput());

};

/**
 * Delete a canvas given an id
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON with deleted info
 */
export const deleteCanvasById = async (req, res) => {

  const { id } = req.params;
  const response = new Response();

  try {

    const isDeleted = await CanvasModel.findByIdAndDelete(id);

    // Check if an canvas is return from the search
    if (isDeleted) {

      response.addContent({ deleted: true });

    } else {

      throw CID_NOT_FOUND; // Canvas id is not found

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.getState()).send(response.getOutput());

};
