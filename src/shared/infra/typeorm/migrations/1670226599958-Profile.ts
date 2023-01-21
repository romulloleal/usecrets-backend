import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class Profile1670226599958 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profile',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid'
          },
          {
            name: 'userName',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'profileImage',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'coverImage',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'privateProfile',
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

    await queryRunner.createForeignKey('profile',
      new TableForeignKey({
        name: 'user',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('profile', 'user')
    await queryRunner.dropTable('profile')
  }
}
