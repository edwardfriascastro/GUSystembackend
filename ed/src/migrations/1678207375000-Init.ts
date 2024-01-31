import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1678207375000 implements MigrationInterface {
    name = 'Init1678207375000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` varchar(36) NOT NULL,
                \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modificationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`username\` varchar(255) NOT NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`project\` (
                \`id\` varchar(36) NOT NULL,
                \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modificationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`description\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`clientCreatorId\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`client\` (
                \`id\` varchar(36) NOT NULL,
                \`creationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modificationDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`username\` varchar(255) NOT NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                UNIQUE INDEX \`IDX_6436cc6b79593760b9ef921ef1\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);

        
        await queryRunner.query(
            `INSERT INTO client (id, username, firstName, lastName, password, email, creationDate, modificationDate)
                   VALUES (UUID(), 'admin', 'jefry', 'cv', '$2b$10$IRMuj72wV1SHHijLgVfH7.6aIQ44xyhhxbUJFqCOisHscoKKd8xha',
                    'desarrollo@maillinator.com', DEFAULT, DEFAULT);`
          );
        await queryRunner.query(`
            CREATE TABLE \`project_users_user\` (
                \`projectId\` varchar(36) NOT NULL,
                \`userId\` varchar(36) NOT NULL,
                INDEX \`IDX_9666c6dcd769c698bed4aa4bf5\` (\`projectId\`),
                INDEX \`IDX_f8300efd87679e1e21532be980\` (\`userId\`),
                PRIMARY KEY (\`projectId\`, \`userId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD CONSTRAINT \`FK_adbf164ecf03117da5daeb79b78\` FOREIGN KEY (\`clientCreatorId\`) REFERENCES \`client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_users_user\`
            ADD CONSTRAINT \`FK_9666c6dcd769c698bed4aa4bf55\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_users_user\`
            ADD CONSTRAINT \`FK_f8300efd87679e1e21532be9808\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            CREATE TABLE \`query-result-cache\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`identifier\` varchar(255) NULL,
                \`time\` bigint NOT NULL,
                \`duration\` int NOT NULL,
                \`query\` text NOT NULL,
                \`result\` text NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`query-result-cache\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_f8300efd87679e1e21532be9808\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project_users_user\` DROP FOREIGN KEY \`FK_9666c6dcd769c698bed4aa4bf55\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_adbf164ecf03117da5daeb79b78\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_f8300efd87679e1e21532be980\` ON \`project_users_user\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_9666c6dcd769c698bed4aa4bf5\` ON \`project_users_user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`project_users_user\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_6436cc6b79593760b9ef921ef1\` ON \`client\`
        `);
        await queryRunner.query(`
            DROP TABLE \`client\`
        `);
        await queryRunner.query(`
            DROP TABLE \`project\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    }

}
