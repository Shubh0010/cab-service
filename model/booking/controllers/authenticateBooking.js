/*
 * Author : Shubham Negi
 * =====================
 * this file authenticates if the user is valid 
 */

const jwt = require(`jsonwebtoken`);
const responses = require(`../../../routes/responses`);
const config = require(`config`);
exports.authenticate = Promise.coroutine(function* (req, res, next) {
  try {
    const token = req.header(`access_token`);
    if (!token) return responses.authenticationError(res, {}, "Access Denied");

    try {
      const decoded = jwt.verify(token, config.get(`jwtPrivateKeyCustomer`));
      req.tokenEmail = decoded.email;
      next();
    } catch (ex) {
      responses.authenticationError(res, { "error": "bad request" }, "Invalid Token");
    }
  } catch (error) {
    responses.authenticationError(res, { "error": "bad request" }, "Authentication Unsucessful");
  }
});
