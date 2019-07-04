import UserModel from '../../../../models/user.model';
import ResponseFormat from '../../../../util/response-format.util';

/**
 * Return a list of users
 * @param req incoming request
 * @param res out response
 * @return JSON including all users
 */
export const getUsers = async (req, res) => {

  const response = new ResponseFormat();
  const users = await UserModel.find().catch((error) => {

    response.addError(error);

  });

  response.addContent({ users: users });

  return res.status(response.state).send(response.output);

};
