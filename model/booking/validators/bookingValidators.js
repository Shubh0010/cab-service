/*
 * Author : Shubham Negi
 * =====================
 * validates input in booking model
 */

const JOI = require(`joi`);
const responses = require(`../../../routes/responses`);

function validateBooking(req, res, next) {
  const schema = {
    from_latitude: JOI.number().required(),
    from_longitude: JOI.number().required(),
    to_latitude: JOI.number().required(),
    to_longitude: JOI.number().required()
  };
  validate(req, res, schema);
  next();
}

function validate(req, res, schema) {
  try {
    const check = JOI.validate(schema, req.body);
  } catch (error) {
    responses.authenticationError(res, { "error": "bad request" }, "Access Denied");
  }
}
module.exports = { validateBooking };