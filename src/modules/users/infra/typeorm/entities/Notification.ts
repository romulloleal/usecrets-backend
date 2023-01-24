import Post from '@modules/posts/infra/typeorm/entities/Post';
import PostLike from '@modules/posts/infra/typeorm/entities/PostLike';
import Follows from '@modules/users/infra/typeorm/entities/Follows';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum NotificationType {
  NEW_FOLLOW = 'newFollow',
  FOLLOW_REQUEST = 'followRequest',
  FOLLOW_ACCEPTED = 'followAccepted',
  POST_LIKED = 'postLiked',
  POST_MENTION = 'postMention'
}

@Entity('notifications')
class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: string;

  @Column()
  toUserId: string

  @OneToOne(() => User)
  @JoinColumn()
  toUser: User

  @Column()
  fromUserId: string

  @OneToOne(() => User)
  @JoinColumn()
  fromUser: User

  @Column()
  followId: string

  @OneToOne(() => Follows)
  @JoinColumn()
  follow: Follows

  @Column()
  likeId: string

  @OneToOne(() =>PostLike)
  @JoinColumn()
  like: PostLike

  @Column()
  postId: string

  @OneToOne(() => Post)
  @JoinColumn()
  Post: Post

  @Column()
  newNotification: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Notification;
