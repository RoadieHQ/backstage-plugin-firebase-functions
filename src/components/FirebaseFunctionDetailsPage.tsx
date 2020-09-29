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
  Link,
  TableContainer,
  Card,
  LinearProgress,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Grid,
} from '@material-ui/core';
import { InfoCard, StructuredMetadataTable } from '@backstage/core';
import moment from 'moment';
import { useFunctionIds } from '../hooks/useFunctionIds';
import { useSingleFirebaseFunction } from '../hooks/useSingleFirebaseFunction';

export const FirebaseFunctionDetailsPage: React.FC = () => {
  const { functions: whitelistedFunctions } = useFunctionIds();
  const { loading, functionData } = useSingleFirebaseFunction(
    whitelistedFunctions[0],
  );

  return (
    <TableContainer component={Card}>
      {loading || !functionData ? (
        <LinearProgress />
      ) : (
        <InfoCard
          title={
            <Link
              href={`https://console.cloud.google.com/functions/details/${functionData.region}/${functionData.name}?project=${functionData.project}`}
              target="_blank"
            >
              {functionData.name}
            </Link>
          }
        >
          <Grid container spacing={1}>
            <Grid item md={4}>
              <StructuredMetadataTable
                metadata={{
                  status: functionData.status,
                  'last modified': moment(functionData.updateTime).fromNow(),
                  project: functionData.project,
                  region: functionData.region,
                  runtime: functionData.runtime,
                  memory: functionData.availableMemoryMb,
                  logs: (
                    <Link
                      href={`https://console.cloud.google.com/logs/viewer?project=${functionData.project}&resource=cloud_function%2Ffunction_name%2F${functionData.name}%2Fregion%2F${functionData.region}`}
                      target="_blank"
                    >
                      view logs
                    </Link>
                  ),
                }}
              />
            </Grid>
            <Grid item md={4}>
              <Typography>Env variables:</Typography>
              <MuiTable size="small" aria-label="env-variables">
                <TableBody>
                  {functionData.envVariables
                    ? Object.entries(functionData.envVariables).map(entry => (
                        <TableRow key={entry[0]}>
                          <TableCell>{entry[0]}</TableCell>
                          <TableCell>{entry[1]}</TableCell>
                        </TableRow>
                      ))
                    : 'no env variables found'}
                </TableBody>
              </MuiTable>
            </Grid>
            <Grid item md={4}>
              <Typography>labels:</Typography>
              <MuiTable size="small" aria-label="labels">
                <TableBody>
                  {functionData.envVariables
                    ? Object.entries(functionData.labels).map(entry => (
                        <TableRow key={entry[0]}>
                          <TableCell>{entry[0]}</TableCell>
                          <TableCell>{entry[1]}</TableCell>
                        </TableRow>
                      ))
                    : 'no labels found'}
                </TableBody>
              </MuiTable>
            </Grid>
          </Grid>
        </InfoCard>
      )}
    </TableContainer>
  );
};
