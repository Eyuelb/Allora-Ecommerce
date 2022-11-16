const { authJwt , access } = require("../../middleware");
const { cartItems_controller,cart_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get("/api/cartItems/get/all",[authJwt.verifyToken], cartItems_controller.findAllCartItems);

  app.get("/api/cartItems/get",[authJwt.verifyToken], [cart_controller.add,cartItems_controller.findOneCartItems]);

  app.post("/api/cartItems/add",[authJwt.verifyToken, access.isAdmin], [cart_controller.add,cartItems_controller.add]);

  app.put("/api/cartItems/update",[authJwt.verifyToken, access.isAdmin], cartItems_controller.updateOneCartItems);

  app.delete("/api/cartItems/delete",[authJwt.verifyToken, access.isAdmin], cartItems_controller.deleteOneCartItems);

  app.get("/api/cartItems/search",[authJwt.verifyToken], cartItems_controller.search);

};
