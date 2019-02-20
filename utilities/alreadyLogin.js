const {runQuery} = require(`../database/mysqlLib`)
exports.isLogin = async (req, table_name)=>{
  const query = "select access_token from ?? where email = ?"
  const params = [table_name,req.body.email]
  const check =  await runQuery(query,params)
  
  if(check[0].access_token)
    return check[0].access_token
  return false
}