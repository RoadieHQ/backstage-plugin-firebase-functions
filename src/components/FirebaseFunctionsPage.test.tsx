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
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import {
  googleAuthApiRef,
  errorApiRef,
  ApiRegistry,
  ApiProvider,
} from '@backstage/core';
import { firebaseFunctionsApiRef, FirebaseFunctionsClient } from '../api';
import { getEntityMock, getEntityMockMultipleFunctions } from '../plugin';
import FirebaseFunctionsPage from './FirebaseFunctionsPage';
import { rest } from 'msw';
import { msw } from '@backstage/test-utils';
import { setupServer } from 'msw/node';

const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const mockGoogleAuth = {
  getAccessToken: async () => 'test-token',
};

const apis = ApiRegistry.from([
  [googleAuthApiRef, mockGoogleAuth],
  [firebaseFunctionsApiRef, new FirebaseFunctionsClient()],
  [errorApiRef, errorApiMock],
]);

describe('FirebaseFunctionsTable', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();
    worker.use(
      rest.get('*', (_, res, ctx) =>
        res(ctx.status(200), ctx.json(getMockedFunctionData())),
      ),
    );
  });

  it('should inform about project name not set and not call an api', async () => {
    const rendered = render(
      <ApiProvider apis={apis}>
        <FirebaseFunctionsPage entity={getEntityMockMultipleFunctions()} />
      </ApiProvider>,
    );
    expect(
      await rendered.findByText('Select projects to fetch data'),
    ).toBeInTheDocument();
  });

  it('should render function details', async () => {
    const rendered = render(
      <ApiProvider apis={apis}>
        <FirebaseFunctionsPage entity={getEntityMock()} />
      </ApiProvider>,
    );
    await waitForElementToBeRemoved(() => rendered.getByRole('progressbar'));
    expect(await rendered.findByText('helloMarek')).toBeInTheDocument();
  });
});

function getMockedFunctionData() {
  return {
    name:
      'projects/backstage-test-project/locations/us-central1/functions/helloMarek',
    httpsTrigger: {
      url:
        'https://us-central1-backstage-test-project.cloudfunctions.net/helloMarek',
    },
    status: 'ACTIVE',
    updateTime: '2020-09-04T09:08:15.967Z',
    runtime: 'nodejs10',
    availableMemoryMb: 256,
    project: 'backstage-test-project',
    region: 'us-central1',
    labels: {
      'deployment-tool': 'cli-firebase',
    },
    environmentVariables: {
      FIREBASE_CONFIG:
        '{"projectId":"backstage-test-project","databaseURL":"https://backstage-test-project.firebaseio.com","storageBucket":"backstage-test-project.appspot.com"}',
    },
    tableData: {
      id: 0,
    },
  };
}
