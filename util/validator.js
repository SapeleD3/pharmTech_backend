const { message } = require('./constants');

const isEmpty = (string) => {
  return string.trim() === '';
};
const isEmail = (email) => {
  const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.match(regEx) ? true : false;
};

const { mustNotBeEmpty, passwordMustMatch, mustBeValidEmail } = message;

// eslint-disable-next-line max-lines-per-function
exports.validateSignUpData = (data) => {
  // input validation
  const errors = {};
  const { password, confirmPassword, email } = data;

  if (isEmpty(email)) {
    errors.email = mustNotBeEmpty;
  } else if (!isEmail(email)) {
    errors.email = mustBeValidEmail;
  }

  if (isEmpty(password)) errors.password = mustNotBeEmpty;
  if (password !== confirmPassword) {
    errors.confirmPassword = passwordMustMatch;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateLoginData = (data) => {
  const errors = {};
  const { email, password } = data;

  if (isEmpty(email)) {
    errors.email = mustNotBeEmpty;
  } else if (!isEmail(email)) {
    errors.email = mustBeValidEmail;
  }
  if (isEmpty(password)) errors.password = mustNotBeEmpty;

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
