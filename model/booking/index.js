const bookingValidators= require("./validators/bookingValidators")
const authenticateBooking = require("./controllers/authenticateBooking")
const bookingController = require("./controllers/bookingController")

app.get(`/booking/getBooking`, authenticateBooking.authenticate, bookingController.getBooking)
app.get(`/booking/getAllBookings`,authenticateBooking.authenticate, bookingController.getAllBookings)

app.post(`/booking/createBooking`, bookingValidators.validateBooking, authenticateBooking.authenticate , bookingController.createBooking)
