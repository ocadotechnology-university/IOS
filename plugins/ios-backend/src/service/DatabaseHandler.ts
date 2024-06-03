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
    project_repository_link: string,
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
        project_repository_link,
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
      project_repository_link: string
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
    project_repository_link: string, 
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
        'project_repository_link',
      );
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProjectByEntityRef(entity_ref: string): Promise<{ 
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
    project_repository_link: string,
  }[]> {
    try {
      const projects = await this.client('ios-table')
        .where('entity_ref', entity_ref)
        .select(
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
          'project_repository_link',
        );
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
 
  async getProjectByID(project_id: number): Promise<{ 
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
    project_repository_link: string,
  }[]> {
    try {
      const projects = await this.client('ios-table')
        .where('project_id', project_id)
        .select(
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
          'project_repository_link'
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
  
  async addUser(user_project_id: number, user_entity_ref: string, user_avatar: string): Promise<void> {
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
        user_projects_ids: [user_project_id], // Initialize with the project ID
        user_avatar
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

  async updateUserViewedProjects(
    user_entity_ref: string,
    viewed_project_id: number[]
  ): Promise<void> {
    try {
      const projectsArray = "{" + viewed_project_id.join(",") + "}";

        await this.client.raw(`
            UPDATE "ios-table-users"
            SET "viewed_projects_ids" = ?
            WHERE "user_entity_ref" = ?
        `, [projectsArray, user_entity_ref]);
        
      console.log(`User projects updated successfully.`);
    } catch (error) {
      console.error('Error updating user projects:', error);
      throw error;
    }
  }

  async getUsersViewedProjects(user_ref: string): Promise<number[]> {
    const result = await this.client
      .select('viewed_projects_ids')
      .from('ios-table-users')
      .where('user_entity_ref', user_ref);
  
    // Assuming result[0].viewed_projects_ids contains the JSON array
    return result.length > 0 ? JSON.parse(result[0].viewed_projects_ids) : [];
  }

  async updateUserRatedProjects(
    user_entity_ref: string,
    rated_project_id: number[]
  ): Promise<void> {
    try {
      const projectsArray = "{" + rated_project_id.join(",") + "}";

        await this.client.raw(`
            UPDATE "ios-table-users"
            SET "rated_projects_ids" = ?
            WHERE "user_entity_ref" = ?
        `, [projectsArray, user_entity_ref]);
        
      console.log(`User projects updated successfully.`);
    } catch (error) {
      console.error('Error updating user projects:', error);
      throw error;
    }
  }

  async deleteUserRatedProject(
    user_entity_ref: string,
    project_id_to_delete: number
  ): Promise<void> {
    try {
      // Fetch the current rated_projects_ids for the user
      const result = await this.client
        .select('rated_projects_ids')
        .from('ios-table-users')
        .where('user_entity_ref', user_entity_ref);
  
      if (result.length === 0) {
        console.log(`No user found with user_entity_ref: ${user_entity_ref}`);
        return;
      }
  
      // Parse the current rated_projects_ids
      let rated_projects_ids: number[] = result[0].rated_projects_ids || [];
      if (typeof rated_projects_ids === 'string') {
        rated_projects_ids = JSON.parse(rated_projects_ids);
      }
  
      // Filter out the project_id_to_delete
      const updated_rated_projects_ids = rated_projects_ids.filter(
        id => id !== project_id_to_delete
      );
  
      // Convert the array to the required format
      const projectsArray = "{" + updated_rated_projects_ids.join(",") + "}";
  
      // Update the database with the new array
      await this.client.raw(`
        UPDATE "ios-table-users"
        SET "rated_projects_ids" = ?
        WHERE "user_entity_ref" = ?
      `, [projectsArray, user_entity_ref]);
  
      console.log(`User projects updated successfully.`);
    } catch (error) {
      console.error('Error updating user projects:', error);
      throw error;
    }
  }
  

  async getUsersRatedProjects(user_ref: string): Promise<number[]> {
    const result = await this.client
      .select('rated_projects_ids')
      .from('ios-table-users')
      .where('user_entity_ref', user_ref);
  
    return result.length > 0 ? JSON.parse(result[0].rated_projects_ids) : [];
  }
  

  async getUsersByProjectID(projectId: number): Promise<Array<{ user_id: number; username: string; user_avatar: string; entity_ref: string }>> {
    const result = await this.client
        .select('user_avatar', 'user_entity_ref')
        .from('ios-table-users')
        .whereRaw('? = ANY(user_projects_ids)', [projectId]);
    return result;
  }

  async getUserByRef(EntityRef: string): Promise<{ user_avatar: string,}[]> {
    const result = await this.client('ios-table-users')
        .select('user_avatar')
        .where('user_entity_ref', EntityRef);
    return result;
  }



  async insertComment(
    project_id_ref: number,
    comment_id_ref: number,
    user_id_ref: string,
    comment_text: string,
    comment_version: string,
  ): Promise<void> {
    try {
      const date = new Date();
      const comment_date = date.toISOString().slice(0, 19).replace('T', ' ');
      console.log('Inserting comment with data:', {
        project_id_ref,
        user_id_ref,
        comment_id_ref,
        comment_text,
        comment_date,
        comment_version
      });
      await this.client('ios-table-comments')
        .insert({ 
          project_id_ref,
          user_id_ref,
          comment_id_ref,
          comment_text,
          comment_date,
          comment_version,
        }); 
      console.log(`Comment inserted successfully`);
    } catch (error) {
      console.error('Error inserting comment:', error);
      throw error;
    }
  }

  async getCommentsByProjectID(projectId: number): Promise<{ 
    comment_id: number,
    user_id_ref: string,
    comment_id_ref: number,
    comment_text: string,
    comment_date: Date,
    comment_version: string,
  }[]> {
    try {
      const comments = await this.client('ios-table-comments').select(
        'comment_id',
        'user_id_ref',
        'comment_id_ref',
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

  async getRepliesByCommentID(commentId: number): Promise<{ 
    comment_id: number,
    user_id_ref: string,
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
      .where('comment_id_ref', commentId);
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