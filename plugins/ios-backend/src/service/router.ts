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
  const { logger, config, database } = options;
  const dbHandler = await DatabaseHandler.create({ database });

  logger.info('Initializing IOS backend');

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/config/:configId', (request, response) => {
    const { configId } = request.params;
    logger.info('Get read config request');
    const value = config.getOptionalString(`ios.${configId}`);
    response.json({ response: value });
  });

  router.post('/db', async (request, response) => {
    const { project_name, project_description, project_owner, project_contributors } = request.body;
    try {
      await dbHandler.insertProject(project_name, project_description, project_owner, project_contributors);
      response.status(200).send('Project inserted successfully.');
    } catch (error) {
      console.error('Error inserting project:', error);
      response.status(500).send('Internal server error');
    }
  });
  

  router.put('/db', async (request, response) => {
    const { project_id, project_name, project_description, project_owner, project_contributors } = request.body;
  
    const updates: { project_name?: string, project_description?: string; project_owner?: string; project_contributors?: string } = {};
    
    if (project_name){
      updates.project_name = project_name;
    }

    if (project_description) {
      updates.project_description = project_description;
    }
  
    if (project_owner) {
      updates.project_owner = project_owner;
    }
  
    if (project_contributors) {
      updates.project_contributors = project_contributors;
    }
  
    try {
      await dbHandler.updateProject(project_id, updates);
      response.status(200).send('Project updated successfully.');
    } catch (error) {
      console.error('Error updating project:', error);
      response.status(500).send('Internal server error.');
    }
  });

  router.delete('/db', async (request, response) => {
    const { project_id } = request.body;

    try {
      await dbHandler.deleteProject(project_id);
      response.status(200).send(`Value deleted successfully.`);
    } catch (error) {
      console.error('Error deleting value:', error);
      response.status(500).send('Internal server error');
    }
  });


  router.get('/db', async (_, response) => {
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
