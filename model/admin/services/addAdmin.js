/*
 * Author : Shubham Negi
 * =====================
 * adds 2 static admin
 */

const { runQuery } = require("../../../database/mysqlLib");

const addAdmin = Promise.coroutine(function* () {
  const checkFirst = yield checkForEmail("shubhamnegi0010@gmail.com");
  if (checkFirst) {
    const values = [
      "Shubham Negi",
      "shubhamnegi0010@gmail.com",
      "Shubham7",
      "8449458599"
    ];
    const result = yield addStaticAdmin(values);
  }

  const checkSecond = yield checkForEmail("nidhi.singh.0698@gmail.com");
  if (checkSecond) {
    const values = [
      "Nidhi Kumari",
      "nidhi.singh.0698@gmail.com",
      "Nidhi7",
      "7017267410"
    ];
    const result = yield addStaticAdmin(values);
  }
});

const checkForEmail = Promise.coroutine(function* (email) {                                            // checks if any of the two email is not present
  const query = `select count(*) as count from admin where email = ?`;
  const params = [email];
  const count = yield runQuery(query, params);
  if (count[0].count == 0) return true;
  return false;
});

const addStaticAdmin = Promise.coroutine(function* (values) {
  const query =
    "insert into admin (name,email,password,phone_number) values (?,?,?,?)";
  const count = yield runQuery(query, values);
});

addAdmin();