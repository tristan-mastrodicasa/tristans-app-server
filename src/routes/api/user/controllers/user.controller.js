import UserModel from '../../../../models/user.model';
import Response from '../../../../util/response.util';

/**
 * Return a list of users
 * @param {Request} req incoming request
 * @param {Response} res out response
 * @return {Response} JSON including all users
 */
export const getUsers = async (req, res) => {

  const response = new Response();
  const users = await UserModel.find().catch((error) => {

    response.addError(error);

  });

  response.addContent({ users: users });

  return res.status(response.state).send(response.output);

};
