import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Post from './Post';

@Entity('post_likes')
class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string

  @ManyToOne(() => Post, (post) => post.postLikes)
  post: Post

  @Column()
  postId: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default PostLike;
