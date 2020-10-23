const jwt = require('jsonwebtoken');

// next() is called if there were no errors
module.exports = (req, res, next) => {
  /**
   * expecting a token from the body
   * .verify(token, secret key, option, callback)
   * because verify will throw an Error if it fails
   * need a try catch block
   * 
   * the token is usually sent in the headers so we access it by req.headers.authentication
   * when making requests tokens go after "Bearer" (eg. Bearer some_token_string_etc)
   */
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_key);
    // adding the decoded token to the request
    req.userData = decoded;
    next();
  } catch (error) {
    // 401 - unauthenticated
    return res.status(401).json({
      message: 'Authentication failed',
    });
  }
};
