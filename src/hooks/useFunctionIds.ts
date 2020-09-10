import { catalogApiRef } from '@backstage/plugin-catalog';
import { useApi } from '@backstage/core';
import { useAsync } from 'react-use';
import { useSettings } from './useSettings';

export const useFunctionIds = () => {
  let [{ entity: entityCompoundName }] = useSettings();

  const catalogApi = useApi(catalogApiRef);

  const { value, loading, error } = useAsync(async () => {
    const entity = await catalogApi.getEntityByName(entityCompoundName);
    const rawProjects =
      entity?.metadata.annotations?.['cloud.google.com/function-ids'] ?? '';
    const functions = rawProjects.split(',').map(p => p.trim());
    const availableProjects = [...new Set(functions.map(f => f.split('/')[1]))];
    return { availableProjects, functions };
  });
  return { value, loading, error };
};
