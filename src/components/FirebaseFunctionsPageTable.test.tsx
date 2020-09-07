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
import { render } from '@testing-library/react';
import { FirebaseFunctionsPageTable } from './FirebaseFunctionsPageTable';
import { ContextProvider, Settings } from '../helpers/ContextProvider';
import {
  googleAuthApiRef,
  errorApiRef,
  ApiRegistry,
  ApiProvider,
} from '@backstage/core';
import { firebaseFunctionsApiRef } from '../api';
import { useSettings } from '../helpers/useSettings';
import { useFirebaseFunctions } from '../helpers/useFirebaseFunctions';
jest.mock('../helpers/useSettings');
jest.mock('../helpers/useFirebaseFunctions');

describe('FirebaseFunctionsTable', () => {
  it('should inform about project name not set and not call an api', async () => {
    const apis = ApiRegistry.from([
      [googleAuthApiRef, []],
      [firebaseFunctionsApiRef, []],
      [errorApiRef, []],
    ]);
    (useSettings as any).mockReturnValue([
      {
        project: '',
        authMethod: 'OAuth2',
        apiKey: '',
      } as Settings,
    ]);
    (useFirebaseFunctions as any).mockReturnValue({
      functionsData: [],
      retry: () => {},
    });
    const rendered = render(
      <ApiProvider apis={apis}>
        <ContextProvider>
          <FirebaseFunctionsPageTable />
        </ContextProvider>
      </ApiProvider>,
    );
    expect(
      await rendered.findByText('Set project name to fetch data'),
    ).toBeInTheDocument();
  });

  it('should render table list items', async () => {
    const apis = ApiRegistry.from([
      [googleAuthApiRef, []],
      [firebaseFunctionsApiRef, []],
      [errorApiRef, []],
    ]);
    (useSettings as any).mockReturnValue([
      {
        project: 'test-project',
        authMethod: 'OAuth2',
        apiKey: '',
      } as Settings,
    ]);
    (useFirebaseFunctions as any).mockReturnValue({
      functionsData: mockedFunctionsData,
      retry: () => {},
    });
    const rendered = render(
      <ApiProvider apis={apis}>
        <ContextProvider>
          <FirebaseFunctionsPageTable />
        </ContextProvider>
      </ApiProvider>,
    );

    expect(await rendered.findByText('helloMarek')).toBeInTheDocument();
  });
});

var mockedFunctionsData = [
  {
    name: 'helloMarek',
    urlTrigger:
      'https://us-central1-backstage-test-project.cloudfunctions.net/helloMarek',
    status: 'ACTIVE',
    updateTime: '2020-09-04T09:08:15.967Z',
    runtime: 'nodejs10',
    availableMemoryMb: 256,
    project: 'backstage-test-project',
    region: 'us-central1',
    labels: {
      'deployment-tool': 'cli-firebase',
    },
    envVariables: {
      FIREBASE_CONFIG:
        '{"projectId":"backstage-test-project","databaseURL":"https://backstage-test-project.firebaseio.com","storageBucket":"backstage-test-project.appspot.com"}',
    },
    tableData: {
      id: 0,
    },
  },
  {
    name: 'helloMarek10',
    urlTrigger:
      'https://us-central1-backstage-test-project.cloudfunctions.net/helloMarek10',
    status: 'ACTIVE',
    updateTime: '2020-09-04T09:07:35.517Z',
    runtime: 'nodejs10',
    availableMemoryMb: 256,
    project: 'backstage-test-project',
    region: 'us-central1',
    labels: {
      'deployment-tool': 'cli-firebase',
    },
    envVariables: {
      FIREBASE_CONFIG:
        '{"projectId":"backstage-test-project","databaseURL":"https://backstage-test-project.firebaseio.com","storageBucket":"backstage-test-project.appspot.com"}',
    },
    tableData: {
      id: 1,
    },
  },
];
