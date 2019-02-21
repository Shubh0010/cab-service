/*
 * Author : Shubham Negi
 * =====================
 * entry file of my_jugnoo_application
 */

const express = require("express");
const bodyParser = require("body-parser");
const dbo = require(`./database/mongoLib`);
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const Promise = require("bluebird");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: true }));

global.app = app;
global.Promise = Promise;

require(`./model/user/index.js`);
require(`./model/driver/index.js`);
require(`./model/booking/index.js`);
require(`./model/admin/index.js`);

app.listen(3000, () => {
  console.log("Listening");
});