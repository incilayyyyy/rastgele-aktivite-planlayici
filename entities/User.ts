import { Exclude } from 'class-transformer';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ObjectId, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('user')
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @Column({ default: false })
  status: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  constructor(name: string, email: string, password: string, admin?: boolean, status?: boolean) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.admin = admin ?? false;
    this.status = status ?? false;
  }
}