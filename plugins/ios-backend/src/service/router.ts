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

  router.post('/db/:username/:comment', async (request, response) => { 
    const { username, comment } = request.params;
    try {
      await dbHandler.insertComment(username, comment); 
      response.status(200).send('Value inserted successfully.');
    } catch (error) {
      console.error('Error inserting value:', error);
      response.status(500).send('Internal server error');
    }
  }); 
  

  router.delete('/db/:username/:comment', async (request, response) => {
    const { username, comment } = request.params;

    try {
      await dbHandler.deleteComment(username, comment);
      response.status(200).send(`Value deleted successfully.`);
    } catch (error) {
      console.error('Error deleting value:', error);
      response.status(500).send('Internal server error');
    }
  });


  router.get('/db/get', async (_, response) => {
    try {
      const comments = await dbHandler.getComments();
      response.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      response.status(500).send('Internal server error');
    }
  });
  
  router.use(errorHandler()); 

  return router;
}
