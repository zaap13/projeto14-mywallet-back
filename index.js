import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

const userSchema = joi.object({
  email: joi.string().email().required(),
  name: joi.string().required().min(3).max(100),
  password: joi.string().required(),
});

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("myWallet");
const userCollection = db.collection("users");

// ROTAS
app.post("/sign-up", async (req, res) => {
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

    await userCollection.insertOne({ ...user, password: hashPassword });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const token = uuidV4();

  try {
    const userExists = await userCollection.findOne({ email });

    if (!userExists) {
      return res.sendStatus(401);
    }

    const passwordOk = bcrypt.compareSync(password, userExists.password);

    if (!passwordOk) {
      return res.sendStatus(401);
    }

    await db.collection("sessions").insertOne({
      token,
      userId: userExists._id,
    });

    res.send({ token });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/wallet", async (req, res) => {
  const itens = [
    { title: "Salario", date: "19/11", value: 1000, type: "inflow" },
    { title: "Aluguel", date: "19/11", value: 600, type: "outflow" },
    { title: "Contas", date: "19/11", value: 400, type: "outflow" },
    { title: "Salario", date: "19/11", value: 1000, type: "inflow" },
    { title: "Aluguel", date: "19/11", value: 600, type: "outflow" },
    { title: "Contas", date: "19/11", value: 400, type: "outflow" },
  ];

  const { authorization } = req.headers; // Bearer Token

  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    const user = await userCollection.findOne({ _id: session?.userId });
    if (!user) {
      return res.sendStatus(401);
    }

    delete user.password;

    res.send({ itens, user });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(4040, () => {
  console.log(`Server running in port: ${4040}`);
});
