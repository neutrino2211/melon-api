import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TransactionType {
  data = "data",
  airtime = "airtime",
  transfer = "transfer"
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  type: TransactionType = TransactionType.transfer;

  @Column()
  completed: boolean = false;

  @Column()
  reference: string = "";

  @Column()
  sourceWallet: number = 0;

  @Column()
  recipientName: string = "";

  @Column()
  recipientAccountNumber: string = "";

  @Column()
  recipientBankCode: string = "";
}