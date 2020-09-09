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

import {
  FirebaseFunctionsApi,
  ListFunctionsArgs,
} from './firebaseFunctionsApi';
import { FunctionData, FunctionDataDTO } from '../types';

class FetchError extends Error {
  get name(): string {
    return this.constructor.name;
  }

  static async forResponse(resp: Response): Promise<FetchError> {
    return new FetchError(
      `Request failed with status code ${
        resp.status
      }.\nReason: ${await resp.text()}`,
    );
  }
}

async function fetch<T = any>(url: string, init?: RequestInit): Promise<T> {
  const resp = await window.fetch(`${url}`, init);
  if (!resp.ok) throw await FetchError.forResponse(resp);
  return await resp.json();
}

export class FirebaseFunctionsClient implements FirebaseFunctionsApi {
  async listFunctions({ googleIdToken, projects }: ListFunctionsArgs) {
    let functionData: FunctionData[] = [];
    //Fetch data for each of selected projects
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];

      let url = `https://cloudfunctions.googleapis.com/v1/projects/${project}/locations/-/functions?pageSize=50`;
      const init = {
        method: 'get',
      } as RequestInit;
      init.headers = new Headers({
        Authorization: `Bearer ${googleIdToken}`,
      });
      const fetchedData = [] as FunctionDataDTO[];
      let resp = null;
      do {
        // for subsequent calls include nextPageToken
        if (resp) {
          url = url + '?pageToken=$' + encodeURIComponent(resp.nextPageToken);
        }
        resp = await fetch<{
          functions: FunctionDataDTO[];
          nextPageToken: string;
        }>(url, init);
        fetchedData.push(...resp.functions);
      } while (resp && resp.nextPageToken);

      functionData = functionData.concat(
        fetchedData.map(
          (r: any) =>
            ({
              name: r.name.split('/').pop(),
              urlTrigger: r.httpsTrigger!.url,
              status: r.status,
              updateTime: r.updateTime,
              runtime: r.runtime,
              availableMemoryMb: r.availableMemoryMb,
              project: project,
              region: r.name.split('/').slice(-3)[0],
              labels: r.labels,
              envVariables: r.environmentVariables,
            } as FunctionData),
        ),
      );
    }
    return { functionData };
  }
}
