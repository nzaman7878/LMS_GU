import express from "express";
import { educatorLogin } from "../controllers/educatorController.js";

const educatorRouter = express.Router();


educatorRouter.post("/login", educatorLogin);

export default educatorRouter;