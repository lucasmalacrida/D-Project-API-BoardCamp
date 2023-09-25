import { Router } from "express";
import gamesRouter from "./gamesRouter.js";
import costumersRouter from "./costumersRouter.js";
import rentalsRouter from "./rentalsRouter.js";

const router = Router();

router.use(gamesRouter);
router.use(costumersRouter);
router.use(rentalsRouter);

export default router;