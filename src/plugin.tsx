/*
 * Copyright 2020 RoadieHQ
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import {
  createPlugin,
  createRouteRef,
  createApiFactory,
  BackstagePlugin,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core';
import FirebaseFunctionsPage from './components/FirebaseFunctionsPage';
import { firebaseFunctionsApiRef, FirebaseFunctionsClient } from './api';
import { entityMock } from './mocks/mocks';

export const standaloneRootRouteRef: any = createRouteRef({
  path: '/firebase-functions',
  title: 'Firebase functions list',
});

export const entityContentRouteRef: any = createRouteRef({
  title: 'Firebase functions Entity Content',
});

export const firebaseFunctionsPlugin: BackstagePlugin = createPlugin({
  id: 'firebase-functions',
  apis: [
    createApiFactory(firebaseFunctionsApiRef, new FirebaseFunctionsClient()),
  ],
  routes: {
    entityContent: entityContentRouteRef,
  },
});

export const EntityFirebaseFunctionsContent = firebaseFunctionsPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: entityContentRouteRef,
  }),
);

export const EntityFirebaseFunctionsCard = firebaseFunctionsPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/FirebaseFunctionDetailsCard').then(
          m => m.FirebaseFunctionDetailsCard,
        ),
    },
  }),
);

export const pluginStandalone: BackstagePlugin = createPlugin({
  id: 'firebase-functions',
  register({ router }) {
    router.addRoute(standaloneRootRouteRef, () => (
      <FirebaseFunctionsPage entity={entityMock} />
    ));
  },
});
