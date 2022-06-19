import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { env } from "../utils/helper";
import { User } from "../models/user.model";

export async function handleRegistration(req: Request, res: Response) {
  const post = req.body;
  if (!post.username) {
    return res.status(400).send({
      message: "username is required",
    });
  }

  if (!post.password) {
    return res.status(400).send({
      message: "password is required",
    });
  }

  try {
    var chks = await User.findAll({
      where: {
        username: post.username,
      },
    });

    if (chks.length > 0) {
      throw `Username "${post.username}" is already taken.`;
    }

    var userData = await User.create({
      username: post.username,
      password: await bcrypt.hash(post.password, parseInt(env("SALT_ROUNDS"))),
    });
  } catch (error) {
    console.error(error);
    error = typeof error == "string" ? error : "Gagal menyimpan data";
    return res.status(400).send({
      message: error,
    });
  }

  return res.send({
    message: null,
    data: {
      user: userData,
    },
  });
}

export async function handleLogin(req: Request, res: Response) {
  const post = req.body;
  if (!post.username) {
    return res.status(400).send({
      message: "username is required",
    });
  }

  if (!post.password) {
    return res.status(400).send({
      message: "password is required",
    });
  }

  try {
    var userData = await User.findOne({
      where: {
        username: post.username,
      },
    });

    if (!userData) {
      throw `Username "${post.username}" is not registered.`;
    }

    var ok = bcrypt.compareSync(post.password, userData.password!);
    if (!ok) {
      throw `Password is incorrect.`;
    }
  } catch (error) {
    console.error(error);
    error = typeof error == "string" ? error : "Gagal menyimpan data";
    return res.status(400).send({
      message: error,
    });
  }

  userData.password = undefined;
  return res.send({
    message: null,
    data: {
      user: userData,
    },
  });
}

export async function handleDetailUser(req: Request, res: Response) {
  const user_id = req.params.user_id;
  const userData = await User.findByPk(user_id);
  if (!userData) {
    return res.status(400).send({
      message: "User not found",
    });
  }

  userData.password = undefined;
  return res.send({
    message: null,
    user: userData,
  });
}
