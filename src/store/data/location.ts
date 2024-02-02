import type { NestedData } from '../../types/nested-data';
import { createAppSlice } from '../create-app-slice';
import { getTag } from '../utils';


export function mapLocation(location: NestedData) {
    return {
        id: location.data.xref_id as string,
        uid: getTag(location, '_UID')?.value as string,

        map: {
            lat: getTag(location, 'MAP', 'LATI')?.value,
            lon: getTag(location, 'MAP', 'LONG')?.value
        },
        name: getTag(location, 'NAME')?.value
    };
}
export type MappedLocation = ReturnType<typeof mapLocation>;

const { adapter, actions, name, reducer, getState } = createAppSlice('locations', '_LOC', mapLocation);

export { actions, name, reducer };

export const getLocations = adapter.getSelectors(getState).selectAll;
