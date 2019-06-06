import MemeModel from '../../../../models/meme.model';
import CanvasModel from '../../../../models/canvas.model';
import UserModel from '../../../../models/user.model';
import Response from '../../../../util/response.util';
import {
  UID_NOT_FOUND,
  CID_NOT_FOUND,
  MID_NOT_FOUND,
} from '../../../../util/errors.util';

/**
 * Return a list of memes
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON including all memes
 */
export const getMemes = async (req, res) => {

  console.log('in');
  const response = new Response();
  const memes = await MemeModel.find().catch((error) => {

    response.addError(error);

  });

  response.addContent({ memes });
  return res.status(response.state).send(response.output);

};

/**
 * Return a Meme by his ID
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @param {ObjectId} id of the meme to search
 * @return {Response} JSON including the meme data
 */
export const getMemeById = async (req, res) => {

  const { id } = req.params;
  const response = new Response();

  const meme = await MemeModel.findById(id).catch((error) => {

    response.addError(error);

  });

  response.addContent({
    meme,
  });

  return res.status(response.state).send(response.output);

};

/**
 * Create a new meme
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @param {ObjectId} id of the meme to search
 * @return {Response} JSON including the created meme
 */
export const postMeme = async (req, res) => {

  const response = new Response();
  const { body } = req;
  const { cid, uid } = body;

  try {

    const userExist = await UserModel.findById(uid);
    const canvasExist = await CanvasModel.findById(cid);

    // Check if the CID and UID exists
    if (userExist && canvasExist) {

      const meme = await MemeModel.create(body);

      response.addContent({ meme: meme });
      response.state = 201; // -> HTTP CODE 201 FOR CREATED RESOURCE

    } else {

      throw userExist ? CID_NOT_FOUND : UID_NOT_FOUND; // Validation failed, return error

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.state).send(response.output);

};

/**
 * Updated a meme given an id
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON with the updated meme
 */
export const postUpdateMemeById = async (req, res) => {

  const response = new Response();
  const { id } = req.params;
  const { body } = req;

  try {

    const isUpdated = await MemeModel.findByIdAndUpdate(id, body, { new: true });

    // Canvas found and updated
    if (isUpdated) {

      response.addContent({ updated: true, meme: isUpdated });

    } else {

      throw MID_NOT_FOUND; // Canvas id is not found

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.state).send(response.output);

};

/**
 * Delete a meme given an id
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON with deleted info
 */
export const deleteMemeById = async (req, res) => {

  const response = new Response();
  const { id } = req.params;

  try {

    const isDeleted = await MemeModel.findByIdAndDelete(id);

    // Check if an meme is return from the search
    if (isDeleted) {

      response.addContent({ deleted: true });

    } else {

      throw MID_NOT_FOUND; // Meme id is not found

    }

  } catch (error) {

    response.addError(error);

  }

  return res.status(response.state).send(response.output);

};
