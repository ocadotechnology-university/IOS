import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const iosPlugin = createPlugin({
  id: 'ios',
  routes: {
    root: rootRouteRef,
  },
});

export const IosPage = iosPlugin.provide(
  createRoutableExtension({
    name: 'IosPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
