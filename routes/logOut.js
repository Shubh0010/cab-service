/*
  logs out a prarticular user type on given type
*/
const { runQuery } = require(`../database/mysqlLib`)

exports.logOut = Promise.coroutine(function* (table_name, email) {
  query = "UPDATE ?? SET access_token = ? where email = ?";
  values = [table_name, "-", email]
  const result = yield runQuery(query, values)
})