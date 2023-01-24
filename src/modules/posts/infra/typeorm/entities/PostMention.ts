import User from '@modules/users/infra/typeorm/entities/User';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Post from './Post';

@Entity('post_mentions')
class PostMention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string

  @ManyToOne(() => Post, (post) => post.mentionedUsers)
  post: Post

  @Column()
  userId: string

  @OneToOne(() => User)
  @JoinColumn()
  user: User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default PostMention;
