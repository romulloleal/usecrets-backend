import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class Notifications1674238024878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'newFollow',
              'followRequest',
              'followAccepted',
              'postLiked',
              'postMention',
            ],
          },
          {
            name: 'toUserId',
            type: 'uuid',
          },
          {
            name: 'fromUserId',
            type: 'uuid',
          },
          {
            name: 'followId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'likeId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'postId',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'newNotification',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    )

    await queryRunner.createForeignKeys('notifications', [
      new TableForeignKey({
        name: 'toUser',
        columnNames: ['toUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'fromUser',
        columnNames: ['fromUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'follow',
        columnNames: ['followId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'follows',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'like',
        columnNames: ['likeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_likes',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'post',
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      })
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('notifications', 'post')
    await queryRunner.dropForeignKey('notifications', 'like')
    await queryRunner.dropForeignKey('notifications', 'follow')
    await queryRunner.dropForeignKey('notifications', 'fromUser')
    await queryRunner.dropForeignKey('notifications', 'toUser')
    await queryRunner.dropTable('notifications')
  }
}
