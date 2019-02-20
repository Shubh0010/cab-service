const { runQuery } = require('../../../database/mysqlLib')


exports.createBooking = async (req, id) => {

  const query = "insert into booking (customer_id, from_latitude, from_longitude, to_latitude, to_longitude) values (?,?,?,?,?) "
  const values = [id, req.body.from_latitude, req.body.from_longitude, req.body.to_latitude, req.body.to_longitude]
  const result = await runQuery(query, values)

  return result;

}
exports.checkBooking = async (req, id) => {
  const query = `select count(*) as count from booking where customer_id = ? and status in (?,?) `
  const params = [id, 0, 1]
  const count = await runQuery(query, params)
  if (count[0].count != 0) return true
  return false

}
exports.findId = async (req) => {
  const query = "select customer_id from customer where email = ?"
  const values = [req.tokenEmail]
  const result = await runQuery(query, values)

  const id = result[0].customer_id

  return id;
}

exports.getBooking = async (req) => {
  const query = `SELECT customer.email, booking_id, date_time, from_latitude, from_longitude, to_latitude,to_longitude, driver.first_name as driver_name, driver.phone_number as driver_phone_number  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  LEFT JOIN driver
  USING (driver_id)
  WHERE customer.email = ? and status IN (?,?)`


  const params = [req.tokenEmail, 1,0]
  const result = await runQuery(query, params)
  //console.log(result)
  return result

}

exports.getAllBookings = async (req) => {
  const query = `SELECT customer.email,booking_id, status as booking_status, date_time, from_latitude, from_longitude, to_latitude,to_longitude, driver.first_name as driver_name, driver.phone_number as driver_phone_number  
  FROM booking
  INNER JOIN customer
  USING (customer_id)
  LEFT JOIN driver
  USING (driver_id)
  WHERE customer.email = ? `
  const params = [req.tokenEmail]
  const result = await runQuery(query, params)
  //console.log(result)
  return result
  
}