/*
 * Author : Shubham Negi
 * =====================
 * handles all the databases query and function used by user model
 */

const { runQuery } = require(`../../../database/mysqlLib`);
const responses = require(`../../../routes/responses`);
const hash = require("../../../utilities/hashPassword");
const bcrypt = require("bcryptjs");

exports.addCustomer = Promise.coroutine(function* (data, access_token) {
  const query =
    "insert into customer (first_name,middle_name,last_name,password,phone_number,email,latitude,longitude, access_token) values (?,?,?,?,?,?,?,?,?)";
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
    access_token
  ];

  const result = yield runQuery(query, values);
});

/** 
* @function <b> addToken </b> <br> 
* adds token to customer database
* @param {object(data), String(acess_token)}  
* @return {void}
*/
exports.addToken = Promise.coroutine(function* (data, access_token) {
  const query = "UPDATE customer SET access_token = ? where email=?";
  const params = [access_token, data.email];

  const result = yield runQuery(query, params);
});

/** 
* @function <b> checkEmail </b> <br> 
* checks for customer email
* @param {object(req)}  
* @return {boolean}
*/
exports.checkEmail = Promise.coroutine(function* (req) {
  const query = `select count(*) as count from customer where email = ?`;
  const params = [req.body.email];
  const count = yield runQuery(query, params);
  if (count[0].count != 0) return true;
  return false;
});

/** 
* @function <b> findCustomer </b> <br> 
* finds if there customer
* @param {object(req)}  
* @return {boolean}
*/
exports.findCustomer = Promise.coroutine(function* (req) {
  try {
    const query = `select password from customer where email = ?`;
    const params = [req.body.email];
    const result = yield runQuery(query, params);
    const password = result[0].password;

    const validPassword = yield bcrypt.compare(
      req.body.password,
      result[0].password
    );

    return validPassword;
  } catch (error) {
    return false;
  }
});