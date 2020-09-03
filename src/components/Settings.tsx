/*
 * Copyright 2020 Spotify AB
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
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Snackbar,
  Button,
  TextField,
  makeStyles,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import { useSettings, AuthMethod } from '../helpers/ContextProvider';

const useStyles = makeStyles(theme => ({
  tabPanelRoot: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Settings: React.FC = () => {
  const classes = useStyles();
  const [settings, saveSettings] = useSettings();

  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [authMethod, setAuthMethod] = useState(settings.authMethod);
  const [project, setProject] = useState(settings.project);

  const [saved, setSaved] = useState(false);

  return (
    <>
      <Snackbar
        autoHideDuration={1000}
        open={saved}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSaved(false)}
      >
        <Alert severity="success">Settings saved in local storage.</Alert>
      </Snackbar>
      <Accordion style={{ maxWidth: '400px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.tabPanelRoot}>
            <TextField
              name="project"
              label="Firebase project name"
              value={project}
              onChange={e => setProject(e.target.value)}
              fullWidth
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Authentication method</FormLabel>
              <RadioGroup
                row
                aria-label="Authentication-method"
                name="AuthenticationMethod"
                value={authMethod}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAuthMethod(
                    (event.target as HTMLInputElement).value as AuthMethod,
                  );
                }}
              >
                <FormControlLabel
                  labelPlacement="end"
                  value="OAuth2"
                  control={<Radio color="primary" />}
                  label="OAuth2"
                />
                <FormControlLabel
                  labelPlacement="end"
                  value="API_KEY"
                  control={<Radio color="primary" />}
                  label="Api key"
                />
              </RadioGroup>
            </FormControl>
            <Collapse in={authMethod === 'API_KEY'} style={{ marginTop: 0 }}>
              <TextField
                name="apiKey"
                fullWidth
                label="Google api key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
            </Collapse>
            <Box mt={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSaved(true);
                  saveSettings({
                    apiKey,
                    authMethod,
                    project,
                  });
                }}
              >
                Save settings
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default Settings;
