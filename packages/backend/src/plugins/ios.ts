import { createRouter } from '@internal/backstage-plugin-ios-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    identity: env.identity,
    config: env.config,
    database: env.database,
  });
}
