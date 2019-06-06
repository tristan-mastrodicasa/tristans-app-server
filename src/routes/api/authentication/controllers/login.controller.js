import facebook from 'fb';
import jwt from 'jsonwebtoken';
import UserModel from '../../../../models/user.model';
import Response from '../../../../util/response.util';

export const login = (req, res) => {

  const facebookAccessToken = req.body.access_token;
  const responseObj = new Response();

  facebook.api('me', {
    fields: ['id'],
    access_token: facebookAccessToken,
  }, async function(response) {

    if (response.error) {

      responseObj.addError({
        message: response.error.message,
        reason: 'You access token is null or expired',
      });

      return res.send(responseObj.output);

    }

    const isUserFound = await UserModel.findOne({ fbid: response.id });

    if (isUserFound) {

      const jwtToken = jwt.sign(isUserFound.toJSON(), 'secretkey');

      responseObj.addContent({
        message: 'Login completed',
        jwtToken,
      });

      return res.send(responseObj.output);

    } else {

      responseObj.addError({
        message: 'FacebookID is not found in the database',
      });

      return res.send(responseObj.output);

    }

  });

};
