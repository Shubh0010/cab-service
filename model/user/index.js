/*
 * Author : Shubham Negi
 * =====================
 * entry file of user model
 */

const userValidators = require(`./validators/userValidators`)
const userController = require(`./controllers/userController`)
const authenticateToken = require(`../booking/controllers/authenticateBooking`)

app.post('/user/signUp',  userValidators.validateSignUp,      userController.addCustomer )
app.post('/user/login',   userValidators.validateLogin,       userController.authenticateCustomer )

app.delete('/user/logout', authenticateToken.authenticate, userController.logout)