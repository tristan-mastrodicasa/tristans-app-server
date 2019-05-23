import passport from 'passport';
import facebook from 'fb';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';

export const postSignUp = (req, res) => {
  const facebook_access_token = req.body.access_token;

  facebook.api('me', {
    fields: ['first_name', 'last_name', 'id'],
    access_token: facebook_access_token,
  }, async function(response) {
    if (response.error) {
      return res.send({
        error: true,
        message: response.error.message,
        reason: 'You access token is null or expired',
      });
    }
    const isRegistered = await UserModel.findOne({fbid: response.id});

    if (!isRegistered) {
      const user = await UserModel.create({
        fbid: response.id,
        firstname: response.first_name,
        lastname: response.last_name,
      });

      return res.send({
        completed: true,
        message: 'Registration completed',
        user,
      });
    } else {
      return res.send({
        error: true,
        message: 'You are already registered with this facebook account',
      });
    }
  });
};

export const postLogin = (req, res) => {
  const facebook_access_token = req.body.access_token;

  facebook.api('me', {
    fields: ['id'],
    access_token: facebook_access_token,
  }, async function(response) {
    if (response.error) {
      return res.send({
        error: true,
        message: response.error.message,
        reason: 'You access token is null or expired',
      });
    }

    const isUserFound = await UserModel.findOne({fbid: response.id});
    if (isUserFound) {
      const jwt_token = jwt.sign(isUserFound.toJSON(), 'secretkey');
      return res.send({
        message: 'Login completed',
        jwt_token,
      });
    } else {
      return res.send({
        error: true,
        message: 'FacebookID is not found in the database',
      });
    }
  });
};
