/*
  hash password for security purpose
*/
const bcrypt = require(`bcryptjs`);

exports.hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  return password;
};