import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { iosPlugin, IosPage } from '../src/plugin';

createDevApp()
  .registerPlugin(iosPlugin)
  .addPage({
    element: <IosPage />,
    title: 'Root Page',
    path: '/ios'
  })
  .render();
