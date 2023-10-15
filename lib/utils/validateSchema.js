const Joi = require("joi");

module.exports.tenantBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Tenant Name"),
        email: Joi.string().email().required().label("Email"),
    });
    return schema.validate(body);
};

module.exports.actionBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Action Name")
    });
    return schema.validate(body);
};

module.exports.groupBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Group Name"),
        desc: Joi.string().required().label("Description"),
    });
    return schema.validate(body);
}

module.exports.roleBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Tenant Name"),
        desc: Joi.string().required().label("Description"),
        prodName: Joi.string().required().label("Product Name"),
        tenantEmail: Joi.string().required().label("Tenant Email"),
        actionName: Joi.string().required().label("Action Name")
    });
    return schema.validate(body);
}