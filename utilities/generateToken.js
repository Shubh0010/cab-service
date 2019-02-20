const jwt = require(`jsonwebtoken`)
const config = require(`config`)
const responses = require(`../routes/responses`)
exports.token = (req, key) => {
  const token = jwt.sign({ email: req.body.email }, config.get(key));                           // we are storing id as payload and getting private key from config file
  return token
} 
