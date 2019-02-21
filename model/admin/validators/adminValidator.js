/*
 * Author : Shubham Negi
 * =====================
 * validates input in admin model
 */

const JOI = require(`joi`);
const responses = require(`../../../routes/responses`);

validateLogin = function (req, res, next) {
  const schema = {
    password: JOI.string().required(),
    email: JOI.string()
      .email({ minDomainAtoms: 2 })
      .required()
  };
  validate(req, res, schema);
  next();
};
function validateAssignDriver(req, res, next) {
  const schema = {
    booking_id: JOI.number().required()
  };
  validate(req, res, schema);
  next();
}
function validate(req, res, schema) {
  try {
    const check = JOI.validate(schema, req.body);
  } catch (error) {
    responses.authenticationError(res, { "error": "Bad Request" }, "Enter Booking Id");
  }
}

module.exports = { validateLogin, validateAssignDriver };