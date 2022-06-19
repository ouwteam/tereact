import express from "express";

const router = express.Router();
router.post("/create", (req, res) => {});
router.get("/detail/:room_id", (req, res) => {});
router.post("/add-user/:room_id", (req, res) => {});

export = { router };