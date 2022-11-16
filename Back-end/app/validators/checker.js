const db = require("../models");
const { cart:Cart,user:User} = db;
const {validateId,validateUserId,validateUsername,validateEmail} = require("./validator");
const userExists = async (db,id) => {
  
  //  validateId(id);
  return await db.findByPk(id)
  .then(data => {
          if(data){
            return data;
          }
        })

        
        
}
const idExists = async (db,id) => {
  
  //  validateId(id);
  return await db.findAndCountAll({ 
    where: {id:id}})
    .then(data => {
      if(data){
        return data;
      }
    })
}
const  userIdExists = async (db,userId) => {

  //  validateUserId(userId);
  return await db.findAndCountAll({ 
        where: {userId:userId}})
        .then(data => {
          if(data){
            return data;
          }
        })
}

const ifExists = async (db,obj) => {
  
  //  validateId(id);
  return await db.findAndCountAll({ 
    where: obj})
    .then(data => {
      if(data){
        return data;
      }
    })
}

// exporting all the functions
module.exports = {
    ifExists,
    idExists,
    userIdExists,
    userExists
}