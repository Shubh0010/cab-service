const userValidators = require(`./validators/userValidators`)
const userController = require(`./controllers/userController`)

app.post('/user/signUp',  userValidators.validateSignUp,      userController.addCustomer )
app.post('/user/login',   userValidators.validateLogin,       userController.authenticateCustomer )

