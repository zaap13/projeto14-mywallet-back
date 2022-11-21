import { userCollection, sessionsCollection } from "../database/db.js";

export async function postSignUp(req, res) {
  const user = req.hashUser;
  try {
    await userCollection.insertOne(user);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postSignIn(req, res) {
  try {
    const token = req.token;
    await sessionsCollection.insertOne(token);

    res.send(token);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
