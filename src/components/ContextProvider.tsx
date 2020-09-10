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
import { firebaseFunctionsApiRef } from '../api';
import { useLocalStorage } from 'react-use';
import { EntityCompoundName } from '@backstage/plugin-catalog';

export type State = {
  projects: string[];
  entity: EntityCompoundName;
};

export const StateContext = React.createContext<
  [State, React.Dispatch<React.SetStateAction<State | undefined>>]
>([] as any);
const STORAGE_KEY = `${firebaseFunctionsApiRef.id}.settings`;

const initialState: State = {
  projects: [],
  entity: {
    kind: 'Component',
    name: 'backstage',
    namespace: 'default',
  },
};

type Props = { entity: EntityCompoundName };
export const ContextProvider: React.FC<Props> = ({ entity, children }) => {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEY, initialState);
  if (settings === undefined) {
    throw new Error('Firebase functions plugin settings is undefined');
  }

  useEffect(() => {
    if (settings.entity != entity) {
      setSettings({ ...settings, entity });
    }
  }, [entity]);

  return (
    <StateContext.Provider value={[settings, setSettings]}>
      <>{children}</>
    </StateContext.Provider>
  );
};
