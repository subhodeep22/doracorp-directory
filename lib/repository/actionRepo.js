const db = require("../utils/dbConnect");
const errorResponse = require("../utils/errorResponse");
const errorConstant = require("../utils/errorConstant");
const { PreparedStatement: PS } = require("pg-promise");
const Action = require("../models/action");

module.exports.findOne = async (args) => {
  try {
    const queryFindProduct = new PS({
      name: "find-product",
      text: "select prodID from product.products where name = $1",
      values: [args.prodName],
    });
    const product = await db.one(queryFindProduct);
    if (Object.keys(product).length != 0) {
      const queryFindAction = new PS({
        name: "find-action",
        text: "SELECT * FROM auth.actions WHERE name = $1 and prodID = $2",
        values: [args.actionName, product.prodID],
      });
      const action = await db.one(queryFindAction);
      return action;
    } else {
      return Promise.reject(
        new errorResponse(errorConstant.INTERNAL_SERVER_ERROR)
      );
    }
  } catch (e) {
    return Promise.reject(
      new errorResponse(errorConstant.INTERNAL_SERVER_ERROR)
    );
  }
};

module.exports.create = async (args) => {
  try {
    await db.any("INSERT INTO auth.actions(name)VALUES ($1);", [args.name]);
  } catch (e) {
    throw new Error("Database error!");
  }
};
