import type { NestedData } from '../data/read-file';
import { getTag } from '../data/utils';


export function mapSource(person: NestedData) {
    return {
        id: person.data.xref_id as string,
        uid: getTag(person, '_UID')?.value as string,
        name: getTag(person, 'TITL')?.value as string,
        shortName: getTag(person, 'ABBR')?.value as string
    };
}
export type MappedSource = ReturnType<typeof mapSource>;
