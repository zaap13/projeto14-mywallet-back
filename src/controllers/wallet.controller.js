import { walletCollection } from "../database/db.js";

export async function getItens(req, res) {
  try {
    const user = req.user;

    const itens = await walletCollection.find({ userId: user._id }).toArray();
    delete user.password;

    res.send({ itens });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postItem(req, res) {
  const { title, date, value, type } = req.body;
  const user = req.user;
  try {
    await walletCollection.insertOne({
      userId: user._id,
      title,
      date,
      value,
      type,
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
