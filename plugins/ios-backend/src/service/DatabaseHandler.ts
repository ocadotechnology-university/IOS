import { PluginDatabaseManager, resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath('@internal/backstage-plugin-ios-backend', 'migrations');

type Options = {
  database: PluginDatabaseManager;
};

export class DatabaseHandler {
  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;
    const client = await database.getClient();

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseHandler(client);
  }

  private readonly client: Knex;

  private constructor(client: Knex) {
    this.client = client;
  }

  async insertComment(username: string, comment: string): Promise<void> {
    try {
      await this.client('ios-table').insert({ username, comment }); 
      console.log(`Username "${username}" and comment "${comment}" inserted successfully.`);
    } catch (error) {
      console.error('Error inserting value:', error);
      throw error;
    }
  }

  async deleteComment(username: string, comment: string): Promise<void> {
    try {
      await this.client('ios-table').where({ username, comment }).del();
      console.log(`Comment deleted successfully.`);
    } catch (error) {
      console.error('Error deleting value:', error);
      throw error;
    }
  }

  async getComments(): Promise<{ username: string; comment: string }[]> {
    try {
      const comments = await this.client('ios-table').select('username', 'comment');
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
  
}
