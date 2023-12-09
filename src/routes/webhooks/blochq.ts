import { Request, Response } from "express";
import * as crypto from "crypto";

export async function blochqWebhook(req: Request, res: Response) {
  //validate event
  const hash = crypto.createHmac('sha256', process.env.BLOCHQ_WEBHOOK_KEY!!).update(JSON.stringify(req.body)).digest('hex');
  console.log(process.env.BLOCHQ_WEBHOOK_KEY, hash, req.headers, req.headers['x-bloc-webhook'])
  if (hash == req.headers['x-bloc-webhook']) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event
    console.log(event)  
  }
  res.sendStatus(200);
}