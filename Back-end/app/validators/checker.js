const httpError = require('http-errors');
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
const result = await db.findAndCountAll({ where: obj})
return (result.count)? result: httpError(400, "Some error occurred while retrieving this"+result);

}

const findById = async (db,id) => {
  
  //  validateId(id);
const result = await db.findByPk(id)

return result !== null? result: httpError(400, "Some error occurred while retrieving id="+id);

}
// exporting all the functions
module.exports = {
    ifExists,
    idExists,
    userIdExists,
    userExists,
    findById
}