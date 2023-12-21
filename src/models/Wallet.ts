import { Column, Entity, PrimaryGeneratedColumn, Tree } from "typeorm";

export enum AccountProviders {
  blochq = 'blochq',
};

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({default: 0})
  balance: number = 0;

  @Column({nullable: true})
  user: number = 0;

  @Column({nullable: true, type: "enum", enum: AccountProviders})
  accountType: AccountProviders = AccountProviders.blochq;

  @Column({nullable: true})
  accountNumber: string = "";

  @Column({nullable: true})
  accountName: string = "";

  @Column({nullable: true})
  bankName: string = "";

  @Column({nullable: true})
  accountId: string = '';
}