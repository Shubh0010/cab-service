const { runQuery } = require(`../../../database/mysqlLib`)
const responses = require(`../../../routes/responses`)
const hash = require('../../../utilities/hashPassword')
const bcrypt = require('bcryptjs')

exports.addDriver = async (data, access_token) => {
  const query = "insert into driver (first_name,middle_name,last_name,password,phone_number,email,latitude,longitude,access_token,car_name, car_number) values (?,?,?,?,?,?,?,?,?,?,?)"
  const password = await hash.hashPassword(data.password)

  const values = [data.first_name, data.middle_name, data.last_name, password, data.phone_number, data.email, data.latitude, data.longitude, access_token, data.car_name, data.car_number]

  const result = await runQuery(query, values);

}

exports.addToken = async (data, access_token) => {
  const query = "UPDATE driver SET access_token = ? where email=?"
  const params = [access_token, data.email]

  const result = await runQuery(query, params)


}

exports.checkEmail = async (req) => {
  const query = `select count(*) as count from driver where email = ?`
  const params = [req.body.email]
  const count = await runQuery(query, params)
  if (count[0].count != 0) return true
  return false
}

exports.findDriver = async (req) => {
  try {
    const query = `select password from driver where email = ?`
    const params = [req.body.email]
    const result = await runQuery(query, params)
    const password = result[0].password
    console.log(password)
    console.log(req.body.password);

    const validPassword = await bcrypt.compare(req.body.password, password);

    return validPassword
  }
  catch (error) {
    return false
  }

}

exports.findId = async (req) => {
  const query = `select driver_id from driver where email = ?`
  const values = [req.tokenEmail]           // busy 1
  const result = await runQuery(query, values)

  return result[0].driver_id
}

exports.noBooking = async (driver_id) => {
  const query = `select availability_status as count from driver where driver_id = ?`
  const params = [driver_id]
  const count = await runQuery(query, params)
  if (count==1) return true
  return false
}

exports.changeDriverStatus = async (driver_id) => {
  const query = "UPDATE driver SET availability_status = ? where driver_id=?"
  const params = [0, driver_id]               // available 0
  const result = await runQuery(query, params)
  return result

}

exports.changeBookingStatus = async (req, driver_id) => {
  const query = "UPDATE booking SET status = ? where driver_id=?"
  const params = [2, driver_id, req.body.driver_id]           // completed 2
  const result = await runQuery(query, params)
  return result

}

exports.getBooking = async (req) => {
  const query = `SELECT driver.email, booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as customer_name, customer.phone_number as customer_phone_number  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  INNER JOIN driver
  USING (driver_id)
  WHERE driver.email = ? and status IN (?,?)`
  const params = [req.tokenEmail, 0,1]
  const result = await runQuery(query, params)
  return result

}

exports.getAllBookings = async (req) => {
  const query = `SELECT driver.email, booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, customer.first_name as customer_name, customer.phone_number as customer_phone_number  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  INNER JOIN driver
  USING (driver_id)
  WHERE driver.email = ? `
  const params = [req.tokenEmail]
  const result = await runQuery(query, params)
  
  return result
  
}