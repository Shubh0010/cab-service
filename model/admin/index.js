/*
 * Author : Shubham Negi
 * =====================
 * entry file of admin model
 */

const adminValidator = require(`../admin/validators/adminValidator`)
const adminController = require('../admin/controllers/adminController')

app.get('/admin/seeAllBookings', adminController.authenticateAdmin, adminController.getAllBookings)
app.get('/admin/seeAllBookings/assigned', adminController.authenticateAdmin, adminController.getAllAssignedBookings)
app.get('/admin/seeAllBookings/unassigned', adminController.authenticateAdmin, adminController.getAllUnAssignedBookings)

app.post(`/admin/login`, adminValidator.validateLogin, adminController.authenticateLogin)
app.post(`/admin/assignDriver`, adminValidator.validateAssignDriver, adminController.authenticateAdmin, adminController.assignDriver )

app.delete('/admin/logout', adminController.authenticateAdmin, adminController.logout)

require('./services/addAdmin.js')                                                               // inserts two admin in database when program starts