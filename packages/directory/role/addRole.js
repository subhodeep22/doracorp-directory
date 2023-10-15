const validation = require("../../../lib/utils/validateSchema")
const roleRepo = require("../../../lib/repository/roleRepo");

module.exports.main =  async (event,context) => {
  const {payload} = event
  try {
    const { error } = validation.roleBodyValidation(payload);
    if (error){
        res = {
          statusCode: 400,
          body:{
            error: true, 
            message: error.details[0].message
          }
        }
      return res
    }
    const role = await roleRepo.findOne({ name: payload.name,prodName: payload.prodName });
    if (role){
      res = {
        statusCode: 400,
        body:{
          error: true, 
          message: "Role with given Name and product already exist"
        }
      }
      return res
    }

    await roleRepo.create({ ...payload });
    return res = {
      statusCode: 200,
      body:{
        error: false, 
        message: "Role Created successfully"
      }
    }
  } catch (err) {
      console.log("Internal Server Error");
      return res = {
        statusCode: 400,
        body:{
          error: true, 
          message: "Internal Server Error"
        }
      }
  }
}