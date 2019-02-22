/*
 * Author : Shubham Negi
 * =====================
 * entry file of driver model
 */

const driverValidators = require(`./validators/driverValidators`)
const driverControllers = require(`./controllers/driverConrollers`)

app.get(`/driver/seeBooking`, driverControllers.authenticateToken, driverControllers.getBooking)
app.get(`/driver/seeAllBookings`,driverControllers.authenticateToken, driverControllers.getAllBookings)

app.post('/driver/signUp',  driverValidators.validateSignUp,      driverControllers.addDriver )
app.post('/driver/login',   driverValidators.validateLogin,       driverControllers.authenticateDriver )
app.post('/driver/completeBooking', driverValidators.validateFare, driverControllers.authenticateToken, driverControllers.completeRide)

app.delete('/driver/logout', driverControllers.authenticateToken, driverControllers.logout)