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
import React, { useEffect } from 'react';
import {
  Typography,
  Box,
  Link,
  Table as MuiTable,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
  CircularProgress,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import { Table, TableColumn } from '@backstage/core';
import { useFirebaseFunctions } from '../../hooks/useFirebaseFunctions';
import { FunctionData } from '../../types';
import moment from 'moment';
import { useSettings } from '../../hooks/useSettings';
import { useProjectIds } from '../../hooks/useProjectIds';
import { Settings } from '../ContextProvider';

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
    title: 'Project',
    field: 'project',
    render: (row: Partial<FunctionData>) => (
      <Typography variant="body2" noWrap>
        {row.project!}
      </Typography>
    ),
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
  const [settings, setSettings] = useSettings();
  const { value: availableProjects, loading, error } = useProjectIds();
  const tableProps = useFirebaseFunctions({
    //TODO: Modify useFirebaseFunctions to fetch data for multiple projects
    project: settings.projects[0],
  });

  useEffect(() => {
    tableProps.retry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.projects]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSettings({ projects: event.target.value as string[] });
  };

  return (
    <Table
      isLoading={tableProps.loading || tableProps.loading}
      options={{
        padding: 'dense',
      }}
      data={tableProps.functionsData ?? []}
      title={
        loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography>
            {'Error occured while loading available projects: ' + error}
          </Typography>
        ) : (
          <FormControl>
            <InputLabel id="project-ids-label">Select projects</InputLabel>
            <Select
              style={{ minWidth: '150px' }}
              labelId="project-ids-label"
              id="project-ids"
              multiple
              renderValue={selected => (selected as string[]).join(', ')}
              value={settings.projects}
              onChange={handleChange}
              input={<Input />}
            >
              {availableProjects?.map(name => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={settings.projects.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
      columns={columnDefinitions}
      localization={getLocalizationObject(settings, tableProps)}
      detailPanel={DetailPanel}
    />
  );
};

function getLocalizationObject(
  settings: Settings,
  tableProps: {
    readonly loading: boolean;
    readonly error: Error | undefined;
  },
) {
  const message = !settings.projects
    ? 'Select projects to fetch data'
    : tableProps.loading
    ? 'loading'
    : tableProps.error
    ? 'error occured while loading data'
    : undefined;

  return message
    ? {
        body: {
          emptyDataSourceMessage: message,
        },
      }
    : undefined;
}

function DetailPanel(rowData: FunctionData) {
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
}
