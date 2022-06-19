import express from "express";
import {
  handleDetailUser,
  handleLogin,
  handleRegistration,
} from "../services/user";

const router = express.Router();
router.post("/login", handleLogin);
router.post("/register", handleRegistration);
router.get("/detail/:user_id", handleDetailUser);

export = { router };
