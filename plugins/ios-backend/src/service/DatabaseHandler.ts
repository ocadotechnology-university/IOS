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

  async insertProject(project_name: string, project_description: string, project_owner: string, project_contributors: string): Promise<void> {
    try {
      await this.client('ios-table').insert({ project_name, project_description, project_owner, project_contributors }); 
      console.log(`Project inserted succesfully`);
    } catch (error) {
      console.error('Error inserting Project:', error);
      throw error;
    }
  }

  async updateProject(
    project_id: number,
    updates: Partial<{ project_name: string, project_description: string; project_owner: string; project_contributors: string }>
  ): Promise<void> {
    try {
      await this.client('ios-table')
        .where({ project_id }) 
        .update(updates); 
      console.log(`Project updated successfully.`);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(project_id: number ): Promise<void> {
    try {
      await this.client('ios-table').where({ project_id }).del();
      console.log(`Project deleted successfully.`);
    } catch (error) {
      console.error('Error deleting value:', error);
      throw error;
    }
  }

  async getProjects(): Promise<{ project_id: number, project_name: string, project_description: string, project_owner: string, project_contributors: string }[]> {
    try {
      const projects = await this.client('ios-table').select('project_id', 'project_name', 'project_description', 'project_owner', 'project_contributors');
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
  
}
