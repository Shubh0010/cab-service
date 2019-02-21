/*
 * Author : Shubham Negi
 * =====================
 * handles all the databases query and function used by driver model
 */

const { runQuery } = require(`../../../database/mysqlLib`);
const responses = require(`../../../routes/responses`);
const hash = require("../../../utilities/hashPassword");
const bcrypt = require("bcryptjs");

exports.addDriver = Promise.coroutine(function* (data, access_token) {
  const query =
    "insert into driver (first_name,middle_name,last_name,password,phone_number,email,latitude,longitude,access_token,car_name, car_number) values (?,?,?,?,?,?,?,?,?,?,?)";
  const password = yield hash.hashPassword(data.password);

  const values = [
    data.first_name,
    data.middle_name,
    data.last_name,
    password,
    data.phone_number,
    data.email,
    data.latitude,
    data.longitude,
    access_token,
    data.car_name,
    data.car_number
  ];

  const result = yield runQuery(query, values);
});

exports.addToken = Promise.coroutine(function* (data, access_token) {
  const query = "UPDATE driver SET access_token = ? where email=?";
  const params = [access_token, data.email];

  const result = yield runQuery(query, params);
});

exports.findBookingId = Promise.coroutine(function* (driver_id) {
  const query =
    "select booking_id from booking where driver_id = ? and status = ?";
  const params = [driver_id, 1];

  const result = yield runQuery(query, params);

  if (result.length == 0) return false;
  return result[0].booking_id;
});

exports.checkEmail = Promise.coroutine(function* (req) {
  const query = `select count(*) as count from driver where email = ?`;
  const params = [req.body.email];
  const count = yield runQuery(query, params);
  if (count[0].count != 0) return true;
  return false;
});

exports.findDriver = Promise.coroutine(function* (req) {
  try {
    const query = `select password from driver where email = ?`;
    const params = [req.body.email];
    const result = yield runQuery(query, params);
    const password = result[0].password;
    const validPassword = yield bcrypt.compare(req.body.password, password);

    return validPassword;
  } catch (error) {
    return false;
  }
});

exports.findId = Promise.coroutine(function* (req) {
  const query = `select driver_id from driver where email = ?`;
  const values = [req.tokenEmail];
  const result = yield runQuery(query, values);

  return result[0].driver_id;
});

exports.noBooking = Promise.coroutine(function* (driver_id) {
  const query = `select availability_status as count from driver where driver_id = ?`;
  const params = [driver_id];
  const count = yield runQuery(query, params);
  if (count == 1) return true;
  return false;
});

exports.changeDriverStatus = Promise.coroutine(function* (driver_id) {
  const query = "UPDATE driver SET availability_status = ? where driver_id=?";
  const params = [0, driver_id];                                                                          // free driver by setting availability_status 0 (available)
  const result = yield runQuery(query, params);
  return result;
});

exports.changeBookingStatus = Promise.coroutine(function* (req, driver_id) {
  const query = "UPDATE booking SET status = ? where driver_id=?";
  const params = [2, driver_id, req.body.driver_id];                                                      // change booking status to 2 (complete)
  const result = yield runQuery(query, params);
  return result;
});

exports.getBooking = Promise.coroutine(function* (req) {
  const query = `SELECT driver.email, booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as customer_name, customer.phone_number as customer_phone_number  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  INNER JOIN driver
  USING (driver_id)
  WHERE driver.email = ? and status IN (?,?)`;
  const params = [req.tokenEmail, 0, 1];                                                                  // current booking can have 0(pending) or 1(ongoing) as status 
  const result = yield runQuery(query, params);
  return result;
});

exports.getAllBookings = Promise.coroutine(function* (req) {
  const query = `SELECT driver.email, booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as customer_name, customer.phone_number as customer_phone_number  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  INNER JOIN driver
  USING (driver_id)
  WHERE driver.email = ? `;
  const params = [req.tokenEmail];
  const result = yield runQuery(query, params);

  return result;
});