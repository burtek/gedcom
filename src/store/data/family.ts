import type { NestedData } from '../../types/nested-data';
import { createAppSlice } from '../create-app-slice';
import { getTag, getTags, makeDate } from '../utils';


export function mapFamily(family: NestedData) {
    const marriagePlace = getTag(family, 'MARR', 'PLAC');
    return {
        id: family.data.xref_id as string,
        uid: getTag(family, '_UID')?.value as string,
        lastModified: makeDate(getTag(family, 'CHAN', 'DATE')),

        husband: getTag(family, 'HUSB')?.data.pointer,
        wife: getTag(family, 'WIFE')?.data.pointer,

        children: getTags(family, 'CHIL').map(p => p.data.pointer),
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

const { adapter, actions, name, reducer, getState } = createAppSlice('families', 'FAM', mapFamily);

export { actions, name, reducer };

export const getFamilies = adapter.getSelectors(getState).selectAll;
export const getFamily = adapter.getSelectors(getState).selectById;
