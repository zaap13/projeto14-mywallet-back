import express from "express";
import cors from "cors";
import signRouter from "./routes/sign.routes.js";
import walletRouter from "./routes/wallet.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(signRouter);
app.use(walletRouter);

app.listen(4040, () => {
  console.log(`Server running in port: ${4040}`);
});
