const { runQuery } = require(`../../../database/mysqlLib`)
const responses = require(`../../../routes/responses`)
const hash = require('../../../utilities/hashPassword')
const bcrypt = require('bcryptjs')

exports.addToken = async (data, access_token) => {
  const query = "UPDATE admin SET access_token = ? where email=?"
  const params = [access_token, data.email]
  const result = await runQuery(query, params)
  return result

}

exports.findAdmin = async (req) => {
  try {
    const query = `select password from admin where email = ?`
    const params = [req.body.email]
    const result = await runQuery(query, params)
    if (req.body.password = result[0].password)
      return true;
    return false
  }
  catch (error) {
    return false
  }

}

exports.findDriver = async () => {

  const query = `select driver_id from driver where availability_status = ? LIMIT ?`
  const values = [0, 1]                    // available 0
  const result = await runQuery(query, values)
  if (result.length == 0)
    return -1
  return result[0].driver_id

}

exports.changeDriverStatus = async (driver_id) => {
  const query = "UPDATE driver SET availability_status = ? where driver_id=?"
  const params = [1, driver_id]         // busy 1
  const result = await runQuery(query, params)
  return result

}

exports.changeBookingStatus = async (req, driver_id) => {
  const query = "UPDATE booking SET status = ?, driver_id = ? where booking_id=?"
  const params = [1, driver_id, req.body.booking_id]   // ongoing 1
  const result = await runQuery(query, params)
  return result

}

exports.invalidBooking = async (req) => {
  const query = `select count(*) as count from booking where booking_id = ?`
  const params = [req.body.booking_id]
  const count = await runQuery(query, params)
  if (count[0].count == 0) return true
  return false

}

exports.isBookingComplete = async (req) => {
  const query = `select count(*) as count from booking where booking_id = ? and status in (?,?) `
  const params = [req.body.booking_id, 1, 2]
  const count = await runQuery(query, params)
  if (count[0].count != 0) return true
  return false


}

exports.getAllBookings = async (req) => {
  const query = `SELECT booking_id, date_time, status, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as user_name, customer.phone_number as user_phone_number, customer.email as user_email, driver.first_name as driver_name, driver.phone_number, driver.email  
  FROM booking
  INNER JOIN driver
  USING (driver_id)
  INNER JOIN customer
  USING (customer_id)`
  const result = await runQuery(query)
  // const data = result[0]
  // const resultSet = {
  //   "----------" : "-----------",
  //   "booking_id": data.booking_id,
  //   "date_time": data.data_time,
  //   "status": data.status,
  //   "pick_up_point": {
  //     "from (latitude, longitude)": [data.from_latitude, data.from_longitude],
  //     "to (latitude, longitude)": [data.to_latitude, data.to_longitude]
  //   },
  //   "customer": {
  //     "name": data.cfname + " " + data.cmname + " " + data.clname,
  //     "phone_number": data.cphone,
  //     "email": data.cemail
  //   },
  //   "driver": {
  //     "name": data.first_name + " " + data.middle_name + " " + data.last_name,
  //     "phone_number": data.phone_number,
  //     "email": data.email
  //   }
  // }
  // console.log(resultSet)
  return result
}

exports.getAllAssignedBookings = async (req) => {
  const query = `SELECT booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as user_name, customer.phone_number as user_phone_number, customer.email as user_email, driver.first_name as driver_name, driver.phone_number, driver.email  
  FROM booking
  INNER JOIN driver
  USING (driver_id)
  INNER JOIN customer
  USING (customer_id)
  WHERE status in(?,?)`
  const params = [1, 2]
  const result = await runQuery(query, params)
  
  return result

}
exports.getAllUnAssignedBookings = async (req) => {
  const query = `SELECT booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as user_name, customer.phone_number as user_phone_number, customer.email as user_email  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  WHERE status = ?`
  const params = [0]
  const result = await runQuery(query, params)
  
  return result

}