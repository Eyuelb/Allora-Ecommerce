const db = require("../../models");
const { cart: Cart, user: User, cartItems: CartItems, product: Product } = db;
const { idExists, userIdExists, userExists, ifExists } = require("../../validators/checker");
const { getCartProduct } = require("../../lib/dbhelp");
const Op = db.Sequelize.Op;


const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: carts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , carts};
  };


exports.findAllCarts = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Cart.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Carts."
        });
      });

};

exports.findOneCart = async (req, res) => {
  
  let id = (!req.query.id)? req.cartId : req.query.id
  let result = await getCartProduct(id,User,Cart,CartItems,Product);

  if(result.message){
   return res.status(400).send(result);
  }
  else if(result){
    return res.status(200).send(result);
  }
  else{
    return res.status(500).send({message:"Error retrieving Cart with id=" + req.cartId});
  }

};


exports.add = async (req, res, next) => {

    const id = req.userId
    
    if(userExists(User,id) !== null){

        if(userIdExists(Cart,id) !== null){
          let result = await userIdExists(Cart,id);
          req.cartId = result.rows[0].id
          next()
       
       //res.status(200).send({ message: result.rows[0].id });
        }
        else{
        Cart.create({userId:id})
        .then(cart => {
         if(!cart){ res.status(400).send({ message: "Error while saving cart" }); }
         if(cart){ res.status(200).send({ message: cart });}
        })
         .catch(err => { res.status(500).send({message:err.message || "Some error occurred while saving Cart."});
        });
        }
    }
    else{
          return res.status(500).send({message:"UserID=" + id +" doesn't exist"});
    }

  
};




exports.deleteOneCart = (req, res) => {
    const id = req.query.id;

Cart.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cart was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Cart with id=${id}. Maybe Cart was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Could not delete Cart with id=" + id
      });
    });
};



exports.search = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
    var obj = {}
    
if(req.body.userId){
  Cart.findAndCountAll({ 
    where:  {
      userId:req.body.userId}, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Cart."
      });
    });
};


if(!req.body.userId){
  for(const key in condition) {

    obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
  }

  Cart.findAndCountAll({ 
    where: obj , limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Cart."
      });
    });
};


if(req.body.id){
  Cart.findAndCountAll({ 
    where:  {
      id:req.body.id}, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Cart."
      });
    });
};

if(!req.body.id){
  for(const key in condition) {

    obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
  }

  Cart.findAndCountAll({ 
    where: obj , limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Cart."
      });
    });
};




}





