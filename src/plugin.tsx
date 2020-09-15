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
} from '@backstage/core';
import FirebaseFunctionsPage from './components/FirebaseFunctionsPage';
import { Entity } from '@backstage/catalog-model';
import { firebaseFunctionsApiRef, FirebaseFunctionsClient } from './api';

export const standaloneRootRouteRef = createRouteRef({
  path: '/firebase-functions',
  title: 'Firebase functions list',
});

export const rootRouteRef = createRouteRef({
  path: '',
  title: 'Firebase functions list',
});

export const plugin = createPlugin({
  id: 'firebase-functions',
  apis: [
    createApiFactory(firebaseFunctionsApiRef, new FirebaseFunctionsClient()),
  ],
});

export const pluginStandalone = createPlugin({
  id: 'firebase-functions',
  register({ router }) {
    router.addRoute(standaloneRootRouteRef, () => (
      <FirebaseFunctionsPage entity={getEntityMock()} />
    ));
  },
});

export function getEntityMock(): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        'backstage.io/managed-by-location':
          'github:https://github.com/mcalus3/sample-service/blob/master/backstage.yaml',
        'circleci.com/project-slug': 'RoadieHQ/sample-service',
        'github.com/project-slug': 'RoadieHQ/sample-service',
        'backstage.io/github-actions-id': 'RoadieHQ/sample-service',
        'cloud.google.com/function-ids':
          'projects/backstage-test-project/locations/us-central1/functions/helloMarek,projects/backstage-test-project/locations/us-central1/functions/helloWorld,projects/backstage-test-project2/locations/us-central1/functions/helloMarek,projects/backstage-test-project2/locations/us-central1/functions/helloWorld',
      },
      name: 'sample-service',
      description:
        'A service for testing Backstage functionality. For example, we can trigger errors\non the sample-service, these are sent to Sentry, then we can view them in the \nBackstage plugin for Sentry.\n',
      uid: 'b47ae42c-2a18-41bb-b21b-9310adccb9f3',
      etag: 'OGE4MzJiNWQtNzM0OC00ZmExLTgzNjItNjljZDlkZDNmMTY4',
      generation: 1,
    },
    spec: {
      type: 'service',
      owner: 'david@roadie.io',
      lifecycle: 'experimental',
    },
  };
}
