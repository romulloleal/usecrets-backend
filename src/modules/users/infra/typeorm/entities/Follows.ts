import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('follows')
class Follows {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followerUserId: string;

  @OneToOne(() => User)
  @JoinColumn()
  followerUser: User

  @Column()
  followedUserId: string;

  @OneToOne(() => User)
  @JoinColumn()
  followedUser: User

  @Column()
  followRequest: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Follows;
