import { Request, Response } from "express";

export function handleIndex(req: Request, res: Response) {
  res.send({
    httpVersion: req.httpVersion,
  });
}
