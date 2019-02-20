const constants = require('../properties/constant')

exports.actionCompleteResponse = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ACTION_COMPLETE,
    status: constants.responseFlags.ACTION_COMPLETE,
    data: getdata || {} 
  };
  res.send(response);
}

exports.authenticationError = async (res, data, msg) => {
  const response = {
    message: msg || constants.responseMessages.SHOW_ERROR_MESSAGE,
    status: constants.responseFlags.SHOW_ERROR_MESSAGE,
    data: data || {}
  };
  res.send(response);
}