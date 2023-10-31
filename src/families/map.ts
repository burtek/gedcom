import type { NestedData } from '../data/read-file';
import { getPerson, getTag, getTags, makeDate } from '../data/utils';


const namesToString = (person: NestedData) => {
    const names = getTags(person, 'NAME');
    const married = names.find(n => getTag(n, 'TYPE')?.value === 'married');
    const birth = names.find(n => getTag(n, 'TYPE')?.value === 'birth');

    if (married && birth) {
        return `${getTag(married, 'GIVN')?.value} ${getTag(married, 'SURN')?.value} (${getTag(birth, 'SURN')?.value})`;
    } else if (married) {
        return `${getTag(married, 'GIVN')?.value} ${getTag(married, 'SURN')?.value}`;
    } else if (names[0]) {
        return `${getTag(names[0], 'GIVN')?.value} ${getTag(names[0], 'SURN')?.value}`;
    }
    return '???';
};

export function mapFamily(family: NestedData, allData: NestedData[]) {
    const husbandId = getTag(family, 'HUSB')?.value;
    const husband = husbandId ? getPerson(allData, husbandId) : undefined;

    const wifeId = getTag(family, 'WIFE')?.value;
    const wife = wifeId ? getPerson(allData, wifeId) : undefined;

    return {
        xref: family.data.xref_id as string,
        id: getTag(family, '_UID')?.value as string,
        lastModified: makeDate(getTag(family, 'CHAN', 'DATE')),

        hasHusband: Boolean(husband),
        husband: husband ? namesToString(husband) : null,
        hasWife: Boolean(wife),
        wife: wife ? namesToString(wife) : null,
        children: getTags(family, 'CHIL').length,
        married: {
            date: makeDate(getTag(family, 'MARR', 'DATE')),
            place: getTag(family, 'MARR', 'PLAC')?.value,
            status: getTag(family, '_STAT')?.value
        }
    };
}
export type MappedFamily = ReturnType<typeof mapFamily>;
