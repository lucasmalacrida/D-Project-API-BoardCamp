import { Router } from "express";
import { postGame, getGames } from "../Controllers/gamesController.js";
import validateSchema from "../Middlewares/validateSchema.js";
import { gameSchema } from "../Schemas/gamesSchema.js";

const gamesRouter = Router();

gamesRouter.post('/games', validateSchema(gameSchema), postGame);
gamesRouter.get('/games', getGames);

export default gamesRouter;