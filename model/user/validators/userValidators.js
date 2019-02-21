/*
 * Author : Shubham Negi
 * =====================
 * validates input in user model
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
    phone_number: JOI.number().required(),
    "email": JOI.string().trim().email({
      minDomainAtoms: 2
    }).max(20).required(),
    latitude: JOI.number().min(-90).max(90).required(),
    longitude: JOI.number().min(-180).max(180).required()
  };

  if (validate(req, res, schema)) {
    next();
  }
}
function validateLogin(req, res, next) {
  const schema = {
    password: JOI.string().required(),
    email: JOI.string()
      .email({ minDomainAtoms: 2 })
      .required()
  };
  if (validate(req, res, schema)) {
    next();
  }
}

function validate(req, res, schema) {
  const check = JOI.validate(req.body, schema, (err, data) => {
    if (err) {
      responses.authenticationError(res, { "error": "please check entered values" }, err.details[0].message);
      return false;
    }
    return data;
  });
  return check
}

module.exports = { validateLogin, validateSignUp };