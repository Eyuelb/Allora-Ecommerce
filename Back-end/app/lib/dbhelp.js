const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: addresss } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , addresss};
  };

module.exports.searchAll  =  (dataTable,req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
    var obj = {}
   
   
    if(req.body.userId){
    dataTable.findAndCountAll({ 
        where:  {
          userId:req.body.userId}, limit, offset })
        .then(data => {
          const response = getPagingData(data, page, limit);
          return response;
        })
        .catch(err => {
            return { message:err.message || "Some error occurred while retrieving tutorials." };
           });
    };
    
    if(!req.body.userId){
      for(const key in condition) {
    
        obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
          //console.log(`${key}: ${condition[key]}`);
      }
    
      dataTable.findAndCountAll({ 
        where: obj , limit, offset })
        .then(data => {
          const response = getPagingData(data, page, limit);
          return response;
        })
        .catch(err => {
         return { message:err.message || "Some error occurred while retrieving tutorials." };
        });
    };
}