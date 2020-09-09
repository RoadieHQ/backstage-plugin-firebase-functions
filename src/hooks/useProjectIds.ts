import {
  catalogApiRef,
  useEntityCompoundName,
} from '@backstage/plugin-catalog';
import { useApi } from '@backstage/core';
import { useAsync } from 'react-use';

export const useProjectIds = () => {
  let entityCompoundName = useEntityCompoundName();
  if (!entityCompoundName.name) {
    entityCompoundName = {
      kind: 'Component',
      name: 'backstage',
      namespace: 'default',
    };
  }

  const catalogApi = useApi(catalogApiRef);

  const { value, loading, error } = useAsync(async () => {
    // const entity = await catalogApi.getEntityByName(name);
    // const rawProjects =
    //   entity?.metadata.annotations?.['cloud.google.com/project-ids'] ?? '';
    // const projects = rawProjects.split(',').map(p => p.trim());
    return ['backstage-test-project', 'backstage-test-project2'];
  });
  return { value, loading, error };
};
