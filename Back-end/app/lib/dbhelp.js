const httpError = require('http-errors');
const db = require("../models");
const { cart: Cart, user: User, cartItems: CartItems, product: Product } = db;
const { idExists, userIdExists, userExists, ifExists ,findById } = require("../validators/checker");
const Op = db.Sequelize.Op;

   
getCartProduct = async (cartId,user,cart,cartItems,product) => {

    let cartResult = await findById(cart,cartId);
    if (cartResult.userId && cartResult.id) {
      let userResult = await userExists(user,cartResult.userId);
      if (userResult) {
        let cartItemsResult = await ifExists(cartItems, { cartId: cartResult.id });
        if (cartItemsResult.count) {
      
          var chartItems = []; 
          var subTotal = 0
          for (var i = 0; i < cartItemsResult.count; i++){
      
       let productResult = await ifExists(product, { id: cartItemsResult.rows[i].productId });
       if (productResult.rows[0]) {
          var totalPrice = parseInt(cartItemsResult.rows[i].quantity) * parseInt(productResult.rows[0].productPrice)
            chartItems[i] = 
              { 
              chartItemId:cartItemsResult.rows[i].id,
              quantity: cartItemsResult.rows[i].quantity,
              totalPrice: totalPrice,
              productId: productResult.rows[0].id,
              productName: productResult.rows[0].productName,
              productShortDescription: productResult.rows[0].productShortDescription, 
              productPrice: productResult.rows[0].productPrice, 
              productMainImage: productResult.rows[0].productMainImage, 
              productPrice: productResult.rows[0].productPrice       
              }
            subTotal = parseInt(totalPrice) + parseInt(subTotal)
            }
            else{
              return httpError(400, "error occurred in product Id="+cartItemsResult.rows[i].productId);
            }
      

        }
        return {
          userId:userResult.id,
          cartId:cartId,
          subTotal:subTotal,
          chartItemsCount:cartItemsResult.count,

          chartItems
        }

      }
        else{
          return httpError(400, "error occurred while retrieving cart id="+cartResult.id);
        }
      }
      else{
        return httpError(400, "error occurred while retrieving user id="+cartResult.userId);
      }
    }
    else{
      return httpError(400, "error occurred while retrieving cartItems id="+cartId);
    }
    

    



};



module.exports = {
  getCartProduct
};
