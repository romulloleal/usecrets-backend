import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class Follows1673733960910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'follows',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'followerUserId',
            type: 'uuid',
          },
          {
            name: 'followedUserId',
            type: 'uuid',
          },
          {
            name: 'followRequest',
            type: 'boolean',
            default: false
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

    await queryRunner.createForeignKeys('follows', [
      new TableForeignKey({
        name: 'follower_user',
        columnNames: ['followerUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      }),
      new TableForeignKey({
        name: 'followed_user',
        columnNames: ['followedUserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('follows', 'followed_user')
    await queryRunner.dropForeignKey('follows', 'follower_user')
    await queryRunner.dropTable('follows')
  }
}
