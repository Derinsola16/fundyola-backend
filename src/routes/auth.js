import express from "express";
import AuthController from "../app/controllers/AuthController.js";
const passport = require("passport");


const router = express.Router();


router.post("/login", AuthController.login);
router.get("/me", passport.authenticate('jwt', { session: false }), AuthController.me);


router.post("/setup-admin", AuthController.setUpAdmin);

export default router;
