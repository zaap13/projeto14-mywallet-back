import { userCollection, sessionsCollection } from "../database/db.js";

export async function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  console.log(req.headers);

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await sessionsCollection.findOne({ token });

    const user = await userCollection.findOne({ _id: session?.userId });
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
