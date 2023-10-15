const db = require("../utils/dbConnect")

module.exports.findOne = async (args)=>{
    try {
        const role = await db.one('SELECT name, desc, prodId, tenantId, actionId FROM auth.roles WHERE name = $1 and prodId = (select id from products.products where name = $2)', [args.name,args.prodName]);
        return role
    } 
    catch(e) {
        throw new Error("Database error!")
    }
}

module.exports.create = async (args)=>{
    try {
        // Get ProdId, actionId from db
        const product = await db.one("select prodId from product.products where prodName = $1", [args.prodName])
        if(Object.keys(product).length != 0){
            const tenant = await db.one("select tenantId from auth.tenants where email = $1", [args.tenantEmail])
            if(Object.keys(tenant).length != 0){
                const action = await db.one("select id from auth.actions where name = $1 and prodId = $2", [args.actionName,product.prodId])
                if(Object.keys(action).length != 0){
                    await db.any("INSERT INTO auth.roles(name, desc, prodId, tenantId, actionId)VALUES ($1, $2, $3, $4, $5);", [args.name,args.desc, product.prodId, tenant.tenantId, action.actionId]);
                }
            }
        }
    } 
    catch(e) {
        throw new Error("Database error!")
    }
}