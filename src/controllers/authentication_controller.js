import passport from 'passport';

export const getLoginFacebook = (req, res, next) => {
  console.log('in');
  passport.authenticate('facebook', (error, user, info) => {
    console.log('ina');
    if (error) throw error;
    req.login(user, (error) => {
      console.log('Creating session with facebook login info');
    });
  })(req, res, next);
};

export const getFacebookTest = (req, res) => {
  return res.send(`You are authenticated with facebook bro and you know which is your token? Is this bro: ${req.user.facebook.accessToken}`);
};

export const getLogout = (req, res) => {
  req.session.destroy(function(err) {
    return res.send('Logged out bitch');
  });
};
