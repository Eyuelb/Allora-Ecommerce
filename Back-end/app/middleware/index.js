const authJwt = require("./authJwt");
const signUp = require("./signUp");
const verification = require("./verification");
const access = require("./access");
const forget = require("./forget");
const signIn = require("./signIn");
const reset = require("./reset");
module.exports = {
  authJwt,
  signUp,
  signIn,
  verification,
  access,
  forget,
  reset
  
};
