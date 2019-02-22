/*
    contains all the responses
 */
const constants = require("../properties/constant");

exports.actionCompleteResponse = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ACTION_COMPLETE,
    status: constants.responseFlags.ACTION_COMPLETE,
    data: getdata || {}
  };
  res.status(constants.responseFlags.ACTION_COMPLETE).send(response);
};

exports.authenticationError = (res, data, msg) => {
  const response = {
    message: msg || constants.responseMessages.UNAUTHORIZED,
    status: constants.responseFlags.UNAUTHORIZED,
    data: data || {}
  };
  res.status(constants.responseFlags.UNAUTHORIZED).send(response);
};

exports.badRequest = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.BAD_REQUEST,
    status: constants.responseFlags.BAD_REQUEST,
    data: getdata || {}
  };
  res.status(constants.responseFlags.BAD_REQUEST).send(response);
};

exports.sucessfullyCreated = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.CREATED,
    status: constants.responseFlags.CREATED,
    data: getdata || {}
  };
  res.status(constants.responseFlags.CREATED).send(response);
};

exports.successfullyAccepted = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ACCEPTED,
    status: constants.responseFlags.ACCEPTED,
    data: getdata || {}
  };
  res.status(constants.responseFlags.ACCEPTED).send(response);
};

exports.alreadyReported = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ALREADY_REPORTED,
    status: constants.responseFlags.ALREADY_REPORTED,
    data: getdata || {}
  };
  res.status(constants.responseFlags.ALREADY_REPORTED).send(response);
};

exports.notFound = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.NOT_FOUND,
    status: constants.responseFlags.NOT_FOUND,
    data: getdata || {}
  };
  res.status(constants.responseFlags.NOT_FOUND).send(response);
};

exports.notAssigned = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.UNASSIGNED,
    status: constants.responseFlags.UNASSIGNED,
    data: getdata || {}
  };
  res.status(constants.responseFlags.UNASSIGNED).send(response);
};

exports.notAcceptable = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.NOT_ACCEPTABLE,
    status: constants.responseFlags.NOT_ACCEPTABLE,
    data: getdata || {}
  };
  res.status(constants.responseFlags.NOT_ACCEPTABLE).send(response);
};