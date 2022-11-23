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

  



  app.get("/api/cartItems/get/list",[authJwt.verifyToken], [cart_controller.add,cart_controller.findOneCart]);

  app.post("/api/cartItems/add",[authJwt.verifyToken, access.isAdmin], [cart_controller.add,cartItems_controller.add]);
  
  app.put("/api/cartItems/quantity/add",[authJwt.verifyToken, access.isAdmin], [cart_controller.add,cartItems_controller.AddOneCartItemProductQuantity]);

  app.put("/api/cartItems/quantity/delete",[authJwt.verifyToken, access.isAdmin], [cart_controller.add,cartItems_controller.deleteOneCartItemProductQuantity]);

  app.delete("/api/cartItems/deleteOne",[authJwt.verifyToken, access.isAdmin], cartItems_controller.deleteOneCartItem);

  app.delete("/api/cartItems/deleteAll",[authJwt.verifyToken, access.isAdmin], cartItems_controller.deleteAllCartItem);

  app.get("/api/cartItems/search",[authJwt.verifyToken], cartItems_controller.search);  

};
