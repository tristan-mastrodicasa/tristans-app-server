import passport from 'passport';
import facebook from 'fb';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import Response from '../util/ResponseUtil';

export const postSignUp = (req, res) => {
  const facebook_access_token = req.body.access_token;
  let responseObj = new Response();

  facebook.api('me', {
    fields: ['first_name', 'last_name', 'id'],
    access_token: facebook_access_token,
  }, async function(response) {
    if (response.error) {

      responseObj.addError({
        message: response.error.message,
        reason: 'You access token is null or expired',
      });

      return res.send(responseObj.output);

    }
    const isRegistered = await UserModel.findOne({fbid: response.id});

    if (!isRegistered) {
      const user = await UserModel.create({
        fbid: response.id,
        firstname: response.first_name,
        lastname: response.last_name,
      });

      responseObj.addContent({
        completed: true,
        message: 'Registration completed',
        user,
      });

      return res.send(responseObj.output);

    } else {

      responseObj.addError({
        message: 'You are already registered with this facebook account'
      });

      return res.send(responseObj.output);

    }
  });
};

export const postLogin = (req, res) => {
  const facebook_access_token = req.body.access_token;
  let responseObj = new Response();

  facebook.api('me', {
    fields: ['id'],
    access_token: facebook_access_token,
  }, async function(response) {
    if (response.error) {

      responseObj.addError({
        message: response.error.message,
        reason: 'You access token is null or expired',
      });

      return res.send(responseObj.output);

    }

    const isUserFound = await UserModel.findOne({fbid: response.id});
    if (isUserFound) {
      const jwt_token = jwt.sign(isUserFound.toJSON(), 'secretkey');

      responseObj.addContent({
        message: 'Login completed',
        jwt_token,
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
