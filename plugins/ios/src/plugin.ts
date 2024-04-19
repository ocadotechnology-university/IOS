import { 
  createPlugin, 
  createRoutableExtension,
  createApiFactory,
  identityApiRef,
  discoveryApiRef,
  fetchApiRef
} from '@backstage/core-plugin-api';
import { iosApiRef, IosClient } from './api';
import { rootRouteRef } from './routes';

export const iosPlugin = createPlugin({
  id: 'ios',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: iosApiRef,
      deps: {
        identityApi: identityApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ identityApi, discoveryApi, fetchApi }) =>
      new IosClient({ identityApi, discoveryApi, fetchApi }),
    })
  ]
});

export const IosPage = iosPlugin.provide(
  createRoutableExtension({
    name: 'IosPage',
    component: () =>
      import('./components/HomePage').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
