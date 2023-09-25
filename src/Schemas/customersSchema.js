import Joi from "joi";

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().length(10).concat(Joi.string().length(11)).required(),
    cpf: Joi.string().length(11).required(),
    birthday: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});