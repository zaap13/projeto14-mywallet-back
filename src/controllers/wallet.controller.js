import { walletCollection } from "../database/db.js";

export async function getItens(req, res) {
  try {
    const user = req.user;

    const itens = await walletCollection.find({ userId: user._id }).toArray();
    delete user.password;

    res.send({ user, itens });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postItem(req, res) {
  try {
    await walletCollection.insertOne(req.item);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
