/*
 * Author : Shubham Negi
 * =====================
 * all the working of admin is in this file with all responses 
 */

const responses = require(`../../../routes/responses`);
const adminServices = require(`../services/adminServices`);
const alreagyLogin = require(`../../../utilities/alreadyLogin`);
const generateToken = require("../../../utilities/generateToken");
const jwt = require(`jsonwebtoken`);
const config = require("config");
const moment = require(`moment`);

exports.authenticateLogin = Promise.coroutine(function* (req, res) {

  const isThere = yield adminServices.findAdmin(req);
  if (!isThere)
    return responses.authenticationError(
      res,
      { "Error": "Bad Request" },
      "Wrong Credentials!! Pls try again"
    );

  const isLogin = yield alreagyLogin.isLogin(req, "admin");

  if (isLogin)
    return responses.actionCompleteResponse(
      res,
      { token: isLogin },
      "Already Login !!"
    );

  const token = generateToken.token(req, "jwtPrivateKeyAdmin");
  const result = yield adminServices.addToken(req.body, token);

  responses.actionCompleteResponse(
    res,
    { token: token },
    "SUCCESSFULLY LOGGED IN"
  );
});

exports.authenticateAdmin = Promise.coroutine(function* (req, res, next) {
  try {
    const token = req.header(`access_token`);
    if (!token) return responses.authenticationError(res, { "data": "please provide access token" }, "Access Denied");

    try {
      const decoded = jwt.verify(token, config.get(`jwtPrivateKeyAdmin`));
      req.tokenEmail = decoded.email;
      next();
    } catch (ex) {
      responses.authenticationError(res, { "error": "Bad Request" }, "Invalid Token");
    }
  } catch (error) {
    responses.authenticationError(res, { "error": "Bad Request" }, "Authentication Unsucessful");
  }
});

exports.assignDriver = Promise.coroutine(function* (req, res, next) {
  try {
    const invalidBooking = yield adminServices.invalidBooking(req);
    if (invalidBooking)
      return responses.actionCompleteResponse(res, { "error": "Bad Request" }, "Invalid Booking");

    const isComplete = yield adminServices.isBookingComplete(req);
    if (isComplete)
      return responses.actionCompleteResponse(res, { "response": isComplete }, "Already Assigned");

    const driverId = yield adminServices.findDriver();
    if (driverId == -1)
      return responses.actionCompleteResponse(res, { "response": "couldn't get any driver" }, "All driver are busy");

    const result = yield adminServices.changeDriverStatus(driverId);                          // if any driver is free assign driver to it by changing status of driver from 0 (available) to 1 (busy) 
    const data = yield adminServices.changeBookingStatus(req, driverId);                      // and booking status from 0 (pending) to 1(ongoing)

    const date = moment().format("MMMM Do YYYY, h:mm:ss a");
    const bookingId = parseInt(req.body.booking_id)
    const logs = [
      `Admin with email "${req.tokenEmail}" assigned driver with driver id "${driverId}" at "${date}"`
    ];
    const logData = logs.toString();
    dbo                                                                                       // log array of collection is updated to store assign information 
      .collection("booking_logs")
      .update(
        { booking_id: booking_id },
        { $push: { logs: logData } }
      );

    responses.actionCompleteResponse(res, { "driverId": driverId }, "ASSIGNED SUCCESSFULLY");
  } catch (error) {
    console.log(error);
    responses.authenticationError(
      res,
      {},
      "Couldn`t assign your booking.... please try again Later!!!!!!!"
    );
  }
});

exports.getAllBookings = Promise.coroutine(function* (req, res, next) {
  try {
    const result = yield adminServices.getAllBookings(req);
    responses.actionCompleteResponse(res, result, "All Bookings");
  } catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings");
  }
});

exports.getAllAssignedBookings = Promise.coroutine(function* (req, res, next) {
  try {
    const result = yield adminServices.getAllAssignedBookings(req);
    responses.actionCompleteResponse(res, result, "All Assigned Bookings");
  } catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings");
  }
});

exports.getAllUnAssignedBookings = Promise.coroutine(function* (req, res, next) {
  try {
    const result = yield adminServices.getAllUnAssignedBookings(req);
    responses.actionCompleteResponse(res, result, "All Unassigned Bookings");
  } catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings");
  }
});