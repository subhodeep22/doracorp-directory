const db = require("../utils/dbConnect");
const errorResponse = require("../utils/errorResponse");
const errorConstant = require("../utils/errorConstant");
const { PreparedStatement: PS } = require("pg-promise");
const Group = require("../models/group");

module.exports.findOne = async (args) => {
  try {
    const queryFindTenant = new PS({
      name: "find-tenant",
      text: "select tenantID from auth.tenants where email = $1",
      values: [args.tenantEmail],
    });
    const tenant = await db.one(queryFindTenant);
    if (Object.keys(tenant).length != 0) {
      const queryFindGroup = new PS({
        name: "find-group",
        text: "SELECT * FROM auth.groups WHERE name = $1 and tenantID = $2",
        values: [args.groupName, tenant.tenantID],
      });
      const group = await db.one(queryFindGroup);
      return group;
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
    const queryFindTenant = new PS({
      name: "find-tenant",
      text: "select tenantID from auth.tenants where email = $1",
      values: [args.tenantEmail],
    });
    const tenant = await db.one(queryFindTenant);
    if (Object.keys(tenant).length != 0) {
      const cs = new pgp.helpers.ColumnSet(["name", "desc", "tenantID"], {
        table: "groups",
        schema: "auth",
      });
      const values = [new Group(args.name, args.desc, tenant.tenantID)];
      const queryInsertGroup = pgp.helpers.insert(values, cs) + "RETURNING id";
      const transaction = await db.tx("insertion", (t) => {
        return t.any(queryInsertGroup);
      });
      return transaction;
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
