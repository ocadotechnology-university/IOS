import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import { Config, ConfigReader } from '@backstage/config';
import express, { request, response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { DatabaseHandler } from './DatabaseHandler';
import { IdentityApi } from '@backstage/plugin-auth-node';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  database: PluginDatabaseManager
  identity: IdentityApi
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database, identity } = options;
  const dbHandler = await DatabaseHandler.create({ database });

  logger.info('Initializing IOS backend');

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.post('/projects', async (request, response) => {
    const { 
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
    } = request.body;
    
    try {
      const projectId = await dbHandler.insertProject(
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
      );
  
      // Respond with the project_id
      response.status(200).json({ project_id: projectId });
    } catch (error) {
      console.error('Error inserting project:', error);
      response.status(500).send('Internal server error');
    }
  });
  
  router.put('/projects/:project_id', async (request, response) => {
    const project_id_str = request.params.project_id;
    const project_id = parseInt(project_id_str, 10); 

    const {
      project_title, 
      project_description, 
      project_manager_username,
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
      project_version,
      project_repository_link,
    } = request.body;
  
    const date = new Date();
    const project_update_date = date.toISOString().slice(0, 19).replace('T', ' ');

    const updates: { 
      project_title?: string, 
      project_description?: string, 
      project_manager_username?: string, 
      project_manager_ref?: string,
      project_docs_ref?: string,
      project_life_cycle_status?: string,
      project_team_owner_name?: string,
      project_team_owner_ref?: string,
      project_version?: string,
      project_update_date?: string 
      project_repository_link?: string
    } = {};
    console.log("!!!!!", updates);
    if (project_title){
      updates.project_title = project_title;
    }

    if (project_description) {
      updates.project_description = project_description;
    }
  
    if (project_manager_username) {
      updates.project_manager_username = project_manager_username;
    }
  
    if (project_manager_ref) {
      updates.project_manager_ref = project_manager_ref;
    }
  
    if (project_docs_ref) {
      updates.project_docs_ref = project_docs_ref;
    }

    if (project_life_cycle_status) {
      updates.project_life_cycle_status = project_life_cycle_status;
    }

    if (project_team_owner_name) {
      updates.project_team_owner_name = project_team_owner_name;
    }

    if (project_team_owner_ref) {
      updates.project_team_owner_ref = project_team_owner_ref;
    }

    if (project_version){
      updates.project_version = project_version;
    }

    if (project_repository_link){
      updates.project_repository_link = project_repository_link;
    }

    updates.project_update_date = project_update_date;

    try {
    
      await dbHandler.updateProject(project_id, updates);
     
      response.status(200).send('Project updated successfully.');
    } catch (error) {
     
      console.error('Error updating project:', error);
      response.status(500).send('Internal server error.');
    }
  });

  router.delete('/projects/:project_id', async (request, response) => {
    const project_id_str = request.params.project_id;
    const project_id = parseInt(project_id_str, 10); 

    try {
      await dbHandler.deleteProject(project_id);
      response.status(200).send(`Value deleted successfully.`);
    } catch (error) {
      console.error('Error deleting value:', error);
      response.status(500).send('Internal server error');
    }
  });


  
  router.get('/projects', async (_, response) => {
    try {
      const projects = await dbHandler.getProjects();
      response.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      response.status(500).send('Internal server error');
    }
  });

  router.get('/projects/:entity_ref', async (request, response) => {
    const entity_ref = request.params.entity_ref;
    console.log("HELLOHELLOHELLO: ", entity_ref);
    try {
      const project = await dbHandler.getProjectByEntityRef(entity_ref);
      response.status(200).json(project);
    } catch (error) {
      console.error('Error fetching projects:', error);
      response.status(500).send('Internal server error');
    }
  });

  router.get('/ios_members/:project_id', async (request, response) => {
    const projet_id_str = request.params.project_id;
    const project_id = parseInt(projet_id_str, 10);
    try{ 
      const users = await dbHandler.getUsersByProjectID(project_id);
      response.status(200).json(users);
    } catch (error) {
      console.error('Error getting users: ', error);
      response.status(500).send('Internal server error');
    }
  });

  router.post('/ios_members/data', async (request, response) => {  // Change to POST method
    const { user_ref } = request.body;  // Extract user_ref from request body
    try {
        const user = await dbHandler.getUserByRef(user_ref);
        response.status(200).json(user);
    } catch (error) {
        console.error('Error fetching users:', error);
        response.status(500).send('Internal server error');
    }
  });


  router.post('/ios_members', async (request, response) => {
    const { 
      project_id,
      user_entity_ref,
      user_avatar // Add the new field here
    } = request.body;
    console.log("PROJECTID AND USERENTITYREF:", project_id, user_entity_ref)
    try {
      await dbHandler.addUser(
        project_id,
        user_entity_ref,
        user_avatar // Include the avatar_url in the dbHandler method
      );
      response.status(200).send('User created successfully.');
    } catch (error) {
      console.error('Error creating user:', error);
      response.status(500).send('Internal server error');
    }
  });
  

  router.put('/ios_members/:user_id', async (request, response) => {
    const user_id_str = request.params.user_id;
    const user_id = parseInt(user_id_str, 10); 
    const {
      user_projects_ids,
    } = request.body

    try {
      await dbHandler.updateUserProjects(user_id, user_projects_ids);
      response.status(200).send('User projects updated successfully.');
    } catch (error) {
      console.error('Error updating user projects:', error);
      response.status(500).send('Internal server error.');
    }
  });

  router.post('/projects/:project_id/comments', async (request, response) => {
    const project_id_ref_str = request.params.project_id;
    const project_id_ref = parseInt(project_id_ref_str, 10);
    const { 
      user_ref,
      comment_text,
    } = request.body;
    

    try {
      const projectVersions = await dbHandler.getProjectVersion(project_id_ref);
      const comment_version = projectVersions.length > 0 ? projectVersions[0].project_version : 'default-version';


      await dbHandler.insertComment(
        project_id_ref,
        user_ref,
        comment_text,
        comment_version,
      );
      response.status(200).send('Comment created successfully.');
    } catch (error) {
      console.error('Error creating comment:', error);
      response.status(500).send('Internal server error');
    }
  });

  router.get('/projects/:project_id/comments', async (request, response) => {
    const projet_id_str = request.params.project_id;
    const project_id = parseInt(projet_id_str, 10);
    try{ 
      const comments = await dbHandler.getCommentsByProjectID(project_id);
      response.status(200).json(comments);
    } catch (error) {
      console.error('Error getting comments: ', error);
      response.status(500).send('Internal server error');
    }
  });

  router.delete('/projects/:project_id/comments/:comment_id', async (request, response) => {
    const comment_id_str = request.params.comment_id;
    const comment_id = parseInt(comment_id_str, 10); 

    try {
      await dbHandler.deleteComment(comment_id);
      response.status(200).send(`Value deleted successfully.`);
    } catch (error) {
      console.error('Error deleting value:', error);
      response.status(500).send('Internal server error');
    }
  });

  router.put('/projects/:project_id', async (request, response) => {
    const project_id_str = request.params.project_id;
    const project_id = parseInt(project_id_str, 10); 
    const {
      project_views
    } = request.body
    try {
      await dbHandler.updateProjectViews(project_id, project_views);
      response.status(200).send('Project views updated successfully.');
    } catch (error) {
      console.error('Error updating project: views', error);
      response.status(500).send('Internal server error.');
    }
  });

  router.use(errorHandler()); 
  return router;
}