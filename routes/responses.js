/*
    contains all the responses
 */
const constants = require("../properties/constant");

exports.actionCompleteResponse = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ACTION_COMPLETE,
    status: constants.responseFlags.ACTION_COMPLETE,
    data: getdata || {}
  };
  res.send(response);
};

exports.authenticationError = async (res, data, msg) => {
  const response = {
    message: msg || constants.responseMessages.UNAUTHORIZED,
    status: constants.responseFlags.UNAUTHORIZED,
    data: data || {}
  };
  res.send(response);
};

exports.badRequest = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.BAD_REQUEST,
    status: constants.responseFlags.BAD_REQUEST,
    data: getdata || {}
  };
  res.send(response);
};
exports.sucessfullyCreated = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.CREATED,
    status: constants.responseFlags.CREATED,
    data: getdata || {}
  };
  res.send(response);
};
exports.successfullyAccepted = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ACCEPTED,
    status: constants.responseFlags.ACCEPTED,
    data: getdata || {}
  };
  res.send(response);
};
exports.alreadyReported = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ALREADY_REPORTED,
    status: constants.responseFlags.ALREADY_REPORTED,
    data: getdata || {}
  };
  res.send(response);
};
exports.notFound = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.NOT_FOUND,
    status: constants.responseFlags.NOT_FOUND,
    data: getdata || {}
  };
  res.send(response);
};
exports.notAssigned = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.UNASSIGNED,
    status: constants.responseFlags.UNASSIGNED,
    data: getdata || {}
  };
  res.send(response);
};
exports.notAcceptable = async (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.NOT_ACCEPTABLE,
    status: constants.responseFlags.NOT_ACCEPTABLE,
    data: getdata || {}
  };
  res.send(response);
};