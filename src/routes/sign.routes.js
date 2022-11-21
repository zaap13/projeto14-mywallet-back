import { postSignIn, postSignUp } from "../controllers/sign.controller.js";
import { Router } from "express";
import { signUpMiddleware } from "../middlewares/signUp.middleware.js";
import { signInMiddleware } from "../middlewares/signIn.middleware.js";

const router = Router();

router.post("/sign-up", signUpMiddleware, postSignUp);

router.post("/sign-in", signInMiddleware, postSignIn);

export default router;
