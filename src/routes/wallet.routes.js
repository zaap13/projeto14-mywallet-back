import { getItens, postItem } from "../controllers/wallet.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { walletMiddleware } from "../middlewares/wallet.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/wallet", getItens);
router.post("/wallet", walletMiddleware, postItem);
export default router;
