const { runQuery } = require(`../../../database/mysqlLib`)
const responses = require(`../../../routes/responses`)
const hash = require('../../../utilities/hashPassword')
const bcrypt = require('bcryptjs')

exports.addCustomer = async (data, access_token) => {
  const query = "insert into customer (first_name,middle_name,last_name,password,phone_number,email,latitude,longitude, access_token) values (?,?,?,?,?,?,?,?,?)"
  const password = await hash.hashPassword(data.password)

  const values = [data.first_name, data.middle_name, data.last_name, password, data.phone_number, data.email, data.latitude, data.longitude, access_token]

  const result = await runQuery(query, values);

}

exports.addToken = async (data, access_token) => {
  const query = "UPDATE customer SET access_token = ? where email=?"
  const params = [access_token, data.email]
  
  const result = await runQuery(query, params)
  
  
}

exports.checkEmail = async (req) => {
  const query = `select count(*) as count from customer where email = ?`
  const params = [req.body.email]
  const count = await runQuery(query, params)
  if (count[0].count != 0) return true
  return false
}

exports.findCustomer = async (req) => {
  try {
    const query = `select password from customer where email = ?`
    const params = [req.body.email]
    const result = await runQuery(query,params)
    const password = result[0].password
    
    const validPassword = await bcrypt.compare(req.body.password, result[0].password);
    
    return validPassword 
  }
  catch(error){
    return false
  }
  
}