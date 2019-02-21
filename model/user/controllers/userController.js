/*
 * Author : Shubham Negi
 * =====================
 * all the working of user model is in this file with all responses 
 */

const responses = require(`../../../routes/responses`);
const userServices = require(`../services/userServices`);
const generateToken = require(`../../../utilities/generateToken`);
const alreagyLogin = require(`../../../utilities/alreadyLogin`);

const addCustomer = Promise.coroutine(function* (req, res) {
  if (req.body.password != req.body.confirmPassword)
    return responses.authenticationError(
      res,
      { "error": "bad request" },
      "password and confirm password doesn`t match"
    );

  try {
    const check = yield userServices.checkEmail(req);
    if (check) return responses.authenticationError(res, { "info": "email exists" }, "Already Registered");

    else {
      const token = generateToken.token(req, "jwtPrivateKeyCustomer");
      const add = yield userServices.addCustomer(req.body, token);
      responses.actionCompleteResponse(res, { token: token }, "WELCOME ABROAD");
    }
  } catch (error) {
    responses.authenticationError(res, { "error": "technical error" }, "Technical issue with database");
  }
});

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
    return responses.actionCompleteResponse(
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

module.exports = { addCustomer, authenticateCustomer };