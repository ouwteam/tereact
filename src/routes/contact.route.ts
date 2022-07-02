import express from "express";
import * as route from "../services/contact";

const router = express.Router();
router.get("/list", route.getListRoom);
router.get("/detail/:contact_id", route.getDetail);
router.get("/delete/:contact_id", route.deleteContact);
router.post("/add", route.addContact);

export = { router };