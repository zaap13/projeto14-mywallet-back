import { loginSchema } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { sessionsCollection, userCollection } from "../database/db.js";

export async function signInMiddleware(req, res, next) {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  const { email, password } = req.body;

  const token = uuid();

  try {
    const userExists = await userCollection.findOne({ email });

    if (!userExists) {
      return res.sendStatus(401);
    }

    const passwordOk = bcrypt.compareSync(password, userExists.password);

    if (!passwordOk) {
      return res.sendStatus(401);
    }

    const userSession = await sessionsCollection.findOne({
      userId: userExists._id,
    });

    if (userSession) {
      await sessionsCollection.deleteOne({ userId: userExists._id });
    }

    req.token = {
      token,
      userId: userExists._id,
    };
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
