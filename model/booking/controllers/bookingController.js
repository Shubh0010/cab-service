/*
 * Author : Shubham Negi
 * =====================
 * all the working of booking is in this file with all responses
 */

const bookingServices = require("../services/bookingService");
const responses = require("../../../routes/responses");
const moment = require("moment");

/** 
* @function <b> createsBooking </b> <br> 
* creates a booking 
* @param {object(req), object(res)}   
* @return void
*/
exports.createBooking = Promise.coroutine(function* (req, res) {
  try {
    const id = yield bookingServices.findId(req);                                               // customer_id of the customer who try to creates booking

    const isRiding = yield bookingServices.checkBooking(req, id);                               // we won`t let him/he book if its already booked another ride

    if (isRiding)
      return responses.actionCompleteResponse(
        res,
        { "info": `one ride to customer with customer id "${id}" is already assigned` },
        "Please complete this ride to enjoy another ride !!"
      );

    const booked = yield bookingServices.createBooking(req, id);

    if (booked) {
      const date = moment().format("MMMM Do YYYY, h:mm:ss a");
      const log = [
        `Booking created by customer with customer id "${id}" and customer email "${req.tokenEmail}" at "${date}"`
      ];
      const logData = log.toString();
      yield dbo.collection("booking_logs").insertOne({
        booking_id: booked.insertId,
        logs: [logData]
      });
    }
    return responses.actionCompleteResponse(res, { "result": booked }, "BOOKING CREATED");

  } catch (error) {
    console.log(error);
    responses.authenticationError(res, { "error": "technical issue" }, "Couldn`t assign booking !!");
  }
});

/** 
* @function <b> getBooking </b> <br> 
* shows current booking 
* @param {object(req), object(res)}   
* @return void
*/
exports.getBooking = Promise.coroutine(function* (req, res) {
  try {
    const result = yield bookingServices.getBooking(req);
    responses.actionCompleteResponse(res, result, "Current Booking");
  } catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings");
  }
});

/** 
* @function <b> getAllBooking </b> <br> 
* shows All booking 
* @param {object(req), object(res)}   
* @return void
*/
exports.getAllBookings = Promise.coroutine(function* (req, res) {
  try {
    const result = yield bookingServices.getAllBookings(req);
    responses.actionCompleteResponse(res, result, "All Bookings");
  } catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings");
  }
});