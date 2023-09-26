import Joi from "joi";

export const rentalSchema = Joi.object({
    customerId: Joi.number().integer().greater(0).required(),
    gameId: Joi.number().integer().greater(0).required(),
    daysRented: Joi.number().integer().greater(0).required(),
});