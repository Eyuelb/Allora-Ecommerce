const db = require("../../models");
const { product:Product} = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: products } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , products};
  };


exports.findAllProducts = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Product.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Products."
        });
      });

};

exports.findOneProduct = (req, res) => {
  const id = req.query.id

  Product.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Product with id=" + id
      });
    });
};


exports.add = (req, res) => {
    Product.create(req.body).then(product => {
         
        if(!product){
            res.status(400).send({ message: "Error while saving products" });
        }

        if(product){
            res.status(200).send({ message: product });
        }
        }).catch(err => {
          res.status(500).send({ message: err.message });
        });
    
};

exports.updateOneProduct = (req, res) => {
    const id = req.query.id;

Product.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Product was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};


exports.deleteOneProduct = (req, res) => {
    const id = req.query.id;

Product.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Product was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};


exports.search = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
var obj = {}
for(const key in condition) {

  obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    //console.log(`${key}: ${condition[key]}`);
}


Product.findAndCountAll({ 
      where: obj , limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };

