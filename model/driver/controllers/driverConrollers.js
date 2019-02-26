/*
 * Author : Shubham Negi
 * =====================
 * all the working of driver is in this file with all responses 
 */

const moment = require("moment");
const responses = require(`../../../routes/responses`);
const driverServices = require(`../services/driverServices`);
const generateToken = require(`../../../utilities/generateToken`);
const alreagyLogin = require(`../../../utilities/alreadyLogin`);
const jwt = require(`jsonwebtoken`);
const config = require(`config`);
const driverLogout = require(`../../../routes/logOut`)


/** 
* @function <b> addDriver </b> <br> 
* adds driver to database 
* @param {object(req), object(res)}   
* @return void
*/
const addDriver = Promise.coroutine(function* (req, res) {
  if (req.body.password != req.body.confirmPassword)
    return responses.notAcceptable(
      res,
      { "error": "bad request" },
      "password and confirm password doesn`t match"
    );

  try {
    const check = yield driverServices.checkEmail(req);
    if (check) return responses.alreadyReported(res, { "info": "email already exist" }, "Already Registered");

    else {
      const token = generateToken.token(req, "jwtPrivateKeyDriver");
      const add = yield driverServices.addDriver(req.body, token);
      responses.actionCompleteResponse(res, { token: token, name : req.body.first_name, "phone number" : req.body.phone_number, email : req.body.email }, "WELCOME ABROAD");
    }
  } catch (error) {
    console.log(error);
    responses.notAcceptable(res, error, "Technical issue with database");
  }
});

/** 
* @function <b> authenticateDriver </b> <br> 
* authenticates driver 
* @param {object(req), object(res)}   
* @return void
*/
const authenticateDriver = Promise.coroutine(function* (req, res) {

  const isThere = yield driverServices.findDriver(req);
  if (!isThere)
    return responses.authenticationError(
      res,
      { "error": "bad request" },
      "Wrong Credentials!! Pls try again"
    );

  const isLogin = yield alreagyLogin.isLogin(req, "driver");
  if (isLogin)
    return responses.alreadyReported(
      res,
      { token: isLogin },
      "Already Login !!"
    );

  const token = generateToken.token(req, "jwtPrivateKeyDriver");
  const result = yield driverServices.addToken(req.body, token);
  responses.actionCompleteResponse(
    res,
    { token: token },
    "SUCCESSFULLY LOGGED IN"
  );
});

/** 
* @function <b> authenticateToken </b> <br> 
* authenticates driver token
* @param {object(req), object(res)}   
* @return void
*/
const authenticateToken = function (req, res, next) {
  try {
    const token = req.header(`access_token`);
    if (!token) return responses.authenticationError(res, {}, "Access Denied"); // If the token is not there, we don`t let manipulation in database

    try {
      const decoded = jwt.verify(token, config.get(`jwtPrivateKeyDriver`)); // Only verified users will be able to manipulate data
      req.tokenEmail = decoded.email;
      next();
    } catch (ex) {
      responses.authenticationError(res, { "error": "bad request" }, "Invalid Token");
    }
  } catch (error) {
    responses.notAcceptable(res, { "error": "bad request" }, "Authentication Unsucessful");
  }
};

/** 
* @function <b> completeRide </b> <br> 
* completes a ride 
* @param {object(req), object(res)}   
* @return void
*/
const completeRide = Promise.coroutine(function* (req, res, next) {
  try {
    const driverId = yield driverServices.findId(req);

    const noBooking = yield driverServices.noBooking(driverId);
    if (noBooking)
      return responses.notAssigned(res, { "info": "...." }, "No Ride To complete");

    const bookingId = yield driverServices.findBookingId(driverId);
    if (!bookingId)
      responses.alreadyReported(
        res,
        { "info": "ALREADY COMPLETED" },
        "This ride is already completed"
      );

    const result = yield driverServices.changeDriverStatus(driverId);

    const data = yield driverServices.changeBookingStatus(req, driverId);

    yield driverServices.addFare(req, bookingId);

    const bId = parseInt(bookingId)
    const date = moment().format("MMMM Do YYYY, h:mm:ss a");
    const logs = [
      `Driver with id "${driverId}" completes the booking at ${date}`
    ];
    const logData = logs.toString();
    dbo                                                                                       // log array of collection is updated to store assign information 
      .collection("booking_logs")
      .update(
        { booking_id: bId },
        { $push: { logs: logData } }
      );

    responses.actionCompleteResponse(res, { "success": `driver with driver id "${driverId}" completed booking "${bookingId}" sucessfully` }, "COMPLETED SUCCESSFULLY");
  } catch (error) {
    responses.notAcceptable(
      res,
      { "error": "technical issue" },
      " couldn`t process the complete request"
    );
  }
});

/** 
* @function <b> getBooking </b> <br> 
* shows current booking 
* @param {object(req), object(res)}   
* @return void
*/
const getBooking = Promise.coroutine(function* (req, res, next) {
  try {
    const result = yield driverServices.getBooking(req);
    responses.actionCompleteResponse(res, result, "Current Booking");
  } catch (error) {
    responses.notAcceptable(res, error, "Couldn`t get bookings");
  }
});

/** 
* @function <b> getAllBooking </b> <br> 
* shows all booking 
* @param {object(req), object(res)}   
* @return void
*/
const getAllBookings = Promise.coroutine(function* (req, res, next) {
  try {
    const result = yield driverServices.getAllBookings(req);
    responses.actionCompleteResponse(res, result, "All Bookings");
  } catch (error) {
    responses.notAcceptable(res, error, "Couldn`t get bookings");
  }
});

const logout = Promise.coroutine(function* (req, res) {
  try {
    const result = yield driverLogout.logOut("driver", req.tokenEmail)
    responses.actionCompleteResponse(res, result, "SUCESSFULLY LOGGED OUT ")
  }
  catch (error) {
    responses.notAcceptable(res, error, "couldnt process with the request")
  }

})

module.exports = {
  addDriver,
  authenticateDriver,
  authenticateToken,
  completeRide,
  getAllBookings,
  getBooking,
  logout
};