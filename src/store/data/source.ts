import type { NestedData } from '../../types/nested-data';
import { createAppSlice } from '../create-app-slice';
import { getTag } from '../utils';


export function mapSource(person: NestedData) {
    return {
        id: person.data.xref_id as string,
        uid: getTag(person, '_UID')?.value as string,
        name: getTag(person, 'TITL')?.value as string,
        shortName: getTag(person, 'ABBR')?.value as string
    };
}
export type MappedSource = ReturnType<typeof mapSource>;

const { adapter, actions, name, reducer, getState } = createAppSlice('sources', 'SOUR', mapSource);

export { actions, name, reducer };

export const getSources = adapter.getSelectors(getState).selectEntities;
export const getSource = adapter.getSelectors(getState).selectById;
