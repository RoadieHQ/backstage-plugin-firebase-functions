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
import { Routes, Route } from 'react-router-dom';
import { entityContentRouteRef } from '../plugin';
import FirebaseFunctionsPage from './FirebaseFunctionsPage';
import { FIREBASE_FUNCTION_IDS } from '../hooks/useFunctionIds';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import {useEntity} from "@backstage/plugin-catalog-react";

export const isFirebaseFunctionsAvailable = (entity: Entity) =>
  Boolean(entity?.metadata.annotations?.[FIREBASE_FUNCTION_IDS]);

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const Router = (_props: Props) => {
  const { entity } = useEntity()

  return !isFirebaseFunctionsAvailable(entity) ? (
      <MissingAnnotationEmptyState annotation={FIREBASE_FUNCTION_IDS} />
  ) : (
      <Routes>
        <Route
            path={`/${entityContentRouteRef.path}`}
            element={<FirebaseFunctionsPage entity={entity} />}
        />
      </Routes>
  );
};
