
const responses = require(`../../../routes/responses`)
const userServices = require(`../services/userServices`)
const generateToken = require(`../../../utilities/generateToken`)
const alreagyLogin = require(`../../../utilities/alreadyLogin`)

async function addCustomer(req, res) {
  if (req.body.password != req.body.confirmPassword)
    return responses.authenticationError(res, {}, "password and confirm password doesn`t match") // password nort same

  try {
    const check = await userServices.checkEmail(req)
    if (check) {
      responses.authenticationError(res, {}, "Already Registered")
      return
    }
    else {
      const token = generateToken.token(req,"jwtPrivateKeyCustomer")
      const add = await userServices.addCustomer(req.body, token)
      responses.actionCompleteResponse(res, {"token": token}, "WELCOME ABROAD")
    }


  }
  catch (error) {
    responses.authenticationError(res, error, "Technical issue with database")
  }
}

async function authenticateCustomer(req, res) {
  //find user
  const isThere = await userServices.findCustomer(req)
  if(!isThere) return responses.authenticationError(res,{},"Wrong Credentials!! Pls try again")
  
  //already logged in ??  
  const isLogin = await alreagyLogin.isLogin(req, "customer")
  
  if (isLogin) return responses.actionCompleteResponse(res, {token : isLogin}, "Already Login !!")

  // add token
  const token = generateToken.token(req, "jwtPrivateKeyCustomer")
  const result = await userServices.addToken(req.body, token)
  responses.actionCompleteResponse(res, {"token": token}, "SUCCESSFULLY LOGGED IN")

}

module.exports = { addCustomer, authenticateCustomer }