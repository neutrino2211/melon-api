import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";

import env from "dotenv";
env.config();

import auth from "./routes/auth";
import wallet from "./routes/wallet";
import { MelonDataSource } from "./utils/data-source";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(bodyParser.json())

MelonDataSource.initialize().then(() => {
    auth(app);
    wallet(app);
    app.get("/", (_, res) => res.status(200).send("Server running"))
    app.listen(PORT, () => {
        console.log("Listening...", PORT)
    })
})
.catch((error) => console.log(error))