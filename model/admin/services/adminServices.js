/*
 * Author : Shubham Negi
 * =====================
 * handles all the databases query and function used by admin model
 */

const { runQuery } = require(`../../../database/mysqlLib`);
const responses = require(`../../../routes/responses`);
const hash = require("../../../utilities/hashPassword");
const bcrypt = require("bcryptjs");

exports.addToken = Promise.coroutine(function* (data, access_token) {
  const query = "UPDATE admin SET access_token = ? where email=?";
  const params = [access_token, data.email];
  const result = yield runQuery(query, params);
  return result;
});

exports.findAdmin = Promise.coroutine(function* (req) {
  try {
    const query = `select password from admin where email = ?`;
    const params = [req.body.email];
    const result = yield runQuery(query, params);
    if ((req.body.password = result[0].password)) return true;
    return false;
  } catch (error) {
    return false;
  }
});

exports.findDriver = Promise.coroutine(function* () {                                                  // returns the first driver with availability_status = 0 (available)
  const query = `select driver_id from driver where availability_status = ? LIMIT ?`;
  const values = [0, 1];
  const result = yield runQuery(query, values);
  if (result.length == 0) return -1;
  return result[0].driver_id;
});

exports.changeDriverStatus = Promise.coroutine(function* (driver_id) {
  const query = "UPDATE driver SET availability_status = ? where driver_id=?";
  const params = [1, driver_id];                                                                      // availability_status 1 = BUSY
  const result = yield runQuery(query, params);
  return result;
});

exports.changeBookingStatus = Promise.coroutine(function* (req, driver_id) {
  const query =
    "UPDATE booking SET status = ?, driver_id = ? where booking_id=?";
  const params = [1, driver_id, req.body.booking_id];                                                 // status 1 = ONGOING
  const result = yield runQuery(query, params);
  return result;
});

exports.invalidBooking = Promise.coroutine(function* (req) {
  const query = `select count(*) as count from booking where booking_id = ?`;
  const params = [req.body.booking_id];
  const count = yield runQuery(query, params);
  if (count[0].count == 0) return true;
  return false;
});

exports.isBookingComplete = Promise.coroutine(function* (req) {
  const query = `select count(*) as count from booking where booking_id = ? and status in (?,?) `;
  const params = [req.body.booking_id, 1, 2];
  const count = yield runQuery(query, params);
  if (count[0].count != 0) return true;
  return false;
});

exports.getAllBookings = Promise.coroutine(function* (req) {
  const query = `SELECT booking_id, date_time, status, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as user_name, customer.phone_number as user_phone_number, customer.email as user_email, driver.first_name as driver_name, driver.phone_number, driver.email  
  FROM booking
  LEFT JOIN driver
  USING (driver_id)
  INNER JOIN customer
  USING (customer_id)`;
  const result = yield runQuery(query);
  return result;
});

exports.getAllAssignedBookings = Promise.coroutine(function* (req) {
  const query = `SELECT booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as user_name, customer.phone_number as user_phone_number, customer.email as user_email, driver.first_name as driver_name, driver.phone_number, driver.email  
  FROM booking
  INNER JOIN driver
  USING (driver_id)
  INNER JOIN customer
  USING (customer_id)
  WHERE status in(?,?)`;
  const params = [1, 2];
  const result = yield runQuery(query, params);

  return result;
});

exports.getAllUnAssignedBookings = Promise.coroutine(function* () {
  const query = `SELECT booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as user_name, customer.phone_number as user_phone_number, customer.email as user_email  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  WHERE status = ?`;
  const params = [0];
  const result = yield runQuery(query, params);

  return result;
});