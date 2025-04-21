import { Exclude } from 'class-transformer';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ObjectId, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('activity')
export class Activity {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  category: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  constructor(name: string, category: string) {
    this.name = name;
    this.category = category;
  }
}