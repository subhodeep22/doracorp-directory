const validation = require("../../../lib/utils/validateSchema")
const tenantRepo = require("../../../lib/repository/tenantRepoPg");

module.exports.main =  async (event,context) => {
  const {payload} = event
  try {
    const { error } = validation.tenantBodyValidation(payload);
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
    const tenant = await tenantRepo.findOne({ email: payload.email });
    if (tenant){
      res = {
        statusCode: 400,
        body:{
          error: true, 
          message: "Tenant with given email already exist"
        }
      }
      return res
    }

    await tenantRepo.create({ ...payload });
    return res = {
      statusCode: 200,
      body:{
        error: false, 
        message: "Tenant Created successfully"
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