import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class PostMentions1674469919129 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'post_mentions',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'postId',
              type: 'uuid',
            },
            {
              name: 'userId',
              type: 'uuid',
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

      await queryRunner.createForeignKeys('post_mentions', [
        new TableForeignKey({
          name: 'post',
          columnNames: ['postId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'posts',
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          name: 'mention',
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
        }),
      ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('post_mentions', 'mention')
      await queryRunner.dropForeignKey('post_mentions', 'post')
      await queryRunner.dropTable('post_mentions')
    }

}
