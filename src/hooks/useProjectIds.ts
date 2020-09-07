import { EntityCompoundName, catalogApiRef } from '@backstage/plugin-catalog';
import { useApi } from '@backstage/core';
import { useAsync } from 'react-use';

export const useProjectIds = (name: EntityCompoundName) => {
  const catalogApi = useApi(catalogApiRef);

  const { value, loading, error } = useAsync(async () => {
    const entity = await catalogApi.getEntityByName(name);
    return entity?.metadata.annotations?.['cloud.google.com/project-ids'] ?? '';
  });
  return { value, loading, error };
};
