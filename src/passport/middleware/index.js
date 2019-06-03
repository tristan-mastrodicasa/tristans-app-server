export const isAuthenticated = (req, res, next) => {

  if (req.isAuthenticated()) {

    return next();

  };

  return res.send('You are not authenticated bitch');

};
