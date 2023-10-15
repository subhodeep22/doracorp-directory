const db = require("../utils/dbConnect")

module.exports.findOne = async (args)=>{
    try {
        const tenant = await db.one('SELECT * FROM auth.tenants WHERE email = $1', [args.email]);
        return tenant
    } 
    catch(e) {
        throw new Error("Database error!")
    }
}

module.exports.create = async (args)=>{
    try {
        await db.any("INSERT INTO auth.tenants(name, email)VALUES ($1, $2);", [args.name,args.email]);
    } 
    catch(e) {
        throw new Error("Database error!")
    }
}