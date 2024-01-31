import type { NestedData } from '../data/read-file';
import { getTag } from '../data/utils';


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
