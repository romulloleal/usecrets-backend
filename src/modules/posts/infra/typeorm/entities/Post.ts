import User from '@modules/users/infra/typeorm/entities/User'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  AfterLoad,
} from 'typeorm'
import PostLike from './PostLike'
import PostMention from './PostMention'

@Entity('posts')
class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  text: string

  @Column()
  image: string

  @Column()
  totalLikes: number

  @ManyToOne(() => User, user => user.posts)
  user: User

  @Column()
  userId: string

  @OneToMany(() => PostLike, postLike => postLike.post)
  postLikes: PostLike[]

  @OneToMany(() => PostMention, postMention => postMention.post)
  mentionedUsers: PostMention[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export default Post
