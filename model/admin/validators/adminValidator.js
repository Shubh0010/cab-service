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
    email: JOI.string().trim().email({
      minDomainAtoms: 2
    }).max(20).required()
  };
  if (validate(req, res, schema))
    next();
};
function validateAssignDriver(req, res, next) {
  const schema = {
    booking_id: JOI.number().required()
  };
  if (validate(req, res, schema))
    next();
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

module.exports = { validateLogin, validateAssignDriver };