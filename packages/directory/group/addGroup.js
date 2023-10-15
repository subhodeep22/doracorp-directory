const validation = require("../../../lib/utils/validateSchema");
const groupRepo = require("../../../lib/repository/groupRepo");
const validateToken = require("../../../lib/utils/validateToken")

module.exports.main = async (event, context) => {
  const { payload, headers } = event;
  //validate access token
  try {
    const {tokenDetails} = validateToken.validateAuthToken(headers.Authorization)
  } catch (err) {
    console.log(err);
    return (res = {
      statusCode: 403,
      body: {
        error: true,
        message: "Invalid Authorization Token",
      },
    });
  }

  try {
    //validate request header
    //validate request body
    const { error } = validation.groupBodyValidation(payload);
    if (error) {
      res = {
        statusCode: 400,
        body: {
          error: true,
          message: error.details[0].message,
        },
      };
      return res;
    }

    
    const group = await groupRepo.findOne({
      name: payload.name,
      tenantEmail: payload.tenantEmail,
    });
    if (group) {
      res = {
        statusCode: 400,
        body: {
          error: true,
          message: "Group with given Name and product already exist",
        },
      };
      return res;
    }

    await groupRepo.create({ ...payload });
    return (res = {
      statusCode: 200,
      body: {
        error: false,
        message: "Group Created successfully",
      },
    });
  } catch (err) {
    console.log(err);
    return (res = {
      statusCode: 500,
      body: {
        error: true,
        message: "Internal Server Error",
      },
    });
  }
};
