import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({default: 0})
  balance: number = 0;

  @Column({nullable: true})
  user: number = 0;
}