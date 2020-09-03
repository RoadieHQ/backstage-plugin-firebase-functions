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
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Link,
  Table as MuiTable,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { Table, TableColumn } from '@backstage/core';
import { useFirebaseFunctions } from '../helpers/useFirebaseFunctions';
import { FunctionData } from '../types';
import moment from 'moment';
import { useSettings } from '../helpers/ContextProvider';

const getElapsedTime = (start: string) => {
  return moment(start).fromNow();
};

const columnDefinitions: TableColumn<FunctionData>[] = [
  {
    title: 'Name',
    field: 'name',
    render: (row: Partial<FunctionData>) => {
      return (
        <Box fontWeight="fontWeightBold">
          <Link
            target="_blank"
            href={`https://console.cloud.google.com/functions/details/${row.region}/${row.name}?project=${row.project}`}
          >
            {row.name}
          </Link>
        </Box>
      );
    },
  },
  {
    title: 'Status',
    field: 'status',
    width: '150px',
    render: (row: Partial<FunctionData>) => (
      <Typography variant="body2" noWrap>
        {row.status!}
      </Typography>
    ),
  },
  {
    title: 'Region',
    field: 'region',
    width: '150px',
    render: (row: Partial<FunctionData>) => (
      <Typography variant="body2" noWrap>
        {row.region!}
      </Typography>
    ),
  },
  {
    title: 'Last modified',
    field: 'updateTime',
    width: '150px',
    render: (row: Partial<FunctionData>) => (
      <Typography variant="body2" noWrap>
        {getElapsedTime(row.updateTime!)}
      </Typography>
    ),
  },
  {
    title: 'Runtime',
    field: 'runtime',
    width: '150px',
    render: (row: Partial<FunctionData>) => (
      <Typography variant="body2" noWrap>
        {row.runtime}
      </Typography>
    ),
  },
  {
    title: 'Memory',
    field: 'availableMemoryMb',
    width: '150px',
    render: (row: Partial<FunctionData>) => (
      <Typography variant="body2" noWrap>
        {row.availableMemoryMb} MB
      </Typography>
    ),
  },
  {
    title: 'Logs',
    field: '',
    width: '150px',
    render: (row: Partial<FunctionData>) => {
      return (
        <Link
          href={`https://console.cloud.google.com/logs/viewer?project=${row.project}&resource=cloud_function%2Ffunction_name%2F${row.name}%2Fregion%2F${row.region}`}
          target="_blank"
        >
          view logs
        </Link>
      );
    },
  },
];

export const FirebaseFunctionsPageTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [filteredRows, setFilteredRows] = useState<FunctionData[]>([]);
  const [settings] = useSettings();
  const [tableProps] = useFirebaseFunctions({
    project: settings.project,
    authMethod: settings.authMethod,
    apiKey: settings.apiKey,
  });

  useEffect(() => {
    tableProps.retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.authMethod, settings.project]);

  useEffect(() => {
    setFilteredRows(
      tableProps.functionsData?.slice(page * pageSize, (page + 1) * pageSize) ??
        [],
    );
  }, [tableProps.functionsData, page, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Table
      isLoading={tableProps.loading || tableProps.loading}
      options={{
        paging: true,
        pageSize,

        padding: 'dense',
        paginationType: 'normal',
      }}
      totalCount={tableProps.functionsData?.length ?? 0}
      page={page}
      data={filteredRows ?? []}
      onChangePage={setPage}
      onChangeRowsPerPage={setPageSize}
      title={
        <>
          <Box display="flex" alignItems="center">
            <Box mr={1} />
            <Typography variant="h6">{settings.project}</Typography>
          </Box>
        </>
      }
      columns={columnDefinitions}
      detailPanel={(rowData: FunctionData) => {
        return (
          <Box display="flex" p={1}>
            <Box p={1} maxWidth="50%">
              <Typography>Env variables:</Typography>
              <MuiTable size="small" aria-label="env-variables">
                <TableBody>
                  {rowData.envVariables
                    ? Object.entries(rowData.envVariables).map(entry => (
                        <TableRow key={entry[0]}>
                          <TableCell>{entry[0]}</TableCell>
                          <TableCell>{entry[1]}</TableCell>
                        </TableRow>
                      ))
                    : 'no env variables found'}
                </TableBody>
              </MuiTable>
            </Box>
            <Box p={1} maxWidth="50%">
              <Typography>labels:</Typography>
              <MuiTable size="small" aria-label="labels">
                <TableBody>
                  {rowData.envVariables
                    ? Object.entries(rowData.labels).map(entry => (
                        <TableRow key={entry[0]}>
                          <TableCell>{entry[0]}</TableCell>
                          <TableCell>{entry[1]}</TableCell>
                        </TableRow>
                      ))
                    : 'no labels found'}
                </TableBody>
              </MuiTable>
            </Box>
          </Box>
        );
      }}
    />
  );
};
