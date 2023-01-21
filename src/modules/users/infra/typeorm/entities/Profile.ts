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

@Entity('profile')
class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string

  @Column()
  userName: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  profileImage: string | null;

  @Column({
    type: 'varchar',
    nullable: true
  })
  coverImage: string | null;

  @Column()
  privateProfile: boolean

  @OneToOne(() => User, user => user.profile)
  @JoinColumn()
  user: User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Profile;
