const responses = require(`../../../routes/responses`)
const adminServices = require(`../services/adminServices`)
const alreagyLogin = require(`../../../utilities/alreadyLogin`)
const generateToken = require('../../../utilities/generateToken')
const jwt = require(`jsonwebtoken`)
const config = require('config')
const moment = require(`moment`)
exports.authenticateLogin = async (req, res) => {
  //find user
  const isThere = await adminServices.findAdmin(req)
  if (!isThere) return responses.authenticationError(res, {}, "Wrong Credentials!! Pls try again")

  //already logged in ??  
  const isLogin = await alreagyLogin.isLogin(req, "admin")

  if (isLogin) return responses.actionCompleteResponse(res, { token: isLogin }, "Already Login !!")

  // add token
  const token = generateToken.token(req, "jwtPrivateKeyAdmin")
  const result = await adminServices.addToken(req.body, token)

  console.log(result)
  responses.actionCompleteResponse(res, { "token": token }, "SUCCESSFULLY LOGGED IN")
}

exports.authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header(`access_token`)
    if (!token) return responses.authenticationError(res, {}, "Access Denied")                            // If the token is not there, we don`t let manipulation in database

    try {
      const decoded = jwt.verify(token, config.get(`jwtPrivateKeyAdmin`));                  // Only verified users will be able to manipulate data
      req.tokenEmail = decoded.email;
      next();
    }
    catch (ex) {
      responses.authenticationError(res, {}, "Invalid Token");
    }
  }
  catch (error) {
    responses.authenticationError(res, {}, "Authentication Unsucessfull")
  }
}

exports.assignDriver = async (req, res, next) => {
  try {
    //valid booking
    const invalidBooking = await adminServices.invalidBooking(req);
    if (invalidBooking) return responses.actionCompleteResponse(res, {}, "Invalid Booking")

    //if booking already assigned  
    const isComplete = await adminServices.isBookingComplete(req);
    if (isComplete) return responses.actionCompleteResponse(res, {}, "Already Assigned")

    //find driver
    const driverId = await adminServices.findDriver()
    if (driverId == -1) return responses.actionCompleteResponse(res, {}, "All driver are busy")

    // change status of driver
    const result = await adminServices.changeDriverStatus(driverId)
    //change status of booking
    const data = await adminServices.changeBookingStatus(req, driverId)

    responses.actionCompleteResponse(res, {}, "ASSIGNED SUCCESSFULLY")


    //mongo
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');
    const logs = ["Admin with id", adminId[0].admin_id, "assigned driver with id", driverid[0].driver_id, "on", date];
    const logData = logs.join(' ')
    dbo.collection("adminlogs").insert({ admin_id: adminId[0].admin_id, driver_id: driverid[0].driver_id, logs: data })
  }
  catch (error) {
    console.log(error);
    responses.authenticationError(res, {}, "Couldn`t assign your booking.... please try again Later!!!!!!!")
  }
}

exports.getAllBookings = async (req, res, next) => {
  try {
    const result = await adminServices.getAllBookings(req);
    responses.actionCompleteResponse(res, result, "All Bookings")

  }
  catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings")
  }
}

exports.getAllAssignedBookings = async (req, res, next) => {
  try {
    const result = await adminServices.getAllAssignedBookings(req);
    responses.actionCompleteResponse(res, result, "All Assigned Bookings")

  }
  catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings")

  }
}

exports.getAllUnAssignedBookings = async (req, res, next) => {
  try {
    const result = await adminServices.getAllUnAssignedBookings(req);
    responses.actionCompleteResponse(res, result, "All Unassigned Bookings")

  }
  catch (error) {
    responses.authenticationError(res, error, "Couldn`t get bookings")

  }
}