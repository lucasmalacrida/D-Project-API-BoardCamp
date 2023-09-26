import { Router } from "express";
import { getRentals, postRental, returnRental, deleteRental } from "../Controllers/rentalsController.js";
import validateSchema from "../Middlewares/validateSchema.js";
import { rentalSchema } from "../Schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', validateSchema(rentalSchema), postRental);
rentalsRouter.post('/rentals/:id/return', returnRental);
rentalsRouter.delete('/rentals/:id', deleteRental);


export default rentalsRouter;