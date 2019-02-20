const moment = require('moment')
const responses = require(`../../../routes/responses`)
const driverServices = require(`../services/driverServices`)
const generateToken = require(`../../../utilities/generateToken`)
const alreagyLogin = require(`../../../utilities/alreadyLogin`)
const jwt = require(`jsonwebtoken`)
const config = require(`config`)
async function addDriver(req, res) {
  if (req.body.password != req.body.confirmPassword)
    return responses.authenticationError(res, {}, "password and confirm password doesn`t match") // password nort same

  try {
    const check = await driverServices.checkEmail(req)
    if (check) {
      responses.authenticationError(res, {}, "Already Registered")
      return
    }
    else {
      const token = generateToken.token(req, "jwtPrivateKeyDriver")
      const add = await driverServices.addDriver(req.body, token)
      responses.actionCompleteResponse(res, { "token": token }, "WELCOME ABROAD")
    }
  }
  catch (error) {
    console.log(error)
    responses.authenticationError(res, error, "Technical issue with database")
  }
}

async function authenticateDriver(req, res) {
  //find user

  const isThere = await driverServices.findDriver(req)
  if (!isThere) return responses.authenticationError(res, {}, "Wrong Credentials!! Pls try again")

  //already logged in ??  
  const isLogin = await alreagyLogin.isLogin(req, "driver")
  if (isLogin) return responses.actionCompleteResponse(res, { token: isLogin }, "Already Login !!")

  // add token
  const token = generateToken.token(req, "jwtPrivateKeyDriver")
  const result = await driverServices.addToken(req.body, token)
  responses.actionCompleteResponse(res, { "token": token }, "SUCCESSFULLY LOGGED IN")

}
async function authenticateToken(req, res, next) {
  try {

    const token = req.header(`access_token`)
    console.log(token)
    if (!token) return responses.authenticationError(res, {}, "Access Denied")                            // If the token is not there, we don`t let manipulation in database

    try {

      const decoded = jwt.verify(token, config.get(`jwtPrivateKeyDriver`));                  // Only verified users will be able to manipulate data
      req.tokenEmail = decoded.email;
      next();
    }
    catch (ex) {
      console.log(ex)
      responses.authenticationError(res, {}, "Invalid Token");
    }
  }
  catch (error) {
    responses.authenticationError(res, {}, "Authentication Unsucessfull")
  }
}
async function completeRide(req, res, next) {
  try {
    const driverId = await driverServices.findId(req)

    //no bookings ?
    const noBooking = await driverServices.noBooking(driverId)
    if (noBooking) return responses.actionCompleteResponse(res, {}, "No Ride To complete")

    const result = await driverServices.changeDriverStatus(driverId)

    //change status of booking
    const data = await driverServices.changeBookingStatus(req, driverId)

    responses.actionCompleteResponse(res, {}, "COMPLETED SUCCESSFULLY")


    //mongo
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');
    const log = ["driver with id", driverId, "completes booking at", date];
    const logData = log.toString()
    dbo.collection("driverlogs").insert({ logs: logData })



  }
  catch (error) {
    console.log(error)
    responses.authenticationError(res, {}, " couldn`t process the complete request")
  }
}

async function getBooking(req, res, next) {
  try {
    const result = await driverServices.getBooking(req);
    responses.actionCompleteResponse(res, result, "Current Booking")

  }
  catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings")
  }

}

async function getAllBookings(req, res, next) {
  try {
    const result = await driverServices.getAllBookings(req);
    responses.actionCompleteResponse(res, result, "All Bookings")

  }
  catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings")
  }

}

module.exports = { addDriver, authenticateDriver, authenticateToken, completeRide, getAllBookings, getBooking }