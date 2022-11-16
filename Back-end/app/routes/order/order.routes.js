const { authJwt , access } = require("../../middleware");
const { brand_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/order/get/all",[authJwt.verifyToken], brand_controller.findAllBrands);

  app.get("/api/order/get",[authJwt.verifyToken], brand_controller.findOneBrand);

  app.post("/api/order/add",[authJwt.verifyToken, access.isAdmin], brand_controller.add);

  app.put("/api/order/update",[authJwt.verifyToken, access.isAdmin], brand_controller.updateOneBrand);

  app.delete("/api/order/delete",[authJwt.verifyToken, access.isAdmin], brand_controller.deleteOneBrand);

  app.get("/api/order/search",[authJwt.verifyToken], brand_controller.search);

};
