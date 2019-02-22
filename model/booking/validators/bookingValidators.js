/*
 * Author : Shubham Negi
 * =====================
 * validates input in booking model
 */

const JOI = require(`joi`);
const responses = require(`../../../routes/responses`);

function validateBooking(req, res, next) {
  const schema = {
    from_latitude: JOI.number().min(-90).max(90).required(),
    from_longitude: JOI.number().min(-180).max(180).required(),
    to_latitude: JOI.number().min(-90).max(90).required(),
    to_longitude: JOI.number().min(-180).max(180).required()
  };
  if (validate(req, res, schema))
    next();
}

/** 
* @function <b> validate </b> <br> 
* validates booking model 
* @param {object(req), object(res), object(schema)}   
* @return boolean
*/
function validate(req, res, schema) {
  const check = JOI.validate(req.body, schema, (err, data) => {
    if (err) {
      responses.notAcceptable(res, { "error": "please check entered values" }, err.details[0].message);
      return false;
    }
    return data;
  });
  return check
}
module.exports = { validateBooking };