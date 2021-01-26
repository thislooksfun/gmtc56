import { Request, Response, NextFunction } from "express";

type AsyncHandler<T> = (req: Request, res: Response) => Promise<T>;
type Handler = (req: Request, res: Response, next?: NextFunction) => void;

export default function wrap<T>(fn: AsyncHandler<T>): Handler {
  return (req, res, next) => fn(req, res).catch(next);
}
