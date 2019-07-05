import facebook from 'fb';
import jwt from 'jsonwebtoken';
import UserModel from '../../../../models/user.model';
import ResponseFormat from '../../../../util/response-format.util';

export const postLogin = (req, res, next) => {

  // Verify the request //
  const facebookAccessToken = req.body.access_token;

  if (!facebookAccessToken) throw { message: 'Missing Facebook Access Token', status: 400 };

  // Authenticate with facebook //
  facebook.api('me', { fields: ['id'], access_token: facebookAccessToken, }, async (response) => {

    if (response.error) next({ message: response.error.message, status: 200 });
    else {

      const isUserFound = await UserModel.findOne({ fbid: response.id });

      if (isUserFound) {

        const jwtToken = jwt.sign(isUserFound.toJSON(), 'secretkey');

        const responseObj = new ResponseFormat();

        responseObj.addContent({ jwtToken });

        return res.send(responseObj.output);

      } else next({ message: 'Facebook ID is not found in the database', status: 200 });

    }

  });

};
