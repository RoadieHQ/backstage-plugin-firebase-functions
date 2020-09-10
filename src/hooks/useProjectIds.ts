import { catalogApiRef } from '@backstage/plugin-catalog';
import { useApi } from '@backstage/core';
import { useAsync } from 'react-use';
import { useSettings } from './useSettings';

export const useProjectIds = () => {
  let [{ entity: entityCompoundName }] = useSettings();

  const catalogApi = useApi(catalogApiRef);

  const { value, loading, error } = useAsync(async () => {
    const entity = await catalogApi.getEntityByName(entityCompoundName);
    const rawProjects =
      entity?.metadata.annotations?.['cloud.google.com/project-ids'] ?? '';
    const projects = rawProjects.split(',').map(p => p.trim());
    return projects;
  });
  return { value, loading, error };
};
