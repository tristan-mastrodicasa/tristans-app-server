import CanvasModel from '../../../../models/canvas.model';
import UserModel from '../../../../models/user.model';
import ResponseFormat from '../../../../util/response-format.util';
import {
  CID_NOT_FOUND,
  UID_NOT_FOUND,
} from '../../../../util/errors.util';

/**
 * Return a list of canvas
 * @param req incoming request
 * @param res out response
 * @return JSON including all canvas
 */
export const getCanvas = async (req, res) => {

  const response = new ResponseFormat();
  const canvas = await CanvasModel.find().catch((error) => {

    response.addError(error);

  });

  response.addContent({ canvas: canvas });

  return res.status(response.state).send(response.output);

};

/**
 * Get a canvas given an id
 * @param req incoming request
 * @param res out response
 * @return JSON of found canvas
 */
export const getCanvasById = async (req, res) => {

  const { id } = req.params;
  const response = new ResponseFormat();

  try {

    const canvas = await CanvasModel.findById(id);
    response.addContent({ canvas });

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.state).send(response.output);

};

/**
 * Create a new canvas
 * @param req incoming request
 * @param res out response
 * @return JSON of the created canvas
 */
export const postCanvas = async (req, res) => {

  const { body } = req;
  const { uid } = body;
  const response = new ResponseFormat();

  try {

    // Check if the UID is an existing user
    const userExist = await UserModel.findById(uid);
    if (userExist) {

      const canvas = await CanvasModel.create(body);

      response.addContent({ canvas: canvas });
      response.state = 201; // Canvas created -> 201 code assigned to response

    } else {

      throw UID_NOT_FOUND; // UID is not found

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.state).send(response.output);

};

/**
 * Updated a canvas given an id
 * @param req incoming request
 * @param res out response
 * @return JSON of the created canvas
 */
export const postUpdateCanvasById = async (req, res) => {

  const { id } = req.params;
  const { body } = req;
  const response = new ResponseFormat();

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

  return res.status(response.state).send(response.output);

};

/**
 * Delete a canvas given an id
 * @param eq incoming request
 * @param res out response
 * @return JSON with deleted info
 */
export const deleteCanvasById = async (req, res) => {

  const { id } = req.params;
  const response = new ResponseFormat();

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

  return res.status(response.state).send(response.output);

};
