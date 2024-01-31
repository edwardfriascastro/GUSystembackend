import * as fs from 'fs';
import { GUSystemDataSource } from '../../src/datasource';

export class Seeder {
  public static async seed(entities: unknown[]) {
    for (const entity of entities) {
      const data = JSON.parse(
        fs.readFileSync(
          `${__dirname}/../seeds/${Seeder.pascalToCamel(
            (entity as { name: string }).name
          )}.json`,
          'utf-8'
        )
      );

      await GUSystemDataSource.manager.save(entity, data);
    }
  }

  public static pascalToCamel(pascalString: string): string {
    let camelString = pascalString[0].toLowerCase();

    for (let i = 1; i < pascalString.length; i++) {
      if (pascalString[i - 1] !== pascalString[i - 1].toLowerCase()) {
        camelString += pascalString[i].toLowerCase();
      } else {
        camelString += pascalString[i];
      }
    }

    return camelString;
  }
}
