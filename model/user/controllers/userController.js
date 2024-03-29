/*
 * Author : Shubham Negi
 * =====================
 * all the working of user model is in this file with all responses 
 */

const responses = require(`../../../routes/responses`);
const userServices = require(`../services/userServices`);
const generateToken = require(`../../../utilities/generateToken`);
const alreagyLogin = require(`../../../utilities/alreadyLogin`);
const userLogout = require(`../../../routes/logOut`)


/** 
* @function <b> addCustomer </b> <br> 
* adds user to database 
* @param {object}  req(name, password, email), response object
* @return {void}
*/
const addCustomer = Promise.coroutine(function* (req, res) {
  if (req.body.password != req.body.confirmPassword)
    return responses.authenticationError(
      res,
      { "error": "bad request" },
      "password and confirm password doesn`t match"
    );

  try {
    const check = yield userServices.checkEmail(req);
    if (check) return responses.alreadyReported(res, { "info": "email exists" }, "Already Registered");

    else {
      const token = generateToken.token(req, "jwtPrivateKeyCustomer");
      const add = yield userServices.addCustomer(req.body, token);
      responses.actionCompleteResponse(res, { token: token, name : req.body.first_name, "phone number" : req.body.phone_number, email : req.body.email }, "WELCOME ABROAD");
    }
  } catch (error) {
    responses.notAcceptable(res, { "error": "technical error" }, "Technical issue with database");
  }
});

/** 
* @function <b> authenticateCustomer </b> <br> 
* authenticates customer 
* @param {object} req, res 
* @return {void} 
*/
const authenticateCustomer = Promise.coroutine(function* (req, res) {
  const isThere = yield userServices.findCustomer(req);
  if (!isThere)
    return responses.authenticationError(
      res,
      { "error": "bad request" },
      "Wrong Credentials!! Pls try again"
    );

  const isLogin = yield alreagyLogin.isLogin(req, "customer");

  if (isLogin)
    return responses.alreadyReported(
      res,
      { token: isLogin },
      "Already Login !!"
    );

  const token = generateToken.token(req, "jwtPrivateKeyCustomer");
  const result = yield userServices.addToken(req.body, token);
  responses.actionCompleteResponse(
    res,
    { token: token },
    "SUCCESSFULLY LOGGED IN"
  );
});

const logout = Promise.coroutine(function* (req, res) {
  try {
    const result = yield userLogout.logOut("customer", req.tokenEmail)
    responses.actionCompleteResponse(res, result, "SUCESSFULLY LOGGED OUT ")
  }
  catch (error) {
    responses.notAcceptable(res, error, "couldnt process with the request")
  }

})

module.exports = { addCustomer, authenticateCustomer, logout };