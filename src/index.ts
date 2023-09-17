import express from "express";
import bodyParser from "body-parser";

import env from "dotenv";
env.config();

import auth from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(bodyParser.json())

auth(app)

app.listen(PORT, () => {
    console.log("Listening...", PORT)
})