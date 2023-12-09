import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";

export const MelonDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_ADDRESS,
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Wallet],
  subscribers: [],
  migrations: [],
})

export const userRepository = MelonDataSource.getRepository(User);
export const walletRepository = MelonDataSource.getRepository(Wallet);