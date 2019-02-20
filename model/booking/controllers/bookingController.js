const bookingServices = require('../services/bookingService')
const responses = require("../../../routes/responses")
exports.createBooking = async (req, res) => {
  //find id of customer
  try {
    const id = await bookingServices.findId(req)

    //already riding ??
    const isRiding = await bookingServices.checkBooking(req, id)

    if (isRiding) return responses.actionCompleteResponse(res, {}, "Please complete this ride to enjoy another ride !!")

    const booked = await bookingServices.createBooking(req, id)

    if (booked) return responses.actionCompleteResponse(res, {}, "BOOKING CREATED")
    responses.authenticationError(res, {}, "Couldn't assign booking!! Pease try again later")

  }
  catch (error) {
    console.log(error)
    responses.authenticationError(res, {}, "Technical issue with Database !!")
  }
}

exports.getBooking = async (req, res, next) => {
  try {
    
    const result = await bookingServices.getBooking(req);
    responses.actionCompleteResponse(res, result, "Current Booking")

  }
  catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings")
  }

}

exports.getAllBookings = async (req, res, next) => {
  try {
    const result = await bookingServices.getAllBookings(req);
    responses.actionCompleteResponse(res, result, "All Bookings")

  }
  catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings")
  }

}