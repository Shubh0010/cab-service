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
  res.status(202).send(response);
};

exports.authenticationError = (res, data, msg) => {
  const response = {
    message: msg || constants.responseMessages.UNAUTHORIZED,
    status: constants.responseFlags.UNAUTHORIZED,
    data: data || {}
  };
  res.status(401).send(response);
};

exports.badRequest = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.BAD_REQUEST,
    status: constants.responseFlags.BAD_REQUEST,
    data: getdata || {}
  };
  res.status(400).send(response);
};

exports.sucessfullyCreated = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.CREATED,
    status: constants.responseFlags.CREATED,
    data: getdata || {}
  };
  res.status(201).send(response);
};

exports.successfullyAccepted = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ACCEPTED,
    status: constants.responseFlags.ACCEPTED,
    data: getdata || {}
  };
  res.status(202).send(response);
};

exports.alreadyReported = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.ALREADY_REPORTED,
    status: constants.responseFlags.ALREADY_REPORTED,
    data: getdata || {}
  };
  res.status(208).send(response);
};

exports.notFound = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.NOT_FOUND,
    status: constants.responseFlags.NOT_FOUND,
    data: getdata || {}
  };
  res.status(404).send(response);
};

exports.notAssigned = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.UNASSIGNED,
    status: constants.responseFlags.UNASSIGNED,
    data: getdata || {}
  };
  res.status(427).send(response);
};

exports.notAcceptable = (res, getdata, msg) => {
  const response = {
    message: msg || constants.responseMessages.NOT_ACCEPTABLE,
    status: constants.responseFlags.NOT_ACCEPTABLE,
    data: getdata || {}
  };
  res.status(406).send(response);
};