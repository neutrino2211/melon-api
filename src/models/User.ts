import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({nullable: true})
  name: string = "";

  @Column({unique: true})
  email: string = "";

  @Column()
  password: string = "";

  @Column({nullable: true})
  dateOfBirth: Date = new Date()

  @Column({nullable: true})
  pin: string = "";

  @Column({nullable: true})
  authorisationCode: string = "";

  @Column({nullable: true})
  verificationPending: boolean = true;

  @Column({nullable: true})
  phone: string = "";

  @Column({nullable: true})
  bvn: string = "";
}