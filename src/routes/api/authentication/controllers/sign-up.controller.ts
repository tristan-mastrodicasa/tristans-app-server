import facebook from 'fb';
import UserModel from '../../../../models/user.model';
import ResponseFormat from '../../../../util/response-format.util';

export const postSignup = (req, res, next) => {

  // Verify the request //
  const facebookAccessToken = req.body.access_token;

  if (!facebookAccessToken) throw { message: 'Missing Facebook Access Token', status: 400 };

  facebook.api('me', { fields: ['first_name', 'last_name', 'id'], access_token: facebookAccessToken }, async (response) => {

    if (response.error) next({ message: response.error.message, status: 200 });
    else {

      const isRegistered = await UserModel.findOne({ fbid: response.id });

      if (!isRegistered) {

        // Fix the user sign up //
        const user = await UserModel.create({
          fbid: response.id,
          firstName: response.first_name,
        });

        const responseObj = new ResponseFormat();

        responseObj.addContent({ user });

        return res.send(responseObj.output);

      } else next({ message: 'You are already registered with this facebook account', status: 200 });

    }

  });

};
