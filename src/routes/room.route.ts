import express from "express";
import * as route from "../services/room";

const router = express.Router();
router.post("/create", route.createRoom);
router.get("/detail/:room_id", route.getRoomDetail);
router.post("/add-user/:room_id", route.addUserToRoom);

export = { router };