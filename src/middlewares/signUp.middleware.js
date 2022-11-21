import { userSchema } from "../models/user.model.js";
import { userCollection } from "../database/db.js";
import bcrypt from "bcrypt";

export async function signUpMiddleware(req, res, next) {
  const user = req.body;
  try {
    const userExists = await userCollection.findOne({ email: user.email });
    if (userExists) {
      return res.status(409).send({ message: "Esse email já existe" });
    }

    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    const hashPassword = bcrypt.hashSync(user.password, 10);

    req.hashUser = { ...user, password: hashPassword };

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
