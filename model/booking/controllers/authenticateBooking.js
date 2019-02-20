const jwt = require(`jsonwebtoken`)
const responses = require(`../../../routes/responses`)
const config = require(`config`)
exports.authenticate = async(req, res, next)=> {
  try {
    const token = req.header(`access_token`)
    if (!token) return responses.authenticationError(res, {}, "Access Denied")                            // If the token is not there, we don`t let manipulation in database

    try {
      const decoded = jwt.verify(token, config.get(`jwtPrivateKeyCustomer`));                  // Only verified users will be able to manipulate data
      req.tokenEmail= decoded.email;
      next();
    }
    catch (ex) {
      responses.authenticationError(res, {}, "Invalid Token");
    }
  }
  catch (error) {
    responses.authenticationError(res,{}, "Authentication Unsucessfull")
  }
}