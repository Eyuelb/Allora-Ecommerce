const db = require("../../models");
const { cart: Cart, user: User, cartItems: CartItems, product: Product } = db;
const { idExists, userIdExists, userExists, ifExists ,findById } = require("../../validators/checker");
const Op = db.Sequelize.Op;

   
getCartProduct = async (cartId,user,cart,cartItems,product) => {

    let cartResult = await findById(cart,cartId);
    //cartResult?'':'';
    return cartResult;
//     let userResult = await ifExists(user, { id: cartResult.userId });
//     let cartItemsResult = await ifExists(cartItems, { cartId: cartResult.id });
    
//     var chartItems = []; 
//     for (var i = 0; i < result2.count; i++){

//  let productResult = await ifExists(product, { id: cartItemsResult.rows[i].productId });
//       chartItems[i] = 
//         { 
//         id: productResult.rows[0].id,
//         productId: productResult.rows[0].productId,
//         productName: productResult.rows[0].productName,
//         productShortDescription: productResult.rows[0].productShortDescription, 
//         productPrice: productResult.rows[0].productPrice, 
//         productMainImage: productResult.rows[0].productMainImage, 
//         productPrice: productResult.rows[0].productPrice,
//         quantity: cartItemsResult.rows[i].quantity
                    
//         }
//       }

//     return {
//         userId:userResult.rows[0].id,
//         cartId:cartId,
//         chartItemsCount:cartItemsResult.count,
//         chartItems
//       }


};

const cart = {
    checkResetpassword: checkResetpassword
};

module.exports = cart;
