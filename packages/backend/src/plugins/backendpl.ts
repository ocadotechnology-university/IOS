import { createRouter } from '@internal/backstage-plugin-backendpl-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import knex from 'knex';

export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const db: knex<any, unknown[]> = await env.database.getClient();
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  const model = new BackendplDatabaseModel(db);
  return await createRouter({
    model: model,
    logger: env.logger,
  });
}