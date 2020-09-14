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
import { Entity } from '@backstage/catalog-model';
import { Routes, Route } from 'react-router';
import { rootRouteRef } from '../plugin';
import FirebaseFunctionsPage from './FirebaseFunctionsPage';
import { FIREBASE_FUNCTION_IDS } from '../hooks/useFunctionIds';

export const isPluginApplicableToEntity = (entity: Entity) =>
  entity?.metadata.annotations?.[FIREBASE_FUNCTION_IDS];

export const Router = ({ entity }: { entity: Entity }) => (
  <Routes>
    <Route
      path={`/${rootRouteRef.path}`}
      element={<FirebaseFunctionsPage entity={entity} />}
    />
  </Routes>
);
