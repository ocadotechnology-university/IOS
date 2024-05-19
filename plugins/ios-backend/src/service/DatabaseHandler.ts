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

  async insertProject(
    project_title: string,
    entity_ref: string, 
    project_description: string, 
    project_manager_username: string,
    project_manager_ref: string,
    project_docs_ref: string,
    project_life_cycle_status: string,
    project_team_owner_name: string,
    project_team_owner_ref: string,
    project_rating: number,
    project_views: number,
    project_version: string,
  ): Promise<number> {
    try {
      const date = new Date();
      const preciseStartDate = date.toISOString().slice(0, 19).replace('T', ' ');
      
      const [project_id] = await this.client('ios-table').insert({ 
        project_title, 
        entity_ref,
        project_description, 
        project_manager_username, 
        project_manager_ref,
        project_docs_ref,
        project_life_cycle_status,
        project_team_owner_name,
        project_team_owner_ref,
        project_rating,
        project_views,
        project_version,
        project_start_date: preciseStartDate, 
        project_update_date: preciseStartDate,
      }).returning('project_id'); // Return the auto-generated project_id
      
      console.log(`Project inserted successfully with ID: ${project_id}`);
      return project_id;
    } catch (error) {
      console.error('Error inserting Project:', error);
      throw error;
    }
    
  }
  

  async updateProjectViews(
    project_id: number,
    views: number,
  ): Promise<void> {
    try {
      await this.client('ios-table')
        .where({ project_id }) 
        .update({ project_views: views });
      console.log(`Project views updated successfully.`);
    } catch (error) {
      console.error('Error updating project views:', error);
      throw error;
    }
  }

  async updateProjectRating(
    project_id: number,
    rating: number,
  ): Promise<void> {
    try {
      await this.client('ios-table')
        .where({ project_id }) 
        .update({project_rating: rating}); 
      console.log(`Project rating updated successfully.`);
    } catch (error) {
      console.error('Error updating project rating:', error);
      throw error;
    }
  }

  async updateProject(
    project_id: number,
    updates: Partial<{ 
      project_title: string, 
      entity_ref: string,
      project_description: string, 
      project_manager_username: string, 
      project_manager_ref: string,
      project_docs_ref: string,
      project_life_cycle_status: string,
      project_team_owner_name: string,
      project_team_owner_ref: string,
      project_version: string,
      project_update_date: Date
    }>
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

  async getProjects(): Promise<{ 
    project_id: number,
    entity_ref: string,
    project_title: string, 
    project_description: string, 
    project_manager_username: string,
    project_manager_ref: string,
    project_docs_ref: string,
    project_life_cycle_status: string,
    project_team_owner_name: string,
    project_team_owner_ref: string,
    project_rating: number,
    project_views: number,
    project_version: string,
    project_start_date: Date,
    project_update_date: Date 
  }[]> {
    try {
      const projects = await this.client('ios-table').select(
        'project_id',
        'entity_ref',
        'project_title', 
        'project_description', 
        'project_manager_username', 
        'project_manager_ref',
        'project_docs_ref',
        'project_life_cycle_status',
        'project_team_owner_name',
        'project_team_owner_ref',
        'project_rating',
        'project_views',
        'project_version',
        'project_start_date',
        'project_update_date',
      );
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProjectVersion(ProjectId: number): Promise<{ 
    project_version: string,
  }[]> {
    try {
      const project_version = await this.client('ios-table').select(
        'project_version',
      ).where('project_id', ProjectId);
      return project_version;
    } catch (error) {
      console.error('Error fetching project version:', error);
      throw error;
    }
  }
  
  async addUser(user_project_id: number, user_entity_ref: string): Promise<void> {
    console.log(`Adding user with project_id: ${user_project_id}, entity_ref: ${user_entity_ref}`);

    const user = await this.client('ios-table-users')
      .select('user_projects_ids')
      .where({ user_entity_ref })
      .first();

    console.log(`User found: ${JSON.stringify(user)}`);

    if (user) {
      await this.client.raw(`
        UPDATE "ios-table-users"
        SET "user_projects_ids" = array_append(user_projects_ids, ?)
        WHERE "user_entity_ref" = ?
      `, [user_project_id, user_entity_ref]);
    } else {
      await this.client('ios-table-users').insert({
        user_entity_ref,
        user_projects_ids: [user_project_id] // Initialize with the project ID
      });
    }
  }

  async updateUserProjects(
    user_id: number,
    user_projects_ids: number[]
  ): Promise<void> {
    try {
      const projectsArray = "{" + user_projects_ids.join(",") + "}";

        await this.client.raw(`
            UPDATE "ios-table-users"
            SET "user_projects_ids" = ?
            WHERE "user_id" = ?
        `, [projectsArray, user_id]);
        
      console.log(`User projects updated successfully.`);
    } catch (error) {
      console.error('Error updating user projects:', error);
      throw error;
    }
  }

  async getUsersByProjectID(projectId: number): Promise<Array<{ user_id: number; username: string; user_avatar: string; entity_ref: string }>> {
    const result = await this.client
        .select('user_id', 'username', 'user_avatar', 'entity_ref')
        .from('ios-table-users')
        .whereRaw('? = ANY(user_projects_ids)', [projectId]);
    return result;
  }

  async insertComment(
    project_id_ref: number,
    user_id_ref: number,
    comment_text: string,
    comment_version: string,

      ): Promise<void> {
    try {
      const date = new Date();
      const comment_date = date.toISOString().slice(0, 19).replace('T', ' ');
      await this.client('ios-table-comments')
        .insert({ 
          project_id_ref,
          user_id_ref,
          comment_text,
          comment_date,
          comment_version,
        }); 
      console.log(`Comment inserted succesfully`);
    } catch (error) {
      console.error('Error inserting comment:', error);
      throw error;
    }
  }

  async getCommentsByProjectID(projectId: number): Promise<{ 
    comment_id: number,
    user_id_ref: number,
    comment_text: string,
    comment_date: Date,
    comment_version: string,
  }[]> {
    try {
      const comments = await this.client('ios-table-comments').select(
        'comment_id',
        'user_id_ref',
        'comment_text',
        'comment_date',
        'comment_version',
      )
      .where('project_id_ref', projectId);
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async deleteComment(comment_id: number): Promise<void> {
    try {
      await this.client('ios-table-comments').where({ comment_id }).del();
      console.log(`Comment deleted successfully.`);
    } catch (error) {
      console.error('Error deleting value:', error);
      throw error;
    }
  }


  


}