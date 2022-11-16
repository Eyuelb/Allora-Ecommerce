const auth_controller = require("./auth/auth.controller");
const verify_controller = require("./auth/verify.controller");
const forget_controller = require("./auth/forget.controller");
const reset_controller = require("./auth/reset.controller");

const user_controller = require("./user/user.controller");
const address_controller = require("./user/address.controller");

const product_controller = require("./product/product.controller");
const brand_controller = require("./product/brand.controller");
const category_controller = require("./product/category.controller");
const manufacturingCountry_controller = require("./product/manufacturingCountry.controller");

const payment_controller = require("./order/payment.controller");

const cart_controller = require("./cart/cart.controller");
const cartItems_controller = require("./cart/cartItem.controller");
module.exports = {
  auth_controller,
  user_controller,
  verify_controller,
  forget_controller,
  reset_controller,
  product_controller,
  brand_controller,
  category_controller,
  manufacturingCountry_controller,
  address_controller,
  payment_controller,
  cart_controller,
  cartItems_controller
};
