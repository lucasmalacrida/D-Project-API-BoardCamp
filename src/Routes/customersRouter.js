import { Router } from "express";
import { postCustomer, getCustomers, putCustomer } from "../Controllers/customersController.js";
import validateSchema from "../Middlewares/validateSchema.js";
import { customerSchema } from "../Schemas/customersSchema.js";
import { getCustomerById } from "../Controllers/customersController.js";

const customersRouter = Router();

customersRouter.post('/customers', validateSchema(customerSchema), postCustomer);
customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomerById);
customersRouter.put('/customers/:id', validateSchema(customerSchema), putCustomer);

export default customersRouter;