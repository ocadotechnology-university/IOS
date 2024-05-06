import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import { Config, ConfigReader } from '@backstage/config';
import express, { request, response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { DatabaseHandler } from './DatabaseHandler';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  database: PluginDatabaseManager
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, database } = options;
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
      project_description, 
      project_manager_username, 
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
      project_rating,
      project_views,
      project_start_date,
    } = request.body;
    try {
      await dbHandler.insertProject(
        project_title, 
        project_description, 
        project_manager_username, 
        project_manager_ref,
        project_docs_ref,
        project_life_cycle_status,
        project_team_owner_name,
        project_team_owner_ref,
        project_rating,
        project_views,
        project_start_date,
      );
      response.status(200).send('Project inserted successfully.');
    } catch (error) {
      console.error('Error inserting project:', error);
      response.status(500).send('Internal server error');
    }
  });
  

  router.put('/projects', async (request, response) => {
    const {
      project_id, 
      project_title, 
      project_description, 
      project_manager_username,
      project_manager_ref,
      project_docs_ref,
      project_life_cycle_status,
      project_team_owner_name,
      project_team_owner_ref,
    } = request.body;
  
    const updates: { 
      project_title?: string, 
      project_description?: string, 
      project_manager_username?: string, 
      project_manager_ref?: string,
      project_docs_ref?: string,
      project_life_cycle_status?: string,
      project_team_owner_name?: string,
      project_team_owner_ref?: string,
    } = {};
    
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
  
  router.use(errorHandler()); 

  return router;
}
