import { Router } from "express";
import { blochqWebhook } from "./blochq";

export default function load(app: Router) {
  app.post("/webhooks/blochq", blochqWebhook);
}