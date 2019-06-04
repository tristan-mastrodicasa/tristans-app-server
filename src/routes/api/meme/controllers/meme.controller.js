import MemeModel from '../../../../models/meme.model';
import Response from '../../../../util/response.util';

/**
 * Return a list of memes
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON including all memes
 */
export const getMemes = async (req, res) => {

  const response = new Response();
  const memes = await MemeModel.find().catch((error) => {

    response.addError(error);

  });

  response.addContent({ memes });

  return res.status(response.getState()).send(response.getOutput());

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

  return res.status(response.getState()).send(response.getOutput());

};
