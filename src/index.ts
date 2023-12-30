import env from "dotenv";
env.config()


import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";

import auth from "./routes/auth";
import user from "./routes/user";
import bills from "./routes/bills";
import wallet from "./routes/wallet";
import webhooks from "./routes/webhooks";
import { MelonDataSource } from "./utils/data-source";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(bodyParser.json())

MelonDataSource.initialize().then(() => {
    auth(app);
    user(app);
    bills(app);
    wallet(app);
    webhooks(app)

    app.get("/", (_, res) => res.status(200).send("Server running"))
    
    app.listen(PORT, () => {
        console.log("Listening...", PORT)
    })
})
.catch((error) => console.log(error))