module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    status: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    stripeChargeId: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    amountCharged: {
      type: Sequelize.INTEGER,
     // allowNull: false
    },
    createdby: {
        type: Sequelize.STRING,
       // allowNull: false
    },
    updatedby: {
        type: Sequelize.STRING,
        // allowNull defaults to true
    },
  });

  return Order;
};
