const auth_controller = require("./auth/auth.controller");
const verify_controller = require("./auth/verify.controller");
const forget_controller = require("./auth/forget.controller");
const reset_controller = require("./auth/reset.controller");
const user_controller = require("./user/user.controller");
const product_controller = require("./product/product.controller");
module.exports = {
  auth_controller,
  user_controller,
  verify_controller,
  forget_controller,
  reset_controller,
  product_controller
};
