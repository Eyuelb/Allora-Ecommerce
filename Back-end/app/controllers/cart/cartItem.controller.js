const { where } = require("sequelize");
const db = require("../../models");
const { cart: Cart, user: User, cartItems: CartItems, product: Product } = db;
const { idExists, userIdExists, userExists, ifExists } = require("../../validators/checker");
const Op = db.Sequelize.Op;


const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: CartItems } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);


  return { totalItems, totalPages, currentPage, CartItems };
};


exports.findAllCartItems = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  CartItems.findAndCountAll({ limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CartItems."
      });
    });

};

exports.findOneCartItems = (req, res) => {
  const id = req.query.id

  CartItems.findByPk(id)
    .then(data => {
      if (data) {
        return res.status(200).send(data);
      }
      if (!data) {
        return res.status(500).send({ message: "Error retrieving CartItems with id=" + id });
      }

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CartItems."
      });
    });

};


exports.add = async (req, res, next) => {

  const { productId, quantity } = req.body
  let result = await idExists(Product, productId);
  if (result.count) {
    if (result.rows[0].productQuantity == 0) {
      return res.status(400).send({ message: "Product is out of stock" });
    }
    else if (result.rows[0].productMaximumQuantityAllowed < quantity) {
      return res.status(400).send({ message: "Product allowed quantity per sell is Maximum=" + result.rows[0].productMaximumQuantityAllowed + ". Please adjust ur quantity" });
    }
    else if (result.rows[0].productMinimumQuantityAllowed > quantity) {
      return res.status(400).send({ message: "Product allowed quantity per sell is Minimum=" + result.rows[0].productMinimumQuantityAllowed + ". Please adjust ur quantity" });
    }
    else {

      let result2 = await ifExists(CartItems, { productId: productId });
      if (result2.count) {
        const newQuantity = parseInt(result2.rows[0].quantity) + parseInt(quantity);

        if (result.rows[0].productMaximumQuantityAllowed < newQuantity) {
          return res.status(400).send({ message: "you have reached the maximum quantity available for this item" });
        }
        else if (result.rows[0].productMinimumQuantityAllowed > newQuantity) {
          return res.status(400).send({ message: "Product allowed quantity per sell is Minimum=" + result.rows[0].productMinimumQuantityAllowed + ". Please adjust ur quantity" });
        }
        else {
          req.body.quantity = newQuantity;
          CartItems.update(req.body, {
            where: {
              id: result2.rows[0].id
            }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: newQuantity
                });
              } else {
                res.send({
                  message: `Cannot update CartItems with id=${result2.rows[0].id}. Maybe CartItems was not found!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving CartItems."
              });
            });

        }


        //   return res.status(200).send({message:result2});
      }
      else {
        CartItems.create({
          cartId: req.cartId,
          productId: productId,
          quantity: quantity
        }).then(cartItems => {

          if (!cartItems) {
            res.status(400).send({ message: "Error while saving cartItems" });
          }

          if (cartItems) {
            res.status(200).send({ message: cartItems });
          }
        }).catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving CartItems."
          });
        });
      }


    }


  }
  else {
    return res.status(500).send({ message: "ProductID=" + productId + " doesn't exist" });
  }


};

exports.updateOneCartItems = (req, res) => {
  const id = req.query.id;

  CartItems.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "CartItems was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update CartItems with id=${id}. Maybe CartItems was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CartItems."
      });
    });
};


exports.deleteOneCartItems = (req, res) => {
  const id = req.query.id;

  CartItems.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "CartItems was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete CartItems with id=${id}. Maybe CartItems was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Could not delete CartItems with id=" + id
      });
    });
};



exports.search = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  var condition = req.body
  var obj = {}

  if (req.body.userId) {
    CartItems.findAndCountAll({
      where: {
        userId: req.body.userId
      }, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };


  if (!req.body.userId) {
    for (const key in condition) {

      obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    }

    CartItems.findAndCountAll({
      where: obj, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };


  if (req.body.id) {
    CartItems.findAndCountAll({
      where: {
        id: req.body.id
      }, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };

  if (!req.body.id) {
    for (const key in condition) {

      obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    }

    CartItems.findAndCountAll({
      where: obj, limit, offset
    })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CartItems."
        });
      });
  };




}





