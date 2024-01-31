import type { NestedData } from '../data/read-file';
import { getTag, getTags, makeDate } from '../data/utils';


export function mapFamily(family: NestedData) {
    const marriagePlace = getTag(family, 'MARR', 'PLAC');
    return {
        id: family.data.xref_id as string,
        uid: getTag(family, '_UID')?.value as string,
        lastModified: makeDate(getTag(family, 'CHAN', 'DATE')),

        husband: getTag(family, 'HUSB')?.data.pointer,
        wife: getTag(family, 'WIFE')?.data.pointer,

        children: getTags(family, 'CHIL').length,
        married: {
            date: makeDate(getTag(family, 'MARR', 'DATE')),
            place: marriagePlace
                ? { name: marriagePlace.value, ref: getTag(marriagePlace, '_LOC')?.value ?? null }
                : null,
            status: getTag(family, '_STAT')?.value ?? null
        }
    };
}
export type MappedFamily = ReturnType<typeof mapFamily>;
