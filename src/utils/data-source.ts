import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";

export const MelonDataSource = new DataSource({
  type: "postgres",
  host: "170.187.194.231",
  port: 5432,
  username: "admin",
  password: process.env.POSTGRES_PASSWORD,
  database: "Melon",
  synchronize: true,
  logging: true,
  entities: [User, Wallet],
  subscribers: [],
  migrations: [],
})

export const userRepository = MelonDataSource.getRepository(User);
export const walletRepository = MelonDataSource.getRepository(Wallet);