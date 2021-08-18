import { Request, Response } from "express";

export function LivezHandler(req: Request, res: Response) {
  res
  .status(200)
  .send(JSON.stringify({
    status: "UP"
  }))
  .end()
}
