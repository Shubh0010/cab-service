/*
 * Author : Shubham Negi
 * =====================
 * validates input in driver model
 */

const JOI = require(`joi`);
const responses = require(`../../../routes/responses`);

function validateSignUp(req, res, next) {
  const schema = {
    first_name: JOI.string().required(),
    middle_name: JOI.string().required(),
    last_name: JOI.string().required(),
    password: JOI.string().required(),
    confirmPassword: JOI.string().required(),
    email: JOI.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    phone_number: JOI.number().required(),
    car_name: JOI.string().required(),
    car_number: JOI.string().required(),
    latitude: JOI.number().required(),
    longitude: JOI.number().required()
  };
  validate(req, res, schema);
  next();
}
function validateLogin(req, res, next) {
  const schema = {
    password: JOI.string().required(),
    phone_number: JOI.number().required()
  };
  validate(req, res, schema);
  next();
}
function validateFare(req, res, next) {
  const schema = {
    ride_fare: JOI.number().required()
  };
  validate(req, res, schema);
  next();
}

function validate(req, res, schema) {
  try {
    const check = JOI.validate(schema, req.body);
  } catch (error) {
    responses.authenticationError(res, { "error": "please check the entered details" }, error.details[0].message);
  }
}

module.exports = { validateLogin, validateSignUp, validateFare };