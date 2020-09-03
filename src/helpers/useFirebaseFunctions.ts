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
import { useAsyncRetry } from 'react-use';
import { useApi, googleAuthApiRef, errorApiRef } from '@backstage/core';
import { FunctionData } from '../types';
import { firebaseFunctionsApiRef } from '../api';
import { AuthMethod } from './ContextProvider';

export function useFirebaseFunctions({
  authMethod,
  project,
  apiKey,
}: {
  authMethod: AuthMethod;
  project: string;
  apiKey: string;
}) {
  const googleAuth = useApi(googleAuthApiRef);
  const firebaseFunctionsApi = useApi(firebaseFunctionsApiRef);
  const errorApi = useApi(errorApiRef);
  const { loading, value: functionsData, error, retry } = useAsyncRetry<
    FunctionData[]
  >(async () => {
    // TODO: handle message about wrong project name
    if (!project) {
      return [];
    }
    const googleIdToken = await googleAuth.getAccessToken([
      'https://www.googleapis.com/auth/cloud-platform',
    ]);
    try {
      const firebaseFunctions = await firebaseFunctionsApi.listFunctions({
        authMethod,
        googleIdToken,
        project,
        apiKey,
      });
      return firebaseFunctions.functionData;
    } catch (err) {
      errorApi.post(err);
      return [];
    }
  }, [project]);

  return [
    {
      loading,
      functionsData,
      error,
      retry,
    },
  ] as const;
}
