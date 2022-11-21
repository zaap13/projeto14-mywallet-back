import { itemSchema } from "../models/item.model.js";
import dayjs from "dayjs";

export function walletMiddleware(req, res, next) {
  const { title, value, type } = req.body;
  const user = req.user;

  const { error } = itemSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  req.item = {
    userId: user._id,
    title,
    date: dayjs(Date.now()).format("DD/MM"),
    value,
    type,
  };

  next();
}
