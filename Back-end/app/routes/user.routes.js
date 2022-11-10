const { authJwt , access } = require("../middleware");
const user_controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", user_controller.allAccess);

  app.get("/api/test/user",[authJwt.verifyToken],user_controller.userBoard);

  app.get("/api/test/mod",[authJwt.verifyToken, access.isModerator],user_controller.moderatorBoard);

  app.get("/api/test/admin",[authJwt.verifyToken, access.isAdmin],user_controller.adminBoard);
};
